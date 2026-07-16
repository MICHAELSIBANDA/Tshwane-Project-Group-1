 const fetchLatestBalance = async (cardNumber) => {
        try {
            const res = await axios.get(`http://localhost:5000/api/balance/${cardNumber}`);
            setCard(prev => ({ ...prev, balance: res.data.balance }));
        } catch (err) { console.error("Balance fetch failed"); }
    };
 
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
 
 