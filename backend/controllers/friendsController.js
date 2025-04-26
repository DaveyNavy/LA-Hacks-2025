import "dotenv/config";
import { neon } from "@neondatabase/serverless";
const sql = neon(process.env.DATABASE_URL);

exports.getFriends = async (req, res) => {
    const username = req.username;

    if (!username) {
        return res.status(400).json({ error: 'Missing username' });
    }

    const userResult = await sql.query('SELECT username FROM users WHERE username = $1', [username]);
    if (userResult.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
    }

    const userId = userResult.rows[0].username;

    const result = await sql.query(
        `SELECT f.friend AS username FROM friends f
        WHERE f.username = $1`,
        [userId]
    );

    res.json(result.rows);
}