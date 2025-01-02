const { Sequelize } = require('sequelize');

// Create a new Sequelize instance
const sequelize = new Sequelize(process.env.POSTGRES_URI, {
  dialect: 'postgres',
  logging: false, // Disable logging; set to console.log for debugging
});

// Connect to PostgreSQL
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL Connected');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
