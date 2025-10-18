import express from 'express';
import { ObjectId } from 'mongodb';
import client from '../config/db.js';
import { requireRole } from '../middleware/auth.js';

const router = express.Router();

// Get all courses - All authenticated users can view
router.get('/', async (req, res) => {
  try {
    await client.connect();
    const courses = await client.db("sis").collection("courses").find().toArray();
    res.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ message: 'Error fetching courses', error });
  } finally {
    await client.close();
  }
});

// Get specific course - All authenticated users can view
router.get('/:id', async (req, res) => {
  try {
    const courseId = req.params.id;
    await client.connect();
    const course = await client.db("sis").collection("courses").findOne({ _id: new ObjectId(courseId) });
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course);
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({ message: 'Error fetching course', error });
  } finally {
    await client.close();
  }
});

// Add new course - Admin and Faculty can add
router.post('/', requireRole(['admin', 'faculty']), async (req, res) => {
  try {
    await client.connect();
    const newCourse = req.body;
    await client.db("sis").collection("courses").insertOne(newCourse);
    res.json(newCourse);
  } catch (error) {
    console.error('Error adding course:', error);
    res.status(500).json({ message: 'Error adding course', error });
  } finally {
    await client.close();
  }
});

// Update course - Admin and Faculty can update
router.put('/:id', requireRole(['admin', 'faculty']), async (req, res) => {
  try {
    await client.connect();
    const courseId = req.params.id;
    const updatedCourse = req.body;
    await client.db("sis").collection("courses").updateOne({ _id: new ObjectId(courseId) }, { $set: updatedCourse });
    res.json({ message: 'Course updated' });
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({ message: 'Error updating course', error });
  } finally {
    await client.close();
  }
});

// Delete course - Admin and Faculty can delete
router.delete('/:id', requireRole(['admin', 'faculty']), async (req, res) => {
  try {
    await client.connect();
    const courseId = req.params.id;
    await client.db("sis").collection("courses").deleteOne({ _id: new ObjectId(courseId) });
    res.json({ message: 'Course deleted' });
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ message: 'Error deleting course', error });
  } finally {
    await client.close();
  }
});

export default router;