import express from 'express';
import { ObjectId } from 'mongodb';
import client from '../config/db.js';
import { requireRole } from '../middleware/auth.js';

const router = express.Router();

// Get all marks - Admin and Faculty can view all, Students can view their own
router.get('/', async (req, res) => {
  try {
    const userRole = req.user.role;
    const userStudentId = req.user.studentId;
    
    await client.connect();
    let marks;
    
    if (userRole === 'student') {
      // Students can only view their own marks
      marks = await client.db("sis").collection("marks").find({ studentId: userStudentId }).toArray();
    } else {
      // Admin and Faculty can view all marks
      marks = await client.db("sis").collection("marks").find().toArray();
    }
    
    res.json(marks);
  } catch (error) {
    console.error('Error fetching marks:', error);
    res.status(500).json({ message: 'Error fetching marks', error });
  } finally {
    await client.close();
  }
});

// Get specific marks - Admin, Faculty, and Student (own marks)
router.get('/:id', async (req, res) => {
  try {
    const marksId = req.params.id;
    const userRole = req.user.role;
    const userStudentId = req.user.studentId;
    
    await client.connect();
    const marks = await client.db("sis").collection("marks").findOne({ _id: new ObjectId(marksId) });
    
    if (!marks) {
      return res.status(404).json({ message: 'Marks not found' });
    }
    
    // Students can only view their own marks
    if (userRole === 'student' && marks.studentId !== userStudentId) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    res.json(marks);
  } catch (error) {
    console.error('Error fetching marks:', error);
    res.status(500).json({ message: 'Error fetching marks', error });
  } finally {
    await client.close();
  }
});

// Add new marks - Admin and Faculty can add
router.post('/', requireRole(['admin', 'faculty']), async (req, res) => {
  try {
    await client.connect();
    const newMarks = req.body;
    await client.db("sis").collection("marks").insertOne(newMarks);
    res.json(newMarks);
  } catch (error) {
    console.error('Error adding marks:', error);
    res.status(500).json({ message: 'Error adding marks', error });
  } finally {
    await client.close();
  }
});

// Update marks - Admin and Faculty can update
router.put('/:id', requireRole(['admin', 'faculty']), async (req, res) => {
  try {
    await client.connect();
    const marksId = req.params.id;
    const updatedMarks = req.body;
    await client.db("sis").collection("marks").updateOne({ _id: new ObjectId(marksId) }, { $set: updatedMarks });
    res.json({ message: 'Marks updated' });
  } catch (error) {
    console.error('Error updating marks:', error);
    res.status(500).json({ message: 'Error updating marks', error });
  } finally {
    await client.close();
  }
});

// Delete marks - Admin and Faculty can delete
router.delete('/:id', requireRole(['admin', 'faculty']), async (req, res) => {
  try {
    await client.connect();
    const marksId = req.params.id;
    await client.db("sis").collection("marks").deleteOne({ _id: new ObjectId(marksId) });
    res.json({ message: 'Marks deleted' });
  } catch (error) {
    console.error('Error deleting marks:', error);
    res.status(500).json({ message: 'Error deleting marks', error });
  } finally {
    await client.close();
  }
});

export default router;