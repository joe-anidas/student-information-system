import express from 'express';
import Subject from '../models/Subject.js';
import User from '../models/User.js';
import Department from '../models/Department.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Get all subjects - All authenticated users
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { department, semester, facultyId } = req.query;
    let filter = { isActive: true };
    
    if (department) filter.department = department;
    if (semester) filter.semester = parseInt(semester);
    if (facultyId) filter.facultyId = facultyId;
    
    const subjects = await Subject.find(filter)
      .populate('facultyId', 'name email facultyId')
      .sort({ department: 1, semester: 1, name: 1 });
    
    res.json(subjects);
  } catch (error) {
    console.error('Error fetching subjects:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get specific subject - All authenticated users
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id)
      .populate('facultyId', 'name email facultyId');
    
    if (!subject) {
      return res.status(404).json({ error: 'Subject not found' });
    }
    
    res.json(subject);
  } catch (error) {
    console.error('Error fetching subject:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create subject - Admin only
router.post('/', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { name, code, facultyId, department, semester, credits, description } = req.body;
    
    if (!name || !code || !facultyId || !department || !semester || !credits) {
      return res.status(400).json({ 
        error: 'Name, code, facultyId, department, semester, and credits are required' 
      });
    }
    
    // Verify faculty exists
    const faculty = await User.findById(facultyId);
    if (!faculty || faculty.role !== 'faculty') {
      return res.status(400).json({ error: 'Invalid faculty member' });
    }
    
    // Verify department exists
    const dept = await Department.findOne({ name: department, isActive: true });
    if (!dept) {
      return res.status(400).json({ error: 'Invalid department' });
    }
    
    const subject = new Subject({
      name,
      code,
      facultyId,
      department,
      semester,
      credits,
      description
    });
    
    await subject.save();
    
    // Add subject to faculty's assigned subjects
    await User.findByIdAndUpdate(facultyId, {
      $addToSet: { subjectsAssigned: subject._id }
    });
    
    // Add subject to department's semester
    await Department.findOneAndUpdate(
      { name: department, 'semesters.semNo': semester },
      { $addToSet: { 'semesters.$.subjects': subject._id } }
    );
    
    const populatedSubject = await Subject.findById(subject._id)
      .populate('facultyId', 'name email facultyId');
    
    res.status(201).json(populatedSubject);
  } catch (error) {
    console.error('Error creating subject:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Subject with this code already exists' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update subject - Admin only
router.put('/:id', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const subject = await Subject.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('facultyId', 'name email facultyId');
    
    if (!subject) {
      return res.status(404).json({ error: 'Subject not found' });
    }
    
    res.json(subject);
  } catch (error) {
    console.error('Error updating subject:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Subject with this code already exists' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete subject - Admin only
router.delete('/:id', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (!subject) {
      return res.status(404).json({ error: 'Subject not found' });
    }
    
    // Remove subject from faculty's assigned subjects
    await User.findByIdAndUpdate(subject.facultyId, {
      $pull: { subjectsAssigned: subject._id }
    });
    
    // Remove subject from department's semester
    await Department.findOneAndUpdate(
      { name: subject.department, 'semesters.semNo': subject.semester },
      { $pull: { 'semesters.$.subjects': subject._id } }
    );
    
    // Soft delete the subject
    await Subject.findByIdAndUpdate(req.params.id, { isActive: false });
    
    res.json({ message: 'Subject deleted successfully' });
  } catch (error) {
    console.error('Error deleting subject:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get subjects by faculty - Faculty can view their own subjects
router.get('/faculty/:facultyId', authenticateToken, async (req, res) => {
  try {
    const { facultyId } = req.params;
    const userRole = req.user.role;
    const userFacultyId = req.user.facultyId;
    
    // Faculty can only view their own subjects unless they're admin
    if (userRole === 'faculty' && facultyId !== userFacultyId) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    const subjects = await Subject.find({ 
      facultyId, 
      isActive: true 
    }).populate('facultyId', 'name email facultyId');
    
    res.json(subjects);
  } catch (error) {
    console.error('Error fetching faculty subjects:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
