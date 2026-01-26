import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import User from './models/User.js';
import Subject from './models/Subject.js';
import Department from './models/Department.js';
import { MONGO_URI } from './config/env.js';

async function seedDatabase() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    console.log('\n🗑️  Clearing existing data...');
    await User.deleteMany({ role: { $in: ['student', 'faculty'] } });
    await Subject.deleteMany({});
    await Department.deleteMany({});
    console.log('✅ Existing data cleared');

    const passwordHash = await bcrypt.hash('password123', 10);

    // Create Departments
    console.log('\n📚 Creating departments...');
    const departments = [
      { name: 'Computer Science Engineering', code: 'CSE' },
      { name: 'Information Technology', code: 'IT' }
    ];

    const createdDepartments = [];
    for (const dept of departments) {
      const department = new Department({
        name: dept.name,
        code: dept.code,
        isActive: true
      });
      await department.save();
      createdDepartments.push(department);
      console.log(`✅ Created department: ${dept.name}`);
    }

    // Create Faculty (8 per department)
    console.log('\n👨‍🏫 Creating faculty members...');
    const facultyNames = [
      'Dr. Rajesh Kumar', 'Dr. Priya Sharma', 'Dr. Amit Patel', 'Dr. Sneha Reddy',
      'Dr. Vikram Singh', 'Dr. Anita Desai', 'Dr. Suresh Iyer', 'Dr. Kavita Nair'
    ];

    const allFaculty = [];
    for (const dept of departments) {
      const deptFaculty = [];
      for (let i = 0; i < 8; i++) {
        const faculty = new User({
          name: `${facultyNames[i]} (${dept.code})`,
          email: `${dept.code.toLowerCase()}.faculty${i + 1}@sis.com`,
          passwordHash,
          role: 'faculty',
          department: dept.name,
          year: 1,
          facultyId: `${dept.code}FAC${String(i + 1).padStart(3, '0')}`,
          isActive: true
        });
        await faculty.save();
        deptFaculty.push(faculty);
        console.log(`✅ Created faculty: ${faculty.name} (${faculty.email})`);
      }
      allFaculty.push({ department: dept.name, faculty: deptFaculty });
    }

    // Create Subjects (2 per semester, 8 semesters per department)
    console.log('\n📖 Creating subjects...');
    const subjectTemplates = {
      CSE: [
        // Year 1 Sem 1
        ['Programming Fundamentals', 'Data Structures'],
        // Year 1 Sem 2
        ['Object Oriented Programming', 'Database Management Systems'],
        // Year 2 Sem 1
        ['Computer Networks', 'Operating Systems'],
        // Year 2 Sem 2
        ['Web Technologies', 'Software Engineering'],
        // Year 3 Sem 1
        ['Machine Learning', 'Artificial Intelligence'],
        // Year 3 Sem 2
        ['Cloud Computing', 'Big Data Analytics'],
        // Year 4 Sem 1
        ['Cyber Security', 'Blockchain Technology'],
        // Year 4 Sem 2
        ['Internet of Things', 'Mobile Application Development']
      ],
      IT: [
        // Year 1 Sem 1
        ['Introduction to IT', 'Programming in C'],
        // Year 1 Sem 2
        ['Java Programming', 'Database Systems'],
        // Year 2 Sem 1
        ['Computer Networks', 'System Administration'],
        // Year 2 Sem 2
        ['Web Development', 'Software Testing'],
        // Year 3 Sem 1
        ['Data Science', 'Network Security'],
        // Year 3 Sem 2
        ['Cloud Technologies', 'DevOps Practices'],
        // Year 4 Sem 1
        ['Information Security', 'Enterprise Systems'],
        // Year 4 Sem 2
        ['Mobile Computing', 'IT Project Management']
      ]
    };

    const allSubjects = [];
    for (const dept of departments) {
      const deptCode = dept.code;
      const deptFaculty = allFaculty.find(f => f.department === dept.name).faculty;
      const templates = subjectTemplates[deptCode];

      for (let year = 1; year <= 4; year++) {
        for (let sem = 1; sem <= 2; sem++) {
          const semIndex = (year - 1) * 2 + (sem - 1);
          const subjects = templates[semIndex];
          
          for (let subIdx = 0; subIdx < subjects.length; subIdx++) {
            // Assign faculty: faculty 0-7 for subjects in odd sem, same faculty for even sem
            const facultyIndex = semIndex % 8;
            const assignedFaculty = deptFaculty[facultyIndex];
            
            const subject = new Subject({
              name: subjects[subIdx],
              code: `${deptCode}${year}${sem}${String(subIdx + 1).padStart(2, '0')}`,
              facultyId: assignedFaculty._id,
              department: dept.name,
              semester: (year - 1) * 2 + sem,
              credits: 4,
              description: `${subjects[subIdx]} for Year ${year} Semester ${sem}`,
              isActive: true
            });
            await subject.save();
            allSubjects.push(subject);
            console.log(`✅ Created subject: ${subject.code} - ${subject.name} (Faculty: ${assignedFaculty.name})`);
          }
        }
      }
    }

    // Create Students (3 per year per department)
    console.log('\n👨‍🎓 Creating students...');
    const studentFirstNames = ['Aarav', 'Vivaan', 'Aditya', 'Arjun', 'Sai', 'Rohan', 'Ishaan', 'Reyansh', 'Ayaan', 'Krishna', 'Shaurya', 'Atharv'];
    const studentLastNames = ['Kumar', 'Sharma', 'Patel', 'Singh', 'Reddy', 'Nair', 'Iyer', 'Gupta', 'Verma', 'Rao', 'Desai', 'Mehta'];

    let studentCounter = 0;
    for (const dept of departments) {
      for (let year = 1; year <= 4; year++) {
        for (let i = 0; i < 3; i++) {
          const firstName = studentFirstNames[studentCounter % studentFirstNames.length];
          const lastName = studentLastNames[studentCounter % studentLastNames.length];
          const rollNum = `${dept.code}${2025 - year}${String(i + 1).padStart(3, '0')}`;
          
          const student = new User({
            name: `${firstName} ${lastName}`,
            email: `${dept.code.toLowerCase()}.student.y${year}.${i + 1}@sis.com`,
            passwordHash,
            role: 'student',
            department: dept.name,
            year: year,
            studentId: `${dept.code}STU${String(studentCounter + 1).padStart(4, '0')}`,
            rollNumber: rollNum,
            isActive: true
          });
          await student.save();
          console.log(`✅ Created student: ${student.name} - ${student.rollNumber} (Year ${year})`);
          studentCounter++;
        }
      }
    }

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`   Departments: ${departments.length}`);
    console.log(`   Faculty: ${departments.length * 8}`);
    console.log(`   Students: ${departments.length * 4 * 3}`);
    console.log(`   Subjects: ${allSubjects.length}`);
    
    console.log('\n🔑 Login Credentials:');
    console.log('   All passwords: password123');
    console.log('\n   Faculty Examples:');
    console.log('   - cse.faculty1@sis.com / password123');
    console.log('   - it.faculty1@sis.com / password123');
    console.log('\n   Student Examples:');
    console.log('   - cse.student.y1.1@sis.com / password123');
    console.log('   - it.student.y1.1@sis.com / password123');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
  }
}

seedDatabase();
