import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { MONGO_URI } from './config/env.js';
import User from './models/User.js';
import Department from './models/Department.js';
import Subject from './models/Subject.js';
import Attendance from './models/Attendance.js';
import Score from './models/Score.js';

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

const createComprehensiveData = async () => {
  try {
    console.log('🧹 Clearing existing data...');
    await User.deleteMany({ email: { $ne: 'admin@sis.com' } });
    await Department.deleteMany({});
    await Subject.deleteMany({});
    await Attendance.deleteMany({});
    await Score.deleteMany({});
    
    // Drop indexes to recreate them properly
    try {
      await User.collection.dropIndex('studentId_1');
      await User.collection.dropIndex('facultyId_1');
      await User.collection.dropIndex('rollNumber_1');
    } catch (e) {
      // Indexes might not exist
    }

    console.log('🏢 Creating 6 departments...');
    const departmentData = [
      { name: 'Computer Science Engineering', code: 'CSE' },
      { name: 'Information Technology', code: 'IT' },
      { name: 'Electronics and Communication Engineering', code: 'ECE' },
      { name: 'Electrical and Electronics Engineering', code: 'EEE' },
      { name: 'Mechanical Engineering', code: 'MECH' },
      { name: 'Artificial Intelligence and Data Science', code: 'AIDS' }
    ];

    const departments = [];
    for (const dept of departmentData) {
      const department = new Department({
        name: dept.name,
        code: dept.code,
        semesters: Array.from({ length: 8 }, (_, i) => ({ semNo: i + 1, subjects: [] }))
      });
      await department.save();
      departments.push(department);
    }

    console.log('👨🏫 Creating faculty members...');
    const facultyData = [];
    let facultyCounter = 1;

    // Create HODs for each department
    const hodNames = ['rajesh', 'priya', 'kumar', 'deepa', 'ravi', 'meera'];
    for (let i = 0; i < departments.length; i++) {
      const dept = departments[i];
      facultyData.push({
        name: `Dr. ${hodNames[i].charAt(0).toUpperCase() + hodNames[i].slice(1)} Kumar`,
        email: `${hodNames[i]}.${dept.code.toLowerCase()}@sis.com`,
        department: dept.name,
        facultyId: `HOD${dept.code}`,
        isHOD: true
      });
    }

    // Create class advisors for each year in each department
    const advisorNames = ['suresh', 'kavitha', 'arun', 'lakshmi'];
    for (const dept of departments) {
      for (let year = 1; year <= 4; year++) {
        facultyData.push({
          name: `Prof. ${advisorNames[year-1].charAt(0).toUpperCase() + advisorNames[year-1].slice(1)} ${dept.code}`,
          email: `${advisorNames[year-1]}.${dept.code.toLowerCase()}@sis.com`,
          department: dept.name,
          facultyId: `ADV${dept.code}Y${year}`,
          classAdvisorFor: { department: dept.name, year }
        });
      }
    }

    // Create course faculty (8 per department - 2 courses per year)
    const courseNames = {
      1: ['Mathematics I', 'Programming Fundamentals'], // Odd sem Y1
      2: ['Mathematics II', 'Data Structures'], // Even sem Y1
      3: ['Algorithms', 'Database Systems'], // Odd sem Y2
      4: ['Computer Networks', 'Operating Systems'], // Even sem Y2
      5: ['Machine Learning', 'Web Technologies'], // Odd sem Y3
      6: ['Artificial Intelligence', 'Cloud Computing'], // Even sem Y3
      7: ['Project Work I', 'Advanced Algorithms'], // Odd sem Y4
      8: ['Project Work II', 'Industry Training'] // Even sem Y4
    };

    for (const dept of departments) {
      const facultyNames = ['ramesh', 'sita', 'vijay', 'anita', 'mohan', 'deepak', 'priya', 'kumar'];
      for (let sem = 1; sem <= 8; sem++) {
        const courses = courseNames[sem];
        for (let i = 0; i < courses.length; i++) {
          const baseName = facultyNames[(sem-1)*2 + i] || `faculty${sem}${i+1}`;
          const uniqueName = `${baseName}${sem}${i+1}`;
          facultyData.push({
            name: `Dr. ${baseName.charAt(0).toUpperCase() + baseName.slice(1)} ${dept.code}`,
            email: `${uniqueName}.${dept.code.toLowerCase()}@sis.com`,
            department: dept.name,
            facultyId: `${dept.code}S${sem}F${i + 1}`
          });
        }
      }
    }

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
        facultyId: f.facultyId,
        isHOD: f.isHOD || false,
        classAdvisorFor: f.classAdvisorFor
      });
      await user.save();
      faculty.push(user);
    }

    console.log('📚 Creating courses...');
    const subjects = [];
    for (const dept of departments) {
      for (let sem = 1; sem <= 8; sem++) {
        const courseList = courseNames[sem];
        for (let i = 0; i < courseList.length; i++) {
          const courseFaculty = faculty.find(f => f.facultyId === `${dept.code}S${sem}F${i + 1}`);
          if (courseFaculty) {
            const subject = new Subject({
              name: courseList[i],
              code: `${dept.code}${sem}0${i + 1}`,
              facultyId: courseFaculty._id,
              department: dept.name,
              semester: sem,
              credits: Math.floor(Math.random() * 2) + 3
            });
            await subject.save();
            subjects.push(subject);
          }
        }
      }
    }

    console.log('👨🎓 Creating students (10 per semester per department)...');
    const students = [];
    let studentCounter = 1;

    for (const dept of departments) {
      for (let year = 1; year <= 4; year++) {
        for (let sem = 1; sem <= 2; sem++) {
          const actualSem = (year - 1) * 2 + sem;
          for (let i = 1; i <= 10; i++) {
            const batchYear = new Date().getFullYear() - year + 1;
            const rollNumber = `${dept.code}${batchYear}${String(i).padStart(3, '0')}`;
            const studentId = `STU${dept.code}${year}${sem}${String(i).padStart(2, '0')}`;
            const studentName = `Student${i}Y${year}S${sem}`;
            const email = `${studentName.toLowerCase()}.${String(batchYear).slice(-2)}${dept.code.toLowerCase()}@sis.com`;
            
            const passwordHash = await bcrypt.hash('student123', 10);
            const student = new User({
              name: `${dept.code} ${studentName} Y${year}S${sem}`,
              email,
              passwordHash,
              role: 'student',
              department: dept.name,
              year,
              rollNumber,
              studentId
            });
            await student.save();
            students.push(student);
          }
        }
      }
    }

    console.log('📋 Creating attendance records...');
    const attendanceRecords = [];
    const dates = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date;
    });

    for (const subject of subjects) {
      const deptStudents = students.filter(s => {
        const studentSem = (s.year - 1) * 2 + (s.year % 2 === 1 ? 1 : 2);
        return s.department === subject.department && studentSem === subject.semester;
      });
      
      for (const date of dates.slice(0, 15)) {
        for (const student of deptStudents) {
          const status = Math.random() > 0.15 ? 'Present' : Math.random() > 0.7 ? 'Late' : 'Absent';
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

    console.log('📊 Creating score records...');
    const scoreRecords = [];
    const testTypes = ['Test1', 'Test2', 'Assignment', 'Quiz'];

    for (const subject of subjects) {
      const deptStudents = students.filter(s => {
        const studentSem = (s.year - 1) * 2 + (s.year % 2 === 1 ? 1 : 2);
        return s.department === subject.department && studentSem === subject.semester;
      });
      
      for (const testType of testTypes) {
        for (const student of deptStudents) {
          const marks = Math.floor(Math.random() * 35) + 65;
          scoreRecords.push({
            studentId: student._id,
            subjectId: subject._id,
            testType,
            marks,
            maxMarks: 100,
            examDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
            markedBy: subject.facultyId
          });
        }
      }
    }

    await Score.insertMany(scoreRecords);

    console.log('✅ Comprehensive academic data created successfully!');
    console.log('\n📋 Test Credentials:');
    console.log('Admin: admin@sis.com / admin123');
    console.log('HOD CSE: rajesh.cse@sis.com / faculty123');
    console.log('Class Advisor CSE Y1: suresh.cse@sis.com / faculty123');
    console.log('Faculty CSE: ramesh11.cse@sis.com / faculty123');
    console.log('Student: student1y1s1.24cse@sis.com / student123');
    
    console.log('\n🎯 Summary:');
    console.log(`- ${departments.length} departments created`);
    console.log(`- ${faculty.length} faculty members created`);
    console.log(`- ${students.length} students created (10 per sem per dept)`);
    console.log(`- ${subjects.length} courses created (2 per sem per dept)`);
    console.log(`- ${attendanceRecords.length} attendance records created`);
    console.log(`- ${scoreRecords.length} score records created`);

  } catch (error) {
    console.error('❌ Error creating comprehensive data:', error);
  } finally {
    mongoose.connection.close();
  }
};

createComprehensiveData();