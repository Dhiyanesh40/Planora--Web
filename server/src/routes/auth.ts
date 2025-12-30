import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { randomUUID } from 'crypto';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d';

// Helper to generate JWT token
const generateToken = (user: any) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

// Sign Up
router.post('/signup', async (req: Request, res: Response) => {
  const { email, password, fullName, role } = req.body;

  if (!email || !password || !fullName) {
    throw new AppError('Email, password, and full name are required', 400);
  }

  const connection = await pool.getConnection();

  try {
    // Check if user already exists
    const [existing]: any = await connection.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existing.length > 0) {
      throw new AppError('User with this email already exists', 400);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = randomUUID();

    // Insert new user
    await connection.query(
      'INSERT INTO users (id, name, email, password, role, contact_info) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, fullName, email, hashedPassword, role || 'traveler', email]
    );

    // Get created user
    const [users]: any = await connection.query(
      'SELECT id, name, email, role, contact_info, created_at FROM users WHERE id = ?',
      [userId]
    );

    const user = users[0];
    const token = generateToken(user);

    res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        user_metadata: {
          full_name: user.name,
          role: user.role,
        },
      },
      session: {
        access_token: token,
        refresh_token: token,
        expires_in: 604800,
      },
    });
  } finally {
    connection.release();
  }
});

// Sign In
router.post('/signin', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError('Email and password are required', 400);
  }

  const connection = await pool.getConnection();

  try {
    const [users]: any = await connection.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      throw new AppError('Invalid email or password', 401);
    }

    const user = users[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new AppError('Invalid email or password', 401);
    }

    const token = generateToken(user);

    res.json({
      user: {
        id: user.id,
        email: user.email,
        user_metadata: {
          full_name: user.name,
          role: user.role,
        },
      },
      session: {
        access_token: token,
        refresh_token: token,
        expires_in: 604800,
      },
    });
  } finally {
    connection.release();
  }
});

// Sign Out
router.post('/signout', async (req: Request, res: Response) => {
  res.json({ message: 'Signed out successfully' });
});

// Get Current User
router.get('/user', async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AppError('No authorization token provided', 401);
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;

    const connection = await pool.getConnection();
    try {
      const [users]: any = await connection.query(
        'SELECT id, name, email, role, contact_info, created_at FROM users WHERE id = ?',
        [decoded.id]
      );

      if (users.length === 0) {
        throw new AppError('User not found', 404);
      }

      const user = users[0];

      res.json({
        user: {
          id: user.id,
          email: user.email,
          user_metadata: {
            full_name: user.name,
            role: user.role,
          },
        },
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    throw new AppError('Invalid or expired token', 401);
  }
});

// Get Session
router.get('/session', async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.json({ session: null });
    return;
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;

    const connection = await pool.getConnection();
    try {
      const [users]: any = await connection.query(
        'SELECT id, name, email, role FROM users WHERE id = ?',
        [decoded.id]
      );

      if (users.length === 0) {
        res.json({ session: null });
        return;
      }

      const user = users[0];

      res.json({
        session: {
          access_token: token,
          user: {
            id: user.id,
            email: user.email,
            user_metadata: {
              full_name: user.name,
              role: user.role,
            },
          },
        },
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    res.json({ session: null });
  }
});

export default router;
