import express from 'express';
import { ObjectId } from 'mongodb';
import client from '../config/db.js';
import { requireRole } from '../middleware/auth.js';

const router = express.Router();

// Get all faculty - Admin can view
router.get('/', requireRole(['admin']), async (req, res) => {
  try {
    await client.connect();
    const faculty = await client.db("sis").collection("faculty").find().toArray();
    res.json(faculty);
  } catch (error) {
    console.error('Error fetching faculty:', error);
    res.status(500).json({ message: 'Error fetching faculty', error });
  } finally {
    await client.close();
  }
});

// Get specific faculty - Admin and Faculty (own profile)
router.get('/:id', async (req, res) => {
  try {
    const facultyId = req.params.id;
    const userRole = req.user.role;
    const userFacultyId = req.user.facultyId;
    
    // Faculty can only view their own profile
    if (userRole === 'faculty' && userFacultyId !== facultyId) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    await client.connect();
    const faculty = await client.db("sis").collection("faculty").findOne({ _id: new ObjectId(facultyId) });
    if (!faculty) {
      return res.status(404).json({ message: 'Faculty not found' });
    }
    res.json(faculty);
  } catch (error) {
    console.error('Error fetching faculty:', error);
    res.status(500).json({ message: 'Error fetching faculty', error });
  } finally {
    await client.close();
  }
});

// Add new faculty - Admin only
router.post('/', requireRole(['admin']), async (req, res) => {
  try {
    await client.connect();
    const newFaculty = req.body;
    await client.db("sis").collection("faculty").insertOne(newFaculty);
    res.json(newFaculty);
  } catch (error) {
    console.error('Error adding faculty:', error);
    res.status(500).json({ message: 'Error adding faculty', error });
  } finally {
    await client.close();
  }
});

// Update faculty - Admin only
router.put('/:id', requireRole(['admin']), async (req, res) => {
  try {
    await client.connect();
    const facultyId = req.params.id;
    const updatedFaculty = req.body;
    await client.db("sis").collection("faculty").updateOne({ _id: new ObjectId(facultyId) }, { $set: updatedFaculty });
    res.json({ message: 'Faculty updated' });
  } catch (error) {
    console.error('Error updating faculty:', error);
    res.status(500).json({ message: 'Error updating faculty', error });
  } finally {
    await client.close();
  }
});

// Delete faculty - Admin only
router.delete('/:id', requireRole(['admin']), async (req, res) => {
  try {
    await client.connect();
    const facultyId = req.params.id;
    await client.db("sis").collection("faculty").deleteOne({ _id: new ObjectId(facultyId) });
    res.json({ message: 'Faculty deleted' });
  } catch (error) {
    console.error('Error deleting faculty:', error);
    res.status(500).json({ message: 'Error deleting faculty', error });
  } finally {
    await client.close();
  }
});

export default router;