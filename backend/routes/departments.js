import express from 'express';
import Department from '../models/Department.js';
import Subject from '../models/Subject.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Get all departments - All authenticated users
router.get('/', authenticateToken, async (req, res) => {
  try {
    const departments = await Department.find({ isActive: true }).sort({ name: 1 });
    res.json(departments);
  } catch (error) {
    console.error('Error fetching departments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get specific department - All authenticated users
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).json({ error: 'Department not found' });
    }
    res.json(department);
  } catch (error) {
    console.error('Error fetching department:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create department - Admin only
router.post('/', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { name, code, semesters } = req.body;
    
    if (!name || !code) {
      return res.status(400).json({ error: 'Name and code are required' });
    }
    
    const department = new Department({ name, code, semesters: semesters || [] });
    await department.save();
    
    res.status(201).json(department);
  } catch (error) {
    console.error('Error creating department:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Department with this name or code already exists' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update department - Admin only
router.put('/:id', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const department = await Department.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!department) {
      return res.status(404).json({ error: 'Department not found' });
    }
    
    res.json(department);
  } catch (error) {
    console.error('Error updating department:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Department with this name or code already exists' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete department - Admin only
router.delete('/:id', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    // Check if department has subjects
    const subjectsCount = await Subject.countDocuments({ department: req.params.id });
    if (subjectsCount > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete department with existing subjects. Please remove subjects first.' 
      });
    }
    
    const department = await Department.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    
    if (!department) {
      return res.status(404).json({ error: 'Department not found' });
    }
    
    res.json({ message: 'Department deactivated successfully' });
  } catch (error) {
    console.error('Error deleting department:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get department with subjects - All authenticated users
router.get('/:id/subjects', authenticateToken, async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).json({ error: 'Department not found' });
    }
    
    const subjects = await Subject.find({ 
      department: department.name,
      isActive: true 
    }).populate('facultyId', 'name email facultyId');
    
    res.json({
      department,
      subjects
    });
  } catch (error) {
    console.error('Error fetching department subjects:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
