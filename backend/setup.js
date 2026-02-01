const { open } = require('sqlite');
const sqlite3 = require('sqlite3');
const path = require('path');

const initializeDatabase = async () => {
  try {
    const dbPath = path.join(__dirname, 'db', 'movies.db');
    const database = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    // Create movies table
    await database.run(`CREATE TABLE IF NOT EXISTS movies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      image TEXT,
      year INTEGER,
      genres TEXT,
      embed TEXT,
      director TEXT,
      cast TEXT,
      synopsis TEXT,
      language TEXT
    )`);

    // Create users table
    await database.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      email TEXT UNIQUE,
      password TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    console.log("Database tables created successfully!");
    
    // Close the database connection
    await database.close();
  } catch (error) {
    console.log(`DB Error: ${error.message}`);
    process.exit(1);
  }
};

initializeDatabase();