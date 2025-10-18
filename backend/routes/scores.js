import express from 'express';
import Score from '../models/Score.js';
import User from '../models/User.js';
import Subject from '../models/Subject.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Get scores - Admin, Faculty (their subjects), Student (own scores)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { studentId, subjectId, testType, startDate, endDate } = req.query;
    const userRole = req.user.role;
    const userId = req.user.userId;
    
    let filter = {};
    
    // Students can only view their own scores
    if (userRole === 'student') {
      filter.studentId = userId;
    }
    
    // Faculty can only view scores for their assigned subjects
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
    if (testType) filter.testType = testType;
    if (startDate && endDate) {
      filter.examDate = { 
        $gte: new Date(startDate), 
        $lte: new Date(endDate) 
      };
    }
    
    const scores = await Score.find(filter)
      .populate('studentId', 'name rollNumber studentId department year')
      .populate('subjectId', 'name code department semester')
      .populate('markedBy', 'name email facultyId')
      .sort({ examDate: -1, studentId: 1 });
    
    res.json(scores);
  } catch (error) {
    console.error('Error fetching scores:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get specific score
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const score = await Score.findById(req.params.id)
      .populate('studentId', 'name rollNumber studentId department year')
      .populate('subjectId', 'name code department semester')
      .populate('markedBy', 'name email facultyId');
    
    if (!score) {
      return res.status(404).json({ error: 'Score record not found' });
    }
    
    const userRole = req.user.role;
    const userId = req.user.userId;
    
    // Students can only view their own scores
    if (userRole === 'student' && score.studentId._id.toString() !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    // Faculty can only view scores for their subjects
    if (userRole === 'faculty' && score.markedBy._id.toString() !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    res.json(score);
  } catch (error) {
    console.error('Error fetching score record:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add score - Admin and Faculty only
router.post('/', authenticateToken, requireRole(['admin', 'faculty']), async (req, res) => {
  try {
    const { 
      studentId, 
      subjectId, 
      testType, 
      marks, 
      maxMarks, 
      remarks, 
      examDate 
    } = req.body;
    const markedBy = req.user.userId;
    
    if (!studentId || !subjectId || !testType || marks === undefined || !maxMarks || !examDate) {
      return res.status(400).json({ 
        error: 'Student ID, Subject ID, test type, marks, max marks, and exam date are required' 
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
    
    // Faculty can only add scores for their assigned subjects
    if (req.user.role === 'faculty' && subject.facultyId.toString() !== markedBy) {
      return res.status(403).json({ error: 'Access denied to this subject' });
    }
    
    // Validate marks
    if (marks < 0 || marks > maxMarks) {
      return res.status(400).json({ error: 'Marks must be between 0 and max marks' });
    }
    
    // Check if score already exists for this student, subject, test type, and exam date
    const existingScore = await Score.findOne({
      studentId,
      subjectId,
      testType,
      examDate: new Date(examDate)
    });
    
    if (existingScore) {
      return res.status(400).json({ error: 'Score already exists for this test and date' });
    }
    
    const score = new Score({
      studentId,
      subjectId,
      testType,
      marks,
      maxMarks,
      remarks,
      examDate: new Date(examDate),
      markedBy
    });
    
    await score.save();
    
    const populatedScore = await Score.findById(score._id)
      .populate('studentId', 'name rollNumber studentId department year')
      .populate('subjectId', 'name code department semester')
      .populate('markedBy', 'name email facultyId');
    
    res.status(201).json(populatedScore);
  } catch (error) {
    console.error('Error adding score:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update score - Admin and Faculty (who marked it) only
router.put('/:id', authenticateToken, requireRole(['admin', 'faculty']), async (req, res) => {
  try {
    const score = await Score.findById(req.params.id);
    if (!score) {
      return res.status(404).json({ error: 'Score record not found' });
    }
    
    // Faculty can only update scores they marked
    if (req.user.role === 'faculty' && score.markedBy.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    const updatedScore = await Score.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('studentId', 'name rollNumber studentId department year')
     .populate('subjectId', 'name code department semester')
     .populate('markedBy', 'name email facultyId');
    
    res.json(updatedScore);
  } catch (error) {
    console.error('Error updating score:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete score - Admin and Faculty (who marked it) only
router.delete('/:id', authenticateToken, requireRole(['admin', 'faculty']), async (req, res) => {
  try {
    const score = await Score.findById(req.params.id);
    if (!score) {
      return res.status(404).json({ error: 'Score record not found' });
    }
    
    // Faculty can only delete scores they marked
    if (req.user.role === 'faculty' && score.markedBy.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    await Score.findByIdAndDelete(req.params.id);
    res.json({ message: 'Score record deleted successfully' });
  } catch (error) {
    console.error('Error deleting score:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get score statistics - Admin, Faculty (their subjects), Student (own stats)
router.get('/stats/summary', authenticateToken, async (req, res) => {
  try {
    const { studentId, subjectId, testType, startDate, endDate } = req.query;
    const userRole = req.user.role;
    const userId = req.user.userId;
    
    let filter = {};
    
    if (studentId) filter.studentId = studentId;
    if (subjectId) filter.subjectId = subjectId;
    if (testType) filter.testType = testType;
    if (startDate && endDate) {
      filter.examDate = { 
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
    
    const stats = await Score.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalRecords: { $sum: 1 },
          averageMarks: { $avg: '$marks' },
          averagePercentage: { $avg: '$percentage' },
          highestMarks: { $max: '$marks' },
          lowestMarks: { $min: '$marks' },
          gradeDistribution: {
            $push: '$grade'
          }
        }
      },
      {
        $project: {
          totalRecords: 1,
          averageMarks: { $round: ['$averageMarks', 2] },
          averagePercentage: { $round: ['$averagePercentage', 2] },
          highestMarks: 1,
          lowestMarks: 1,
          gradeDistribution: 1
        }
      }
    ]);
    
    // Calculate grade distribution
    let gradeDistribution = {};
    if (stats[0] && stats[0].gradeDistribution) {
      stats[0].gradeDistribution.forEach(grade => {
        gradeDistribution[grade] = (gradeDistribution[grade] || 0) + 1;
      });
    }
    
    res.json({
      ...stats[0],
      gradeDistribution
    } || {
      totalRecords: 0,
      averageMarks: 0,
      averagePercentage: 0,
      highestMarks: 0,
      lowestMarks: 0,
      gradeDistribution: {}
    });
  } catch (error) {
    console.error('Error fetching score stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get student performance by subject
router.get('/student/:studentId/performance', authenticateToken, async (req, res) => {
  try {
    const { studentId } = req.params;
    const { subjectId, testType } = req.query;
    const userRole = req.user.role;
    const userId = req.user.userId;
    
    // Students can only view their own performance
    if (userRole === 'student' && studentId !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    let filter = { studentId };
    if (subjectId) filter.subjectId = subjectId;
    if (testType) filter.testType = testType;
    
    const performance = await Score.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$subjectId',
          subjectName: { $first: '$subjectId' },
          totalTests: { $sum: 1 },
          averageMarks: { $avg: '$marks' },
          averagePercentage: { $avg: '$percentage' },
          highestMarks: { $max: '$marks' },
          lowestMarks: { $min: '$marks' },
          tests: {
            $push: {
              testType: '$testType',
              marks: '$marks',
              maxMarks: '$maxMarks',
              percentage: '$percentage',
              grade: '$grade',
              examDate: '$examDate'
            }
          }
        }
      },
      {
        $lookup: {
          from: 'subjects',
          localField: '_id',
          foreignField: '_id',
          as: 'subject'
        }
      },
      {
        $unwind: '$subject'
      },
      {
        $project: {
          subjectId: '$_id',
          subjectName: '$subject.name',
          subjectCode: '$subject.code',
          totalTests: 1,
          averageMarks: { $round: ['$averageMarks', 2] },
          averagePercentage: { $round: ['$averagePercentage', 2] },
          highestMarks: 1,
          lowestMarks: 1,
          tests: 1
        }
      },
      { $sort: { subjectName: 1 } }
    ]);
    
    res.json(performance);
  } catch (error) {
    console.error('Error fetching student performance:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
