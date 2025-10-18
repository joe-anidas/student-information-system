import bcrypt from 'bcryptjs'
import User from '../models/User.js'
import { signJwt } from '../middleware/auth.js'

export async function register(req, res) {
  try {
    const { 
      name, 
      email, 
      password, 
      role, 
      department, 
      year, 
      rollNumber, 
      studentId, 
      facultyId 
    } = req.body
    
    // Only admin can register new users
    if (req.user && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Only admin can register new users' })
    }
    
    if (!name || !email || !password || !role || !department) {
      return res.status(400).json({ error: 'Name, email, password, role, and department are required' })
    }
    
    // Validate role-specific requirements
    if (role === 'student' && (!rollNumber || !studentId)) {
      return res.status(400).json({ error: 'Roll number and student ID are required for student role' })
    }
    if (role === 'faculty' && !facultyId) {
      return res.status(400).json({ error: 'Faculty ID is required for faculty role' })
    }
    if ((role === 'student' || role === 'faculty') && !year) {
      return res.status(400).json({ error: 'Year is required for student and faculty roles' })
    }
    
    const existing = await User.findOne({ email })
    if (existing) {
      return res.status(400).json({ error: 'User with this email already exists' })
    }
    
    // Check for existing student/faculty IDs and roll numbers
    if (role === 'student') {
      const existingStudent = await User.findOne({ 
        $or: [{ studentId }, { rollNumber }] 
      })
      if (existingStudent) {
        return res.status(400).json({ error: 'Student ID or roll number already exists' })
      }
    }
    if (role === 'faculty') {
      const existingFaculty = await User.findOne({ facultyId })
      if (existingFaculty) {
        return res.status(400).json({ error: 'Faculty ID already exists' })
      }
    }
    
    const passwordHash = await bcrypt.hash(password, 10)
    const user = new User({ 
      name, 
      email, 
      passwordHash, 
      role,
      department,
      year,
      ...(role === 'student' && { studentId, rollNumber }),
      ...(role === 'faculty' && { facultyId })
    })
    await user.save()
    
    const token = signJwt({ 
      userId: user._id, 
      email: user.email, 
      name: user.name,
      role: user.role,
      department: user.department,
      year: user.year,
      ...(role === 'student' && { studentId: user.studentId, rollNumber: user.rollNumber }),
      ...(role === 'faculty' && { facultyId: user.facultyId })
    })
    
    return res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email,
        role: user.role,
        department: user.department,
        year: user.year,
        ...(role === 'student' && { studentId: user.studentId, rollNumber: user.rollNumber }),
        ...(role === 'faculty' && { facultyId: user.facultyId })
      }
    })
  } catch (err) {
    console.error('Error registering user:', err)
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message })
    }
    return res.status(500).json({ error: 'Internal server error' })
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }
    const ok = await bcrypt.compare(password, user.passwordHash)
    if (!ok) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }
    const token = signJwt({ 
      userId: user._id, 
      email: user.email, 
      name: user.name,
      role: user.role,
      department: user.department,
      year: user.year,
      ...(user.role === 'student' && { studentId: user.studentId, rollNumber: user.rollNumber }),
      ...(user.role === 'faculty' && { facultyId: user.facultyId })
    })
    return res.json({
      message: 'Logged in successfully',
      token,
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email,
        role: user.role,
        department: user.department,
        year: user.year,
        ...(user.role === 'student' && { studentId: user.studentId, rollNumber: user.rollNumber }),
        ...(user.role === 'faculty' && { facultyId: user.facultyId })
      }
    })
  } catch (err) {
    console.error('Error logging in:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

export async function getProfile(req, res) {
  try {
    const user = await User.findById(req.user.userId).select('-passwordHash')
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        year: user.year,
        ...(user.role === 'student' && { studentId: user.studentId, rollNumber: user.rollNumber }),
        ...(user.role === 'faculty' && { facultyId: user.facultyId })
      }
    })
  } catch (err) {
    console.error('Error fetching profile:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
}
