import db from '../db/db.js';

// GET /api/users/:gov_id/home
async function getHome(req, res) {
  const { gov_id } = req.params;

  try {
    const [rows] = await db.query(
      'SELECT u.first_name, u.last_name, u.gov_id, bc.balance FROM user u, bus_card bc WHERE bc.user_id = u.id AND u.gov_id = ?',
      [gov_id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const user = rows[0];

    return res.json({
      first_name: user.first_name,
      last_name: user.last_name,
      gov_id: user.gov_id,
      balance: user.balance,
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error.' });
  }
}

export default { getHome };
