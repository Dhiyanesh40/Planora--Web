import { Router, Response } from 'express';
import { pool } from '../config/database';
import { authenticate, AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import { randomUUID } from 'crypto';

const router = Router();

// Get all itineraries (user's own + public ones)
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;

  const connection = await pool.getConnection();
  try {
    const [itineraries]: any = await connection.query(
      `SELECT * FROM itineraries 
       WHERE user_id = ? OR is_public = TRUE 
       ORDER BY created_at DESC`,
      [userId]
    );

    // Parse JSON fields safely
    const formattedItineraries = itineraries.map((it: any) => {
      let activities = [];
      let preferences = [];
      
      try {
        if (typeof it.activities === 'string') {
          activities = JSON.parse(it.activities);
        } else if (Array.isArray(it.activities)) {
          activities = it.activities;
        }
      } catch (e) {
        console.error('Error parsing activities for itinerary', it.id, e);
      }
      
      try {
        if (typeof it.preferences === 'string') {
          preferences = JSON.parse(it.preferences);
        } else if (Array.isArray(it.preferences)) {
          preferences = it.preferences;
        }
      } catch (e) {
        console.error('Error parsing preferences for itinerary', it.id, e);
      }
      
      return {
        ...it,
        activities,
        preferences,
        budget: parseFloat(it.budget),
      };
    });

    res.json(formattedItineraries);
  } finally {
    connection.release();
  }
});

// Get public itineraries (for non-authenticated users)
router.get('/public', async (req, res: Response) => {
  const connection = await pool.getConnection();
  try {
    const [itineraries]: any = await connection.query(
      'SELECT * FROM itineraries WHERE is_public = TRUE ORDER BY created_at DESC'
    );

    const formattedItineraries = itineraries.map((it: any) => {
      let activities = [];
      let preferences = [];
      
      try {
        if (typeof it.activities === 'string') {
          activities = JSON.parse(it.activities);
        } else if (Array.isArray(it.activities)) {
          activities = it.activities;
        }
      } catch (e) {
        console.error('Error parsing activities for public itinerary', it.id, e);
      }
      
      try {
        if (typeof it.preferences === 'string') {
          preferences = JSON.parse(it.preferences);
        } else if (Array.isArray(it.preferences)) {
          preferences = it.preferences;
        }
      } catch (e) {
        console.error('Error parsing preferences for public itinerary', it.id, e);
      }
      
      return {
        ...it,
        activities,
        preferences,
        budget: parseFloat(it.budget),
      };
    });

    res.json(formattedItineraries);
  } finally {
    connection.release();
  }
});

// Get single itinerary
router.get('/:id', async (req, res: Response) => {
  const { id } = req.params;

  const connection = await pool.getConnection();
  try {
    const [itineraries]: any = await connection.query(
      'SELECT * FROM itineraries WHERE id = ?',
      [id]
    );

    if (itineraries.length === 0) {
      throw new AppError('Itinerary not found', 404);
    }

    const itinerary = itineraries[0];
    
    // Parse JSON fields safely
    let activities = [];
    let preferences = [];
    
    try {
      if (typeof itinerary.activities === 'string') {
        activities = JSON.parse(itinerary.activities);
      } else if (Array.isArray(itinerary.activities)) {
        activities = itinerary.activities;
      }
    } catch (e) {
      console.error('Error parsing activities:', e);
    }
    
    try {
      if (typeof itinerary.preferences === 'string') {
        preferences = JSON.parse(itinerary.preferences);
      } else if (Array.isArray(itinerary.preferences)) {
        preferences = itinerary.preferences;
      }
    } catch (e) {
      console.error('Error parsing preferences:', e);
    }
    
    res.json({
      ...itinerary,
      activities,
      preferences,
      budget: parseFloat(itinerary.budget),
    });
  } catch (error) {
    console.error('Error fetching itinerary:', error);
    throw error;
  } finally {
    connection.release();
  }
});

