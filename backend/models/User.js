import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  passwordHash: {
    type: String,
    required: [true, 'Password is required']
  },
  role: {
    type: String,
    enum: ['admin', 'faculty', 'student'],
    required: [true, 'Role is required'],
    default: 'student'
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    trim: true
  },
  year: {
    type: Number,
    required: function() {
      return this.role === 'student' || this.role === 'faculty'
    },
    min: 1,
    max: 4
  },
  rollNumber: {
    type: String,
    required: function() {
      return this.role === 'student'
    },
    unique: true,
    sparse: true,
    trim: true
  },
  subjectsAssigned: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject'
  }],
  studentId: {
    type: String,
    required: function() {
      return this.role === 'student'
    },
    unique: true,
    sparse: true
  },
  facultyId: {
    type: String,
    required: function() {
      return this.role === 'faculty'
    },
    unique: true,
    sparse: true
  },
  isHOD: {
    type: Boolean,
    default: false
  },
  classAdvisorFor: {
    department: String,
    year: Number,
    semester: Number
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
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now()
  next()
})

const User = mongoose.model('User', userSchema)

export default User
