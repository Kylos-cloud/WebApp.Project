const express = require('express');
const db = require('../db');
const { authRequired, adminRequired } = require('../middleware/auth');

const router = express.Router();

// Admin: list all users with their order count.
router.get('/', authRequired, adminRequired, async (req, res) => {
  const result = await db.query(`
    SELECT u.id, u.email, u.name, u.is_admin, u.created_at,
           COUNT(o.id)::int AS order_count
      FROM users u LEFT JOIN orders o ON o.user_id = u.id
     GROUP BY u.id
     ORDER BY u.id DESC
  `);
  res.json(result.rows);
});

// Admin: toggle is_admin on a user. Refuses to demote yourself so you can't
// accidentally lock the last admin out of the panel.
router.patch('/:id', authRequired, adminRequired, async (req, res) => {
  const { is_admin } = req.body;
  if (typeof is_admin !== 'boolean') {
    return res.status(400).json({ error: 'is_admin must be boolean' });
  }
  if (Number(req.params.id) === req.user.id && !is_admin) {
    return res.status(400).json({ error: 'Өөрийн admin эрхээ хасах боломжгүй' });
  }
  const result = await db.query(
    'UPDATE users SET is_admin = $1 WHERE id = $2 RETURNING id, email, name, is_admin, created_at',
    [is_admin, req.params.id]
  );
  if (!result.rows[0]) return res.status(404).json({ error: 'Not found' });
  res.json(result.rows[0]);
});

// Admin: delete a user. Same self-protection.
router.delete('/:id', authRequired, adminRequired, async (req, res) => {
  if (Number(req.params.id) === req.user.id) {
    return res.status(400).json({ error: 'Өөрийгөө устгах боломжгүй' });
  }
  await db.query('DELETE FROM users WHERE id = $1', [req.params.id]);
  res.status(204).end();
});

module.exports = router;
