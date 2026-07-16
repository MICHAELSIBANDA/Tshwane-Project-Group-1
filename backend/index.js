require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());

console.log("DB Host from Env:", process.env.DB_HOST);

// Connection to Aiven
const db = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: {
        // We added || 'ca.pem' so it won't be undefined anymore
        ca: fs.readFileSync(path.join(__dirname, process.env.AIVEN_CA_PATH || 'ca.pem')),
        rejectUnauthorized: false
    }
});
const SK = process.env.PAYSTACK_SECRET_KEY;

// Register
// --- UPDATED REGISTRATION ROUTE ---
app.post('/api/register', async (req, res) => {
    const { 
        gov_id, first_name, last_name, physical_address, 
        phone_number, email, password, card_number 
    } = req.body;

    try {
        // Insert into 'user' table with the unified physical_address
        const [userResult] = await db.execute(
            `INSERT INTO user (gov_id, card_number, first_name, last_name, physical_address, phone_number, email, password) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [gov_id, card_number, first_name, last_name, physical_address, phone_number, email, password]
        );

        const userId = userResult.insertId;

        // Create the associated bus card for balance tracking
        await db.execute(
            "INSERT INTO bus_card (user_id, card_number) VALUES (?, ?)", 
            [userId, card_number]
        );

        res.json({ message: "Registration Successful" });
    } catch (err) {
        console.error("DATABASE ERROR:", err.message);
        res.status(500).send(err.message);
    }
});

// Login
// --- UPDATED LOGIN ROUTE ---
app.post('/api/login', async (req, res) => {
    const { identifier, password } = req.body; // 'identifier' can be ID or Card Number

    try {
        // Query to check if the identifier matches gov_id OR card_number
        const query = `
            SELECT u.*, c.card_number, c.balance 
            FROM user u
            JOIN bus_card c ON u.id = c.user_id
            WHERE (u.gov_id = ? OR c.card_number = ?) 
            AND u.password = ?
        `;

        const [results] = await db.execute(query, [identifier, identifier, password]);

        if (results.length > 0) {
            // Success: Send back user and card details
            res.json({ 
                user: { id: results[0].id, first_name: results[0].first_name, last_name: results[0].last_name, email: results[0].email },
                card: { card_number: results[0].card_number, balance: results[0].balance }
            });
        } else {
            res.status(401).send("Invalid ID/Card Number or Password");
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});

// Paystack Initialize
app.post('/api/pay', async (req, res) => {
    const { email, amount, cardNumber } = req.body;
    const response = await axios.post('https://api.paystack.co/transaction/initialize', 
    { email, amount: amount * 100, callback_url: "http://localhost:5173", metadata: { cardNumber } },
    { headers: { Authorization: `Bearer ${SK}` } });
    res.json(response.data.data);
});

// Paystack Verify
app.get('/api/verify/:ref', async (req, res) => {
    const [exist] = await db.execute("SELECT * FROM transactions WHERE reference = ?", [req.params.ref]);
    if (exist.length > 0) return res.send("Already done");

    const response = await axios.get(`https://api.paystack.co/transaction/verify/${req.params.ref}`, 
    { headers: { Authorization: `Bearer ${SK}` } });

    if (response.data.data.status === 'success') {
        const { amount, metadata } = response.data.data;
        await db.execute("INSERT INTO transactions (reference, card_number, amount) VALUES (?,?,?)", [req.params.ref, metadata.cardNumber, amount / 100]);
        await db.execute("UPDATE bus_card SET balance = balance + ? WHERE card_number = ?", [amount / 100, metadata.cardNumber]);
        res.send("Success");
    }
});

app.get('/api/balance/:cardNumber', async (req, res) => {
    try {
        const [rows] = await db.execute("SELECT balance FROM bus_card WHERE card_number = ?", [req.params.cardNumber]);
        res.json(rows[0]);
    } catch (err) { res.status(500).send(err.message); }
});

// --- CHANGE PASSWORD ROUTE ---
app.post('/api/change-password', async (req, res) => {
    const { userId, currentPassword, newPassword } = req.body;

    try {
        // 1. Check if the current password matches what is in the database
        const [rows] = await db.execute("SELECT password FROM user WHERE id = ?", [userId]);
        
        if (rows.length === 0 || rows[0].password !== currentPassword) {
            return res.status(400).send("Current password is incorrect");
        }

        // 2. If correct, update to the new password
        await db.execute("UPDATE user SET password = ? WHERE id = ?", [newPassword, userId]);
        res.send("Success");
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.listen(5000, () => console.log("Server on 5000"));