// Create itinerary
router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const { destination, start_date, end_date, budget, preferences, notes } = req.body;

  if (!destination || !start_date || !end_date || !budget) {
    throw new AppError('Missing required fields', 400);
  }

  // Convert ISO dates to MySQL DATE format (YYYY-MM-DD)
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const connection = await pool.getConnection();
  try {
    const itineraryId = randomUUID();

    await connection.query(
      `INSERT INTO itineraries 
       (id, user_id, destination, start_date, end_date, budget, preferences, notes, activities) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        itineraryId,
        userId,
        destination,
        formatDate(start_date),
        formatDate(end_date),
        budget,
        JSON.stringify(preferences || []),
        notes || null,
        JSON.stringify([]), // Empty activities array initially
      ]
    );

    const [itineraries]: any = await connection.query(
      'SELECT * FROM itineraries WHERE id = ?',
      [itineraryId]
    );

    const itinerary = itineraries[0];
    res.status(201).json({
      ...itinerary,
      activities: [],
      preferences: preferences || [],
      budget: parseFloat(itinerary.budget),
    });
  } finally {
    connection.release();
  }
});

// Update itinerary
router.put('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const { id } = req.params;
  const { destination, start_date, end_date, budget, preferences, notes, is_public } = req.body;

  console.log('=== UPDATE ITINERARY DEBUG ===');
  console.log('ID:', id);
  console.log('User ID:', userId);
  console.log('Body:', JSON.stringify(req.body, null, 2));

  const connection = await pool.getConnection();
  try {
    // Check ownership
    const [existing]: any = await connection.query(
      'SELECT user_id FROM itineraries WHERE id = ?',
      [id]
    );

    if (existing.length === 0 || existing[0].user_id !== userId) {
      throw new AppError('Not authorized to update this itinerary', 403);
    }

    console.log('Ownership verified. Executing UPDATE...');

    // Convert ISO dates to MySQL DATE format (YYYY-MM-DD)
    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    };

    await connection.query(
      `UPDATE itineraries 
       SET destination = ?, start_date = ?, end_date = ?, budget = ?, 
           preferences = ?, notes = ?, is_public = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [
        destination,
        formatDate(start_date),
        formatDate(end_date),
        budget,
        JSON.stringify(preferences || []),
        notes || null,
        is_public !== undefined ? is_public : false,
        id,
      ]
    );

    const [itineraries]: any = await connection.query(
      'SELECT * FROM itineraries WHERE id = ?',
      [id]
    );

    const itinerary = itineraries[0];
    
    // Safe JSON parsing for response
    let activities = [];
    let preferencesData = [];
    
    try {
      if (typeof itinerary.activities === 'string') {
        activities = JSON.parse(itinerary.activities);
      } else if (Array.isArray(itinerary.activities)) {
        activities = itinerary.activities;
      }
    } catch (e) {
      console.error('Error parsing activities in update response:', e);
    }
    
    try {
      if (typeof itinerary.preferences === 'string') {
        preferencesData = JSON.parse(itinerary.preferences);
      } else if (Array.isArray(itinerary.preferences)) {
        preferencesData = itinerary.preferences;
      }
    } catch (e) {
      console.error('Error parsing preferences in update response:', e);
    }
    
    res.json({
      ...itinerary,
      activities,
      preferences: preferencesData,
      budget: parseFloat(itinerary.budget),
    });
  } catch (error) {
    console.error('Error updating itinerary:', error);
    throw error;
  } finally {
    connection.release();
  }
});

// Delete itinerary
router.delete('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const { id } = req.params;

  const connection = await pool.getConnection();
  try {
    // Check ownership
    const [existing]: any = await connection.query(
      'SELECT user_id FROM itineraries WHERE id = ?',
      [id]
    );

    if (existing.length === 0 || existing[0].user_id !== userId) {
      throw new AppError('Not authorized to delete this itinerary', 403);
    }

    await connection.query('DELETE FROM itineraries WHERE id = ?', [id]);

    res.json({ message: 'Itinerary deleted successfully' });
  } finally {
    connection.release();
  }
});

export default router;
