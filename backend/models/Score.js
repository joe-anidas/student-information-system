import mongoose from 'mongoose'

const scoreSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Student ID is required']
  },
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: [true, 'Subject ID is required']
  },
  testType: {
    type: String,
    enum: ['Test1', 'Test2', 'Assignment', 'Quiz', 'Project', 'Final'],
    required: [true, 'Test type is required']
  },
  marks: {
    type: Number,
    required: [true, 'Marks are required'],
    min: 0,
    max: 100
  },
  maxMarks: {
    type: Number,
    required: [true, 'Maximum marks are required'],
    min: 1,
    max: 100
  },
  percentage: {
    type: Number,
    min: 0,
    max: 100
  },
  grade: {
    type: String,
    enum: ['A+', 'A', 'B+', 'B', 'C+', 'C', 'D', 'F']
  },
  remarks: {
    type: String,
    trim: true
  },
  markedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Marked by faculty is required']
  },
  examDate: {
    type: Date,
    required: [true, 'Exam date is required']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
})

// Update the updatedAt field before saving
scoreSchema.pre('save', function(next) {
  this.updatedAt = Date.now()
  
  // Calculate percentage
  this.percentage = (this.marks / this.maxMarks) * 100
  
  // Calculate grade based on percentage
  if (this.percentage >= 90) this.grade = 'A+'
  else if (this.percentage >= 80) this.grade = 'A'
  else if (this.percentage >= 70) this.grade = 'B+'
  else if (this.percentage >= 60) this.grade = 'B'
  else if (this.percentage >= 50) this.grade = 'C+'
  else if (this.percentage >= 40) this.grade = 'C'
  else if (this.percentage >= 30) this.grade = 'D'
  else this.grade = 'F'
  
  next()
})

// Compound index to prevent duplicate score records
scoreSchema.index({ studentId: 1, subjectId: 1, testType: 1, examDate: 1 }, { unique: true })

const Score = mongoose.model('Score', scoreSchema)

export default Score
