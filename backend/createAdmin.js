import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import User from './models/User.js';
import { MONGO_URI } from './config/env.js';

async function createAdminUser() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@sis.com' });
    if (existingAdmin) {
      console.log('❌ Admin user already exists');
      return;
    }

    // Create admin user
    const passwordHash = await bcrypt.hash('admin123', 10);
    const admin = new User({
      name: 'System Administrator',
      email: 'admin@sis.com',
      passwordHash,
      role: 'admin',
      department: 'Administration',
      isActive: true
    });

    await admin.save();
    console.log('✅ Admin user created successfully');
    console.log('Email: admin@sis.com');
    console.log('Password: admin123');
    console.log('Role: admin');
    console.log('Department: Administration');

  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  } finally {
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  }
}

createAdminUser();
