import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { MONGO_URI } from './config/env.js';
import User from './models/User.js';
import Department from './models/Department.js';
import Subject from './models/Subject.js';
import Attendance from './models/Attendance.js';
import Score from './models/Score.js';

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

const createSampleData = async () => {
  try {
    console.log('🧹 Clearing existing data...');
    await User.deleteMany({ email: { $ne: 'admin@sis.com' } });
    await Department.deleteMany({});
    await Subject.deleteMany({});
    await Attendance.deleteMany({});
    await Score.deleteMany({});

    console.log('🏢 Creating departments...');
    const departments = await Department.insertMany([
      {
        name: 'Computer Science Engineering',
        code: 'CSE',
        semesters: [
          { semNo: 1, subjects: [] },
          { semNo: 2, subjects: [] },
          { semNo: 3, subjects: [] },
          { semNo: 4, subjects: [] },
          { semNo: 5, subjects: [] },
          { semNo: 6, subjects: [] },
          { semNo: 7, subjects: [] },
          { semNo: 8, subjects: [] }
        ]
      },
      {
        name: 'Electronics and Communication Engineering',
        code: 'ECE',
        semesters: [
          { semNo: 1, subjects: [] },
          { semNo: 2, subjects: [] },
          { semNo: 3, subjects: [] },
          { semNo: 4, subjects: [] },
          { semNo: 5, subjects: [] },
          { semNo: 6, subjects: [] },
          { semNo: 7, subjects: [] },
          { semNo: 8, subjects: [] }
        ]
      },
      {
        name: 'Mechanical Engineering',
        code: 'MECH',
        semesters: [
          { semNo: 1, subjects: [] },
          { semNo: 2, subjects: [] },
          { semNo: 3, subjects: [] },
          { semNo: 4, subjects: [] },
          { semNo: 5, subjects: [] },
          { semNo: 6, subjects: [] },
          { semNo: 7, subjects: [] },
          { semNo: 8, subjects: [] }
        ]
      }
    ]);

    console.log('👨🏫 Creating faculty users...');
    const facultyData = [
      { name: 'Dr. John Smith', email: 'faculty@sis.com', department: 'Computer Science Engineering', facultyId: 'FAC001' },
      { name: 'Prof. Sarah Johnson', email: 'sarah.johnson@sis.com', department: 'Computer Science Engineering', facultyId: 'FAC002' },
      { name: 'Dr. Michael Brown', email: 'michael.brown@sis.com', department: 'Electronics and Communication Engineering', facultyId: 'FAC003' },
      { name: 'Prof. Emily Davis', email: 'emily.davis@sis.com', department: 'Mechanical Engineering', facultyId: 'FAC004' }
    ];

    const faculty = [];
    for (const f of facultyData) {
      const passwordHash = await bcrypt.hash('faculty123', 10);
      const user = new User({
        name: f.name,
        email: f.email,
        passwordHash,
        role: 'faculty',
        department: f.department,
        year: 1,
        facultyId: f.facultyId
      });
      await user.save();
      faculty.push(user);
    }

    console.log('👨🎓 Creating student users...');
    const studentData = [
      { name: 'Alice Wilson', email: 'student@sis.com', department: 'Computer Science Engineering', year: 3, rollNumber: 'CSE2021001', studentId: 'STU001' },
      { name: 'Bob Anderson', email: 'bob.anderson@sis.com', department: 'Computer Science Engineering', year: 3, rollNumber: 'CSE2021002', studentId: 'STU002' },
      { name: 'Charlie Thompson', email: 'charlie.thompson@sis.com', department: 'Computer Science Engineering', year: 2, rollNumber: 'CSE2022001', studentId: 'STU003' },
      { name: 'Diana Martinez', email: 'diana.martinez@sis.com', department: 'Electronics and Communication Engineering', year: 3, rollNumber: 'ECE2021001', studentId: 'STU004' },
      { name: 'Edward Garcia', email: 'edward.garcia@sis.com', department: 'Electronics and Communication Engineering', year: 2, rollNumber: 'ECE2022001', studentId: 'STU005' },
      { name: 'Fiona Rodriguez', email: 'fiona.rodriguez@sis.com', department: 'Mechanical Engineering', year: 3, rollNumber: 'MECH2021001', studentId: 'STU006' }
    ];

    const students = [];
    for (const s of studentData) {
      const passwordHash = await bcrypt.hash('student123', 10);
      const user = new User({
        name: s.name,
        email: s.email,
        passwordHash,
        role: 'student',
        department: s.department,
        year: s.year,
        rollNumber: s.rollNumber,
        studentId: s.studentId
      });
      await user.save();
      students.push(user);
    }

    console.log('📚 Creating subjects...');
    const subjectData = [
      { name: 'Data Structures and Algorithms', code: 'CS301', department: 'Computer Science Engineering', semester: 3, credits: 4, facultyId: faculty[0]._id },
      { name: 'Database Management Systems', code: 'CS302', department: 'Computer Science Engineering', semester: 3, credits: 3, facultyId: faculty[1]._id },
      { name: 'Computer Networks', code: 'CS401', department: 'Computer Science Engineering', semester: 4, credits: 3, facultyId: faculty[0]._id },
      { name: 'Digital Signal Processing', code: 'EC301', department: 'Electronics and Communication Engineering', semester: 3, credits: 4, facultyId: faculty[2]._id },
      { name: 'Microprocessors', code: 'EC302', department: 'Electronics and Communication Engineering', semester: 3, credits: 3, facultyId: faculty[2]._id },
      { name: 'Thermodynamics', code: 'ME301', department: 'Mechanical Engineering', semester: 3, credits: 4, facultyId: faculty[3]._id }
    ];

    const subjects = await Subject.insertMany(subjectData);

    console.log('📋 Creating sample attendance records...');
    const attendanceRecords = [];
    const dates = [
      new Date('2024-01-15'),
      new Date('2024-01-16'),
      new Date('2024-01-17'),
      new Date('2024-01-18'),
      new Date('2024-01-19')
    ];

    for (const subject of subjects) {
      const relevantStudents = students.filter(s => s.department === subject.department);
      for (const date of dates) {
        for (const student of relevantStudents) {
          const status = Math.random() > 0.2 ? 'Present' : Math.random() > 0.5 ? 'Absent' : 'Late';
          attendanceRecords.push({
            studentId: student._id,
            subjectId: subject._id,
            date,
            status,
            markedBy: subject.facultyId
          });
        }
      }
    }

    await Attendance.insertMany(attendanceRecords);

    console.log('📊 Creating sample score records...');
    const scoreRecords = [];
    const testTypes = ['Test1', 'Test2', 'Assignment', 'Quiz'];

    for (const subject of subjects) {
      const relevantStudents = students.filter(s => s.department === subject.department);
      for (const testType of testTypes) {
        for (const student of relevantStudents) {
          const marks = Math.floor(Math.random() * 40) + 60; // Random marks between 60-100
          const maxMarks = 100;
          scoreRecords.push({
            studentId: student._id,
            subjectId: subject._id,
            testType,
            marks,
            maxMarks,
            examDate: new Date('2024-01-20'),
            markedBy: subject.facultyId
          });
        }
      }
    }

    await Score.insertMany(scoreRecords);

    console.log('✅ Sample data created successfully!');
    console.log('\n📋 Test Credentials:');
    console.log('Admin: admin@sis.com / admin123');
    console.log('Faculty: faculty@sis.com / faculty123');
    console.log('Student: student@sis.com / student123');
    console.log('\n🎯 Summary:');
    console.log(`- ${departments.length} departments created`);
    console.log(`- ${faculty.length} faculty members created`);
    console.log(`- ${students.length} students created`);
    console.log(`- ${subjects.length} subjects created`);
    console.log(`- ${attendanceRecords.length} attendance records created`);
    console.log(`- ${scoreRecords.length} score records created`);

  } catch (error) {
    console.error('❌ Error creating sample data:', error);
  } finally {
    mongoose.connection.close();
  }
};

createSampleData();