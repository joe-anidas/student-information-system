import express from 'express';
import { ObjectId } from 'mongodb';
import client from '../config/db.js';
import { requireRole } from '../middleware/auth.js';

const router = express.Router();

// Get all students - Admin and Faculty can view
router.get('/', requireRole(['admin', 'faculty']), async (req, res) => {
  try {
    await client.connect();
    const students = await client.db("sis").collection("students").find().toArray();
    res.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: 'Error fetching students', error });
  } finally {
    await client.close();
  }
});

// Get specific student - Admin, Faculty, and Student (own profile)
router.get('/:id', async (req, res) => {
  try {
    const studentId = req.params.id;
    const userRole = req.user.role;
    const userStudentId = req.user.studentId;
    
    // Students can only view their own profile
    if (userRole === 'student' && userStudentId !== studentId) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    await client.connect();
    const student = await client.db("sis").collection("students").findOne({ _id: new ObjectId(studentId) });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(student);
  } catch (error) {
    console.error('Error fetching student:', error);
    res.status(500).json({ message: 'Error fetching student', error });
  } finally {
    await client.close();
  }
});

// Add new student - Admin only
router.post('/', requireRole(['admin']), async (req, res) => {
  try {
    await client.connect();
    const newStudent = req.body;
    await client.db("sis").collection("students").insertOne(newStudent);
    res.json(newStudent);
  } catch (error) {
    console.error('Error adding student:', error);
    res.status(500).json({ message: 'Error adding student', error });
  } finally {
    await client.close();
  }
});

// Update student - Admin only
router.put('/:id', requireRole(['admin']), async (req, res) => {
  try {
    await client.connect();
    const studentId = req.params.id;
    const updatedStudent = req.body;
    await client.db("sis").collection("students").updateOne({ _id: new ObjectId(studentId) }, { $set: updatedStudent });
    res.json({ message: 'Student updated' });
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({ message: 'Error updating student', error });
  } finally {
    await client.close();
  }
});

// Delete student - Admin only
router.delete('/:id', requireRole(['admin']), async (req, res) => {
  try {
    await client.connect();
    const studentId = req.params.id;
    await client.db("sis").collection("students").deleteOne({ _id: new ObjectId(studentId) });
    res.json({ message: 'Student deleted' });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ message: 'Error deleting student', error });
  } finally {
    await client.close();
  }
});

export default router;