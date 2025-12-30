import { Router, Response } from 'express';
import { pool } from '../config/database';
import { authenticate, AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

const router = Router();

// Get current user's profile
router.get('/me', authenticate, async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;

  const connection = await pool.getConnection();
  try {
    const [users]: any = await connection.query(
      'SELECT id, name AS full_name, email, contact_info AS avatar_url, created_at FROM users WHERE id = ?',
      [userId]
    );

    if (users.length === 0) {
      throw new AppError('Profile not found', 404);
    }

    res.json(users[0]);
  } finally {
    connection.release();
  }
});

// Get profile by ID
router.get('/:id', async (req, res: Response) => {
  const { id } = req.params;

  const connection = await pool.getConnection();
  try {
    const [users]: any = await connection.query(
      'SELECT id, name AS full_name, email, contact_info AS avatar_url, created_at FROM users WHERE id = ?',
      [id]
    );

    if (users.length === 0) {
      throw new AppError('Profile not found', 404);
    }

    res.json(users[0]);
  } finally {
    connection.release();
  }
});

// Update profile
router.put('/me', authenticate, async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const { full_name, avatar_url } = req.body;

  const connection = await pool.getConnection();
  try {
    await connection.query(
      'UPDATE users SET name = ?, contact_info = ? WHERE id = ?',
      [full_name, avatar_url, userId]
    );

    const [users]: any = await connection.query(
      'SELECT id, name AS full_name, email, contact_info AS avatar_url, created_at FROM users WHERE id = ?',
      [userId]
    );

    res.json(users[0]);
  } finally {
    connection.release();
  }
});

export default router;
