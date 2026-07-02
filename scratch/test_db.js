const models = require('../server/models/index.js');
const { sequelize, User } = models;

async function test() {
  try {
    await sequelize.authenticate();
    console.log('Database connected.');
    const count = await User.count();
    console.log('User count:', count);
    const users = await User.findAll();
    console.log('Users:', users.map(u => ({ id: u.id, username: u.username, email: u.email })));
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await sequelize.close();
  }
}

test();
