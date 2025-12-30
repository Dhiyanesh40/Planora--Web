import { Router, Response } from 'express';
import { pool } from '../config/database';
import { authenticate, AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import { randomUUID } from 'crypto';

const router = Router();

// Get activities for an itinerary
router.get('/itinerary/:itineraryId', async (req, res: Response) => {
  const { itineraryId } = req.params;

  const connection = await pool.getConnection();
  try {
    const [itineraries]: any = await connection.query(
      'SELECT activities FROM itineraries WHERE id = ?',
      [itineraryId]
    );

    if (itineraries.length === 0) {
      throw new AppError('Itinerary not found', 404);
    }

    let activities = [];
    try {
      const activitiesData = itineraries[0].activities;
      if (typeof activitiesData === 'string') {
        activities = JSON.parse(activitiesData);
      } else if (Array.isArray(activitiesData)) {
        activities = activitiesData;
      }
    } catch (e) {
      console.error('Error parsing activities:', e, 'Value:', itineraries[0].activities);
      activities = [];
    }

    // Sort activities by day_number and order_index
    activities.sort((a: any, b: any) => {
      if (a.day_number !== b.day_number) {
        return a.day_number - b.day_number;
      }
      return a.order_index - b.order_index;
    });

    res.json(activities);
  } finally {
    connection.release();
  }
});

// Create activity
router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
  const {
    itinerary_id,
    day_number,
    title,
    description,
    location,
    start_time,
    duration_minutes,
    estimated_cost,
    order_index,
    notes,
    photo_url,
  } = req.body;

  if (!itinerary_id || !day_number || !title) {
    throw new AppError('Missing required fields', 400);
  }

  const connection = await pool.getConnection();
  try {
    // Verify user owns the itinerary
    const userId = req.user!.id;
    const [itineraries]: any = await connection.query(
      'SELECT user_id, activities FROM itineraries WHERE id = ?',
      [itinerary_id]
    );

    if (itineraries.length === 0 || itineraries[0].user_id !== userId) {
      throw new AppError('Not authorized to add activities to this itinerary', 403);
    }

    // Get existing activities
    let activities = itineraries[0].activities 
      ? JSON.parse(itineraries[0].activities) 
      : [];

    // Create new activity
    const newActivity = {
      id: randomUUID(),
      itinerary_id,
      day_number,
      title,
      description: description || null,
      location: location || null,
      start_time: start_time || null,
      duration_minutes: duration_minutes || 60,
      estimated_cost: estimated_cost || 0,
      order_index: order_index !== undefined ? order_index : activities.length,
      notes: notes || null,
      photo_url: photo_url || null,
      created_at: new Date().toISOString(),
    };

    activities.push(newActivity);

    // Update itinerary with new activities
    await connection.query(
      'UPDATE itineraries SET activities = ? WHERE id = ?',
      [JSON.stringify(activities), itinerary_id]
    );

    res.status(201).json(newActivity);
  } finally {
    connection.release();
  }
});

// Bulk create activities
router.post('/bulk', authenticate, async (req: AuthRequest, res: Response) => {
  const { activities } = req.body;

  if (!activities || !Array.isArray(activities) || activities.length === 0) {
    throw new AppError('Activities array is required', 400);
  }

  const connection = await pool.getConnection();
  try {
    // Verify user owns the itinerary
    const userId = req.user!.id;
    const itineraryId = activities[0].itinerary_id;

    const [itineraries]: any = await connection.query(
      'SELECT user_id, activities FROM itineraries WHERE id = ?',
      [itineraryId]
    );

    if (itineraries.length === 0 || itineraries[0].user_id !== userId) {
      throw new AppError('Not authorized to add activities to this itinerary', 403);
    }

    // Add IDs and timestamps to activities
    const newActivities = activities.map(activity => ({
      ...activity,
      id: randomUUID(),
      created_at: new Date().toISOString(),
    }));

    // Update itinerary with activities
    await connection.query(
      'UPDATE itineraries SET activities = ? WHERE id = ?',
      [JSON.stringify(newActivities), itineraryId]
    );

    res.status(201).json(newActivities);
  } finally {
    connection.release();
  }
});

// Update activity
router.put('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user!.id;

  const connection = await pool.getConnection();
  try {
    // Find itinerary containing this activity
    const [itineraries]: any = await connection.query(
      'SELECT id, user_id, activities FROM itineraries WHERE JSON_CONTAINS(activities, JSON_QUOTE(?), "$[*].id")',
      [id]
    );

    if (itineraries.length === 0) {
      throw new AppError('Activity not found', 404);
    }

    const itinerary = itineraries[0];

    if (itinerary.user_id !== userId) {
      throw new AppError('Not authorized to update this activity', 403);
    }

    // Get activities and update the specific one
    let activities = JSON.parse(itinerary.activities);
    const activityIndex = activities.findIndex((a: any) => a.id === id);

    if (activityIndex === -1) {
      throw new AppError('Activity not found', 404);
    }

    activities[activityIndex] = {
      ...activities[activityIndex],
      ...req.body,
      id, // Preserve ID
    };

    // Update itinerary
    await connection.query(
      'UPDATE itineraries SET activities = ? WHERE id = ?',
      [JSON.stringify(activities), itinerary.id]
    );

    res.json(activities[activityIndex]);
  } finally {
    connection.release();
  }
});

// Delete activity
router.delete('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user!.id;

  const connection = await pool.getConnection();
  try {
    // Find itinerary containing this activity
    const [itineraries]: any = await connection.query(
      'SELECT id, user_id, activities FROM itineraries WHERE JSON_CONTAINS(activities, JSON_QUOTE(?), "$[*].id")',
      [id]
    );

    if (itineraries.length === 0) {
      throw new AppError('Activity not found', 404);
    }

    const itinerary = itineraries[0];

    if (itinerary.user_id !== userId) {
      throw new AppError('Not authorized to delete this activity', 403);
    }

    // Remove activity
    let activities = JSON.parse(itinerary.activities);
    activities = activities.filter((a: any) => a.id !== id);

    // Update itinerary
    await connection.query(
      'UPDATE itineraries SET activities = ? WHERE id = ?',
      [JSON.stringify(activities), itinerary.id]
    );

    res.json({ message: 'Activity deleted successfully' });
  } finally {
    connection.release();
  }
});

// Delete all activities for an itinerary
router.delete('/itinerary/:itineraryId', authenticate, async (req: AuthRequest, res: Response) => {
  const { itineraryId } = req.params;
  const userId = req.user!.id;

  const connection = await pool.getConnection();
  try {
    // Verify ownership
    const [itineraries]: any = await connection.query(
      'SELECT user_id FROM itineraries WHERE id = ?',
      [itineraryId]
    );

    if (itineraries.length === 0 || itineraries[0].user_id !== userId) {
      throw new AppError('Not authorized to delete activities for this itinerary', 403);
    }

    // Clear activities
    await connection.query(
      'UPDATE itineraries SET activities = ? WHERE id = ?',
      [JSON.stringify([]), itineraryId]
    );

    res.json({ message: 'All activities deleted successfully' });
  } finally {
    connection.release();
  }
});

export default router;
