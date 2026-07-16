import db from './db/db.js';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.route.js';
import usersRoutes from './routes/users.route.js';
import axios from 'axios';

const app = express();

app.use(cors());
app.use(express.json()); // lets Express read JSON from req.body

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);

const PAYSTACK_SECRET_KEY='sk_test_48522c9c21a16b1339015fcc3a604bc81ecbb54f';
const SK = PAYSTACK_SECRET_KEY;

app.post('/api/pay', async (req, res) => {
    const { email, amount, cardNumber } = req.body;
    const response = await axios.post(
      'https://api.paystack.co/transaction/initialize', 
      { email, 
        amount: amount * 100, 
        callback_url: "http://localhost:5173", 
        metadata: { cardNumber } 
      },
      { 
        headers: { 
          Authorization: `Bearer ${SK}` 
        } 
      });
    res.json(response.data.data);
});

// Paystack Verify
app.get('/api/verify/:ref', async (req, res) => {
    const [exist] = await db.query("SELECT * FROM transactions WHERE reference = ?", [req.params.ref]);
    if (exist.length > 0) return res.send("Already done");

    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${req.params.ref}`,
      { 
        headers: { 
          Authorization: `Bearer ${SK}` 
        } 
      });

    if (response.data.data.status === 'success') {
        const { amount, metadata } = response.data.data;
        await db.query(
          "INSERT INTO transactions (reference, card_number, amount) VALUES (?,?,?)", 
          [req.params.ref, metadata.cardNumber, amount / 100]
        );
        await db.query(
          "UPDATE bus_card SET balance = balance + ? WHERE card_number = ?", 
          [amount / 100, metadata.cardNumber]
        );
        res.send("Success");
    }
});

app.get('/api/balance/:cardNumber', async (req, res) => {
    try {
        const [rows] = await db.query("SELECT balance FROM bus_card WHERE card_number = ?", [req.params.cardNumber]);
        res.json(rows[0]);
    } catch (err) { res.status(500).send(err.message); }
});

app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
