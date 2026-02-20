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

    // Create movies table with rating
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
      language TEXT,
      rating REAL
    )`);

    // Create users table
    await database.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      email TEXT UNIQUE,
      password TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Create trending table
    await database.run(`CREATE TABLE IF NOT EXISTS trending (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      movie_id INTEGER UNIQUE,
      rank INTEGER,
      FOREIGN KEY(movie_id) REFERENCES movies(id) ON DELETE CASCADE
    )`);

    console.log("Database tables created successfully!");
    await database.close();
  } catch (error) {
    console.log(`DB Error: ${error.message}`);
    process.exit(1);
  }
};

initializeDatabase();