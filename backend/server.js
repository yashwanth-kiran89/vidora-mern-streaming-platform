const express = require('express')
const { open } = require('sqlite')
const sqlite3 = require('sqlite3')
const path = require('path')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const cors = require('cors')

const databasePath = path.join(__dirname, 'db', 'movies.db')
const app = express()

app.use(express.json())
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://vidora-frontend-0oxe.onrender.com"
  ],
  credentials: true
}))

let database = null

// Initialize database connection and start server
const initializeDbAndServer = async () => {
  try {
    database = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    })
    const PORT = process.env.PORT || 5000
    app.listen(PORT, () => console.log(`Server Running at port ${PORT}`))
  } catch (error) {
    console.log(`DB Error: ${error.message}`)
    process.exit(1)
  }
}
initializeDbAndServer()

// -------------------- Authentication Middleware --------------------
const authenticateToken = (request, response, next) => {
  const authHeader = request.headers['authorization']
  const jwtToken = authHeader && authHeader.split(' ')[1]
  if (!jwtToken) {
    return response.status(401).send('Invalid JWT Token')
  }
  jwt.verify(jwtToken, 'vidora-secret-key-2024', (error, payload) => {
    if (error) {
      return response.status(401).send('Invalid JWT Token')
    }
    request.username = payload.username
    next()
  })
}

// -------------------- Public Endpoints (No Auth Required) --------------------

// User Registration
app.post('/api/register', async (request, response) => {
  const { username, email, password } = request.body
  const hashedPassword = await bcrypt.hash(password, 10)

  // Check if user already exists
  const selectUserQuery = `SELECT * FROM users WHERE username = ? OR email = ?`
  const existingUser = await database.get(selectUserQuery, [username, email])
  if (existingUser) {
    return response.status(400).send('User already exists')
  }

  // Create new user
  const insertUserQuery = `
    INSERT INTO users (username, email, password)
    VALUES (?, ?, ?)
  `
  await database.run(insertUserQuery, [username, email, hashedPassword])

  // Generate JWT token
  const payload = { username }
  const jwtToken = jwt.sign(payload, 'vidora-secret-key-2024')
  response.send({ jwtToken, user: { username, email } })
})

// User Login
app.post('/api/login', async (request, response) => {
  const { email, password } = request.body
  const selectUserQuery = `SELECT * FROM users WHERE email = ?`
  const user = await database.get(selectUserQuery, [email])

  if (!user) {
    return response.status(400).send('Invalid user')
  }

  const isPasswordMatched = await bcrypt.compare(password, user.password)
  if (!isPasswordMatched) {
    return response.status(400).send('Invalid password')
  }

  const payload = { username: user.username, email: user.email }
  const jwtToken = jwt.sign(payload, 'vidora-secret-key-2024')
  response.send({ jwtToken, user: { username: user.username, email: user.email } })
})

// Get current user (protected)
app.get('/api/me', authenticateToken, async (request, response) => {
  const selectUserQuery = `SELECT username, email FROM users WHERE username = ?`
  const user = await database.get(selectUserQuery, [request.username])
  response.send({ user })
})

// Logout (just a placeholder)
app.post('/api/logout', (request, response) => {
  response.send({ message: 'Logged out successfully' })
})

// -------------------- Movies Endpoints (Public for now) --------------------
// (You can later protect them by adding authenticateToken middleware)

// GET /api/movies?search=&genre=&language=
// Returns movies filtered by search term, genre, and language (all optional)
app.get('/api/movies', async (request, response) => {
  const { search, genre, language } = request.query;
  let sql = 'SELECT * FROM movies WHERE 1=1';
  const params = [];

  // Search by name, director, or cast – note the double quotes around "cast"
  if (search && search.trim() !== '') {
    const trimmed = search.trim();
    sql += ` AND (name LIKE ? OR director LIKE ? OR "cast" LIKE ?)`;
    const pattern = `%${trimmed}%`;
    params.push(pattern, pattern, pattern);
  }

  // Filter by genre
  if (genre) {
    sql += ` AND genres LIKE ?`;
    params.push(`%${genre}%`);
  }

  // Filter by language
  if (language) {
    sql += ` AND language = ?`;
    params.push(language);
  }

  sql += ' ORDER BY id';

  try {
    const movies = await database.all(sql, params);
    const formatted = movies.map(m => ({
      ...m,
      genres: m.genres ? m.genres.split(',') : [],
      cast: m.cast ? m.cast.split(',') : []
    }));
    response.send(formatted);
  } catch (error) {
    console.error('Database error:', error.message);
    response.status(500).send({ error: error.message });
  }
});

// GET /api/movies/:id – Get a single movie by ID
app.get('/api/movies/:id', async (request, response) => {
  const { id } = request.params
  const sql = 'SELECT * FROM movies WHERE id = ?'
  const movie = await database.get(sql, [id])

  if (!movie) {
    return response.status(404).send('Movie not found')
  }

  const formatted = {
    ...movie,
    genres: movie.genres ? movie.genres.split(',') : [],
    cast: movie.cast ? movie.cast.split(',') : []
  }
  response.send(formatted)
})

// GET /api/trending – Returns top 10 trending movies (from trending table)
app.get('/api/trending', async (request, response) => {
  const sql = `
    SELECT m.* FROM movies m
    JOIN trending t ON m.id = t.movie_id
    ORDER BY t.rank
  `
  const movies = await database.all(sql)
  const formatted = movies.map(m => ({
    ...m,
    genres: m.genres ? m.genres.split(',') : [],
    cast: m.cast ? m.cast.split(',') : []
  }))
  response.send(formatted)
})

// -------------------- Protected Admin Endpoints (require token) --------------------
// These are for adding/updating/deleting movies – only accessible with a valid token.

// POST /api/movies – Add a new movie
app.post('/api/movies', authenticateToken, async (request, response) => {
  const { name, image, year, genres, embed, director, cast, synopsis, language, rating } = request.body
  const sql = `
    INSERT INTO movies (name, image, year, genres, embed, director, cast, synopsis, language, rating)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `
  const params = [
    name, image, year,
    genres.join(','), embed, director,
    cast.join(','), synopsis, language, rating
  ]
  await database.run(sql, params)
  response.send('Movie Successfully Added')
})

// PUT /api/movies/:id – Update an existing movie
app.put('/api/movies/:id', authenticateToken, async (request, response) => {
  const { id } = request.params
  const { name, image, year, genres, embed, director, cast, synopsis, language, rating } = request.body
  const sql = `
    UPDATE movies
    SET name = ?, image = ?, year = ?, genres = ?, embed = ?, director = ?, cast = ?, synopsis = ?, language = ?, rating = ?
    WHERE id = ?
  `
  const params = [
    name, image, year,
    genres.join(','), embed, director,
    cast.join(','), synopsis, language, rating,
    id
  ]
  await database.run(sql, params)
  response.send('Movie Details Updated')
})

// DELETE /api/movies/:id – Remove a movie
app.delete('/api/movies/:id', authenticateToken, async (request, response) => {
  const { id } = request.params
  const sql = 'DELETE FROM movies WHERE id = ?'
  await database.run(sql, [id])
  response.send('Movie Removed')
})

module.exports = app