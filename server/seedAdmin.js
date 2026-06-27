const sequelize = require('./config/db');
const User = require('./models/User.model');
const bcrypt = require('bcryptjs');

const seedAdmin = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to DB');

    // Make sure User table exists
    await User.sync();

    const existingAdmin = await User.findOne({ where: { email: 'admin@bos.com' } });
    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    await User.create({
      name: 'System Admin',
      email: 'admin@bos.com',
      password: 'admin123',
      role: 'admin'
    });

    console.log('Admin user seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin user:', error);
    process.exit(1);
  }
};

seedAdmin();
