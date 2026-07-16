import bcrypt from 'bcrypt';
import db from '../db/db.js';

// POST /api/auth/login
async function login(req, res) {
  const { id, password } = req.body;

  try {
    // 1. Look up the user by government ID
    const [rows] = await db.query(
      'SELECT * FROM user WHERE gov_id = ? OR bus_card_number = ?',
      [id, id]
    );
    if (rows.length === 0) {
      return res.json({
        success: false,
        reason: 'ID or Bus Card number not found.',
      });
    }

    const user = rows[0];

    // 2. Compare entered password with hashed password in DB
    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      return res.json({
        success: false,
        reason: 'Password is incorrect.',
      });
    }

    // 3. Success — send back the gov_id so the frontend can use it on future requests
    return res.json({
      success: true,
      gov_id: user.gov_id,
      email: user.email,
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, reason: 'Server error.' });
  }
}

// PUT /api/auth/:gov_id/password
async function password (req, res) {
    const { gov_id } = req.params;
    const { password } = req.body;

    try {
        const [userCheck] = await db.query('SELECT * FROM user WHERE gov_id = ?', [gov_id]);
        if (userCheck.length === 0) {
            return res.status(404).json({ success: false, message: 'Target user not found.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await db.query('UPDATE user SET password = ? WHERE gov_id = ?', [hashedPassword, gov_id]);

        return res.status(200).json({ success: true, message: 'Password updated successfully.' });
    } catch (error) {
        console.error('Error updating password:', error);
        return res.status(500).json({ success: false, message: 'There was an issue updating the password.' });
    }
}

// POST /api/auth/register
async function register(req, res) {
  const {
    gov_id,
    card_number,
    physical_address,
    phone_number,
    email,
    password,
  } = req.body;

  try {
    // 1. Check that this card number exists in Tshwane Bus Service's records
    const [cardRows] = await db.query(
      'SELECT * FROM bus_card WHERE card_number = ?',
      [card_number]
    );

    if (cardRows.length === 0) {
      return res.json({
        success: false,
        reason: 'Card number not found in system.',
      });
    }

    // 2. Check the gov_id matches the one linked to that card
    const linkedCard = cardRows[0];
    const [[user]] = await db.query(
      'SELECT * FROM user WHERE user.id = ?',
      [linkedCard.user_id]
    );
    if (!user || user.gov_id !== gov_id) {
      return res.json({
        success: false,
        reason: "The ID entered doesn't match the linked card number.",
      });
    }

    // 3. Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Insert the new user
    await db.query(
      `UPDATE user
         SET physical_address = ?, phone_number = ?, email = ?, password = ?
       WHERE id = ?`,
      [physical_address, phone_number, email, hashedPassword, user.id]
    );

    return res.json({ success: true });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, reason: 'Server error.' });
  }
}

export { login, register, password };
