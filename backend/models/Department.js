import mongoose from 'mongoose'

const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Department name is required'],
    unique: true,
    trim: true
  },
  code: {
    type: String,
    required: [true, 'Department code is required'],
    unique: true,
    trim: true,
    uppercase: true
  },
  semesters: [{
    semNo: {
      type: Number,
      required: true,
      min: 1,
      max: 8
    },
    subjects: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject'
    }]
  }],
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
departmentSchema.pre('save', function(next) {
  this.updatedAt = Date.now()
  next()
})

const Department = mongoose.model('Department', departmentSchema)

export default Department
