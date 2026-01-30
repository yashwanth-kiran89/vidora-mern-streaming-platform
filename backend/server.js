const express = require('express')
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const path = require('path')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cors = require('cors')

const databasePath = path.join(__dirname, 'movies.db')

const app = express()

app.use(express.json())
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}))

let database = null

const initializeDbAndServer = async () => {
  try {
    database = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    })

    app.listen(5000, () =>
      console.log('Server Running at http://localhost:5000/'),
    )
  } catch (error) {
    console.log(`DB Error: ${error.message}`)
    process.exit(1)
  }
}

initializeDbAndServer()

// Authentication middleware
const authenticateToken = (request, response, next) => {
  let jwtToken
  const authHeader = request.headers['authorization']
  if (authHeader !== undefined) {
    jwtToken = authHeader.split(' ')[1]
  }
  if (jwtToken === undefined) {
    response.status(401)
    response.send('Invalid JWT Token')
  } else {
    jwt.verify(jwtToken, 'vidora-secret-key-2024', async (error, payload) => {
      if (error) {
        response.status(401)
        response.send('Invalid JWT Token')
      } else {
        request.username = payload.username
        next()
      }
    })
  }
}

// Register user
app.post('/api/register', async (request, response) => {
  const {username, email, password} = request.body
  const hashedPassword = await bcrypt.hash(password, 10)
  
  const selectUserQuery = `SELECT * FROM users WHERE username = '${username}' OR email = '${email}';`
  const databaseUser = await database.get(selectUserQuery)
  
  if (databaseUser === undefined) {
    const createUserQuery = `
      INSERT INTO users (username, email, password) 
      VALUES ('${username}', '${email}', '${hashedPassword}');`
    await database.run(createUserQuery)
    
    const payload = {username: username}
    const jwtToken = jwt.sign(payload, 'vidora-secret-key-2024')
    response.send({jwtToken, user: {username, email}})
  } else {
    response.status(400)
    response.send('User already exists')
  }
})

// Login user
app.post('/api/login', async (request, response) => {
  const {email, password} = request.body
  const selectUserQuery = `SELECT * FROM users WHERE email = '${email}';`
  const databaseUser = await database.get(selectUserQuery)
  
  if (databaseUser === undefined) {
    response.status(400)
    response.send('Invalid user')
  } else {
    const isPasswordMatched = await bcrypt.compare(password, databaseUser.password)
    if (isPasswordMatched === true) {
      const payload = {username: databaseUser.username, email: databaseUser.email}
      const jwtToken = jwt.sign(payload, 'vidora-secret-key-2024')
      response.send({jwtToken, user: {username: databaseUser.username, email: databaseUser.email}})
    } else {
      response.status(400)
      response.send('Invalid password')
    }
  }
})

// Get current user
app.get('/api/me', authenticateToken, async (request, response) => {
  const selectUserQuery = `SELECT username, email FROM users WHERE username = '${request.username}';`
  const databaseUser = await database.get(selectUserQuery)
  response.send({user: databaseUser})
})

// Logout
app.post('/api/logout', (request, response) => {
  response.send({message: 'Logged out successfully'})
})

// Get all movies
app.get('/api/movies', async (request, response) => {
  const getMoviesQuery = `SELECT * FROM movies ORDER BY id;`
  const moviesArray = await database.all(getMoviesQuery)
  const formattedMovies = moviesArray.map(movie => ({
    id: movie.id,
    name: movie.name,
    image: movie.image,
    year: movie.year,
    genres: movie.genres ? movie.genres.split(',') : [],
    embed: movie.embed,
    director: movie.director,
    cast: movie.cast ? movie.cast.split(',') : [],
    synopsis: movie.synopsis,
    language: movie.language
  }))
  response.send(formattedMovies)
})

// Get movie by ID
app.get('/api/movies/:id', async (request, response) => {
  const {id} = request.params
  const getMovieQuery = `SELECT * FROM movies WHERE id = ${id};`
  const movie = await database.get(getMovieQuery)
  
  if (movie === undefined) {
    response.status(404)
    response.send('Movie not found')
  } else {
    const formattedMovie = {
      id: movie.id,
      name: movie.name,
      image: movie.image,
      year: movie.year,
      genres: movie.genres ? movie.genres.split(',') : [],
      embed: movie.embed,
      director: movie.director,
      cast: movie.cast ? movie.cast.split(',') : [],
      synopsis: movie.synopsis,
      language: movie.language
    }
    response.send(formattedMovie)
  }
})

// Protected routes for movie management
app.post('/api/movies', authenticateToken, async (request, response) => {
  const {name, image, year, genres, embed, director, cast, synopsis, language} = request.body
  const postMovieQuery = `
    INSERT INTO movies (name, image, year, genres, embed, director, cast, synopsis, language)
    VALUES ('${name}', '${image}', ${year}, '${genres.join(',')}', '${embed}', '${director}', '${cast.join(',')}', '${synopsis}', '${language}');`
  await database.run(postMovieQuery)
  response.send('Movie Successfully Added')
})

app.put('/api/movies/:id', authenticateToken, async (request, response) => {
  const {id} = request.params
  const {name, image, year, genres, embed, director, cast, synopsis, language} = request.body
  const updateMovieQuery = `
    UPDATE movies
    SET 
      name = '${name}',
      image = '${image}',
      year = ${year},
      genres = '${genres.join(',')}',
      embed = '${embed}',
      director = '${director}',
      cast = '${cast.join(',')}',
      synopsis = '${synopsis}',
      language = '${language}'
    WHERE id = ${id};`
  await database.run(updateMovieQuery)
  response.send('Movie Details Updated')
})

app.delete('/api/movies/:id', authenticateToken, async (request, response) => {
  const {id} = request.params
  const deleteMovieQuery = `DELETE FROM movies WHERE id = ${id};`
  await database.run(deleteMovieQuery)
  response.send('Movie Removed')
})

// Search movies
app.get('/api/movies/search/:query', async (request, response) => {
  const {query} = request.params
  const searchQuery = `%${query}%`
  const getMoviesQuery = `
    SELECT * FROM movies 
    WHERE name LIKE '${searchQuery}' OR director LIKE '${searchQuery}' OR cast LIKE '${searchQuery}';`
  const moviesArray = await database.all(getMoviesQuery)
  const formattedMovies = moviesArray.map(movie => ({
    id: movie.id,
    name: movie.name,
    image: movie.image,
    year: movie.year,
    genres: movie.genres ? movie.genres.split(',') : [],
    embed: movie.embed,
    director: movie.director,
    cast: movie.cast ? movie.cast.split(',') : [],
    synopsis: movie.synopsis,
    language: movie.language
  }))
  response.send(formattedMovies)
})

module.exports = app