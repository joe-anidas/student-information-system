import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import User from './models/User.js';
import { MONGO_URI } from './config/env.js';

async function createTestUsers() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Test users data
    const testUsers = [
      {
        name: 'System Administrator',
        email: 'admin@sis.com',
        password: 'admin123',
        role: 'admin',
        department: 'Administration'
      },
      {
        name: 'Dr. Sarah Johnson',
        email: 'faculty@sis.com',
        password: 'faculty123',
        role: 'faculty',
        department: 'Computer Science',
        year: 3,
        facultyId: 'FAC001'
      },
      {
        name: 'John Smith',
        email: 'student@sis.com',
        password: 'student123',
        role: 'student',
        department: 'Computer Science',
        year: 3,
        studentId: 'STU001',
        rollNumber: 'CS2021001'
      }
    ];

    for (const userData of testUsers) {
      // Check if user already exists
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        console.log(`❌ User ${userData.email} already exists`);
        continue;
      }

      // Create user
      const passwordHash = await bcrypt.hash(userData.password, 10);
      const user = new User({
        name: userData.name,
        email: userData.email,
        passwordHash,
        role: userData.role,
        department: userData.department,
        year: userData.year,
        ...(userData.facultyId && { facultyId: userData.facultyId }),
        ...(userData.studentId && { studentId: userData.studentId }),
        ...(userData.rollNumber && { rollNumber: userData.rollNumber }),
        isActive: true
      });

      await user.save();
      console.log(`✅ ${userData.role} user created successfully`);
      console.log(`   Email: ${userData.email}`);
      console.log(`   Password: ${userData.password}`);
      console.log(`   Role: ${userData.role}`);
      console.log(`   Department: ${userData.department}`);
      if (userData.facultyId) console.log(`   Faculty ID: ${userData.facultyId}`);
      if (userData.studentId) console.log(`   Student ID: ${userData.studentId}`);
      if (userData.rollNumber) console.log(`   Roll Number: ${userData.rollNumber}`);
      console.log('');
    }

    console.log('🎉 All test users created successfully!');
    console.log('\nTest Credentials:');
    console.log('Admin: admin@sis.com / admin123');
    console.log('Faculty: faculty@sis.com / faculty123');
    console.log('Student: student@sis.com / student123');

  } catch (error) {
    console.error('❌ Error creating test users:', error);
  } finally {
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  }
}

createTestUsers();
