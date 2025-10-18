import express from 'express';
import User from '../models/User.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Get all users - Admin only
router.get('/', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { role, department, year } = req.query;
    let filter = {};
    
    if (role) filter.role = role;
    if (department) filter.department = department;
    if (year) filter.year = parseInt(year);
    
    const users = await User.find(filter).select('-passwordHash').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get specific user - Admin, Faculty (own profile), Student (own profile)
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.params.id;
    const userRole = req.user.role;
    const userIdFromToken = req.user.userId;
    
    // Users can only view their own profile unless they're admin
    if (userRole !== 'admin' && userId !== userIdFromToken) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    const user = await User.findById(userId).select('-passwordHash');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user - Admin only (or users can update their own profile)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.params.id;
    const userRole = req.user.role;
    const userIdFromToken = req.user.userId;
    const updateData = req.body;
    
    // Remove sensitive fields that shouldn't be updated directly
    delete updateData.passwordHash;
    delete updateData.role;
    delete updateData._id;
    delete updateData.createdAt;
    
    // Users can only update their own profile unless they're admin
    if (userRole !== 'admin' && userId !== userIdFromToken) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    // Only admin can update certain fields
    if (userRole !== 'admin') {
      delete updateData.studentId;
      delete updateData.facultyId;
      delete updateData.rollNumber;
      delete updateData.subjectsAssigned;
    }
    
    const user = await User.findByIdAndUpdate(
      userId, 
      updateData, 
      { new: true, runValidators: true }
    ).select('-passwordHash');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete user - Admin only
router.delete('/:id', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Prevent admin from deleting themselves
    if (userId === req.user.userId) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }
    
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get dashboard statistics - Admin only
router.get('/stats/dashboard', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalFaculty = await User.countDocuments({ role: 'faculty' });
    const totalAdmins = await User.countDocuments({ role: 'admin' });
    
    // Department-wise distribution
    const departmentStats = await User.aggregate([
      { $match: { role: { $in: ['student', 'faculty'] } } },
      { $group: { _id: '$department', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    // Year-wise distribution
    const yearStats = await User.aggregate([
      { $match: { role: { $in: ['student', 'faculty'] }, year: { $exists: true } } },
      { $group: { _id: '$year', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    
    res.json({
      totalStudents,
      totalFaculty,
      totalAdmins,
      departmentStats,
      yearStats
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
