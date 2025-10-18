import express from 'express';
import Attendance from '../models/Attendance.js';
import User from '../models/User.js';
import Subject from '../models/Subject.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Get attendance records - Admin, Faculty (their subjects), Student (own records)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { studentId, subjectId, date, startDate, endDate } = req.query;
    const userRole = req.user.role;
    const userId = req.user.userId;
    
    let filter = {};
    
    // Students can only view their own attendance
    if (userRole === 'student') {
      filter.studentId = userId;
    }
    
    // Faculty can only view attendance for their assigned subjects
    if (userRole === 'faculty') {
      const facultySubjects = await Subject.find({ 
        facultyId: userId, 
        isActive: true 
      }).select('_id');
      const subjectIds = facultySubjects.map(sub => sub._id);
      filter.subjectId = { $in: subjectIds };
    }
    
    if (studentId) filter.studentId = studentId;
    if (subjectId) filter.subjectId = subjectId;
    if (date) {
      const targetDate = new Date(date);
      const nextDay = new Date(targetDate);
      nextDay.setDate(nextDay.getDate() + 1);
      filter.date = { $gte: targetDate, $lt: nextDay };
    }
    if (startDate && endDate) {
      filter.date = { 
        $gte: new Date(startDate), 
        $lte: new Date(endDate) 
      };
    }
    
    const attendance = await Attendance.find(filter)
      .populate('studentId', 'name rollNumber studentId department year')
      .populate('subjectId', 'name code department semester')
      .populate('markedBy', 'name email facultyId')
      .sort({ date: -1, studentId: 1 });
    
    res.json(attendance);
  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get specific attendance record
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id)
      .populate('studentId', 'name rollNumber studentId department year')
      .populate('subjectId', 'name code department semester')
      .populate('markedBy', 'name email facultyId');
    
    if (!attendance) {
      return res.status(404).json({ error: 'Attendance record not found' });
    }
    
    const userRole = req.user.role;
    const userId = req.user.userId;
    
    // Students can only view their own attendance
    if (userRole === 'student' && attendance.studentId._id.toString() !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    // Faculty can only view attendance for their subjects
    if (userRole === 'faculty' && attendance.markedBy._id.toString() !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    res.json(attendance);
  } catch (error) {
    console.error('Error fetching attendance record:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Mark attendance - Admin and Faculty only
router.post('/', authenticateToken, requireRole(['admin', 'faculty']), async (req, res) => {
  try {
    const { studentId, subjectId, date, status, remarks } = req.body;
    const markedBy = req.user.userId;
    
    if (!studentId || !subjectId || !date || !status) {
      return res.status(400).json({ 
        error: 'Student ID, Subject ID, date, and status are required' 
      });
    }
    
    // Verify student exists
    const student = await User.findById(studentId);
    if (!student || student.role !== 'student') {
      return res.status(400).json({ error: 'Invalid student' });
    }
    
    // Verify subject exists and faculty has access
    const subject = await Subject.findById(subjectId);
    if (!subject || !subject.isActive) {
      return res.status(400).json({ error: 'Invalid subject' });
    }
    
    // Faculty can only mark attendance for their assigned subjects
    if (req.user.role === 'faculty' && subject.facultyId.toString() !== markedBy) {
      return res.status(403).json({ error: 'Access denied to this subject' });
    }
    
    // Check if attendance already exists for this student, subject, and date
    const existingAttendance = await Attendance.findOne({
      studentId,
      subjectId,
      date: new Date(date)
    });
    
    if (existingAttendance) {
      return res.status(400).json({ error: 'Attendance already marked for this date' });
    }
    
    const attendance = new Attendance({
      studentId,
      subjectId,
      date: new Date(date),
      status,
      remarks,
      markedBy
    });
    
    await attendance.save();
    
    const populatedAttendance = await Attendance.findById(attendance._id)
      .populate('studentId', 'name rollNumber studentId department year')
      .populate('subjectId', 'name code department semester')
      .populate('markedBy', 'name email facultyId');
    
    res.status(201).json(populatedAttendance);
  } catch (error) {
    console.error('Error marking attendance:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update attendance - Admin and Faculty (who marked it) only
router.put('/:id', authenticateToken, requireRole(['admin', 'faculty']), async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id);
    if (!attendance) {
      return res.status(404).json({ error: 'Attendance record not found' });
    }
    
    // Faculty can only update attendance they marked
    if (req.user.role === 'faculty' && attendance.markedBy.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    const updatedAttendance = await Attendance.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('studentId', 'name rollNumber studentId department year')
     .populate('subjectId', 'name code department semester')
     .populate('markedBy', 'name email facultyId');
    
    res.json(updatedAttendance);
  } catch (error) {
    console.error('Error updating attendance:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete attendance - Admin and Faculty (who marked it) only
router.delete('/:id', authenticateToken, requireRole(['admin', 'faculty']), async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id);
    if (!attendance) {
      return res.status(404).json({ error: 'Attendance record not found' });
    }
    
    // Faculty can only delete attendance they marked
    if (req.user.role === 'faculty' && attendance.markedBy.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    await Attendance.findByIdAndDelete(req.params.id);
    res.json({ message: 'Attendance record deleted successfully' });
  } catch (error) {
    console.error('Error deleting attendance:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get attendance statistics - Admin, Faculty (their subjects), Student (own stats)
router.get('/stats/summary', authenticateToken, async (req, res) => {
  try {
    const { studentId, subjectId, startDate, endDate } = req.query;
    const userRole = req.user.role;
    const userId = req.user.userId;
    
    let filter = {};
    
    if (studentId) filter.studentId = studentId;
    if (subjectId) filter.subjectId = subjectId;
    if (startDate && endDate) {
      filter.date = { 
        $gte: new Date(startDate), 
        $lte: new Date(endDate) 
      };
    }
    
    // Students can only view their own stats
    if (userRole === 'student') {
      filter.studentId = userId;
    }
    
    // Faculty can only view stats for their subjects
    if (userRole === 'faculty') {
      const facultySubjects = await Subject.find({ 
        facultyId: userId, 
        isActive: true 
      }).select('_id');
      const subjectIds = facultySubjects.map(sub => sub._id);
      filter.subjectId = { $in: subjectIds };
    }
    
    const stats = await Attendance.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalRecords: { $sum: 1 },
          presentCount: {
            $sum: { $cond: [{ $eq: ['$status', 'Present'] }, 1, 0] }
          },
          absentCount: {
            $sum: { $cond: [{ $eq: ['$status', 'Absent'] }, 1, 0] }
          },
          lateCount: {
            $sum: { $cond: [{ $eq: ['$status', 'Late'] }, 1, 0] }
          }
        }
      },
      {
        $project: {
          totalRecords: 1,
          presentCount: 1,
          absentCount: 1,
          lateCount: 1,
          attendancePercentage: {
            $cond: [
              { $gt: ['$totalRecords', 0] },
              { $multiply: [{ $divide: ['$presentCount', '$totalRecords'] }, 100] },
              0
            ]
          }
        }
      }
    ]);
    
    res.json(stats[0] || {
      totalRecords: 0,
      presentCount: 0,
      absentCount: 0,
      lateCount: 0,
      attendancePercentage: 0
    });
  } catch (error) {
    console.error('Error fetching attendance stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
