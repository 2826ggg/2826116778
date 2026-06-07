const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const initDatabase = async () => {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'trading_user',
    password: process.env.DB_PASSWORD || 'trading_pass',
    database: process.env.DB_NAME || 'trading_platform',
  });

  try {
    // Read and execute init.sql
    const sqlPath = path.join(__dirname, '../sql/init.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    
    // Split by semicolon and execute each statement
    const statements = sqlContent.split(';').filter(s => s.trim());
    
    for (const statement of statements) {
      try {
        await connection.execute(statement);
        console.log('✅ Executed:', statement.substring(0, 50) + '...');
      } catch (error) {
        console.error('Error executing:', statement.substring(0, 50), error.message);
      }
    }

    console.log('\n✅ Database initialized successfully!');
    console.log('\n📝 Demo Account:');
    console.log('Email: demo@example.com');
    console.log('Password: demo123456');
    console.log('\n🔐 Admin Account:');
    console.log('Username: admin');
    console.log('Password: admin123456');
  } catch (error) {
    console.error('Database initialization error:', error);
  } finally {
    await connection.end();
  }
};

initDatabase();
