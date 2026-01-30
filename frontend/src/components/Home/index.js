import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import Cookies from 'js-cookie';
import Header from '../Header';
import './index.css';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      movies: [],
      filteredMovies: [],
      searchQuery: '',
      selectedGenre: '',
      selectedLanguage: '',
      isLoading: true
    };
  }

  componentDidMount() {
    this.fetchMovies();
  }

  fetchMovies = async () => {
    const url = 'http://localhost:5000/api/movies';
    const options = {
      method: 'GET',
    };

    try {
      const response = await fetch(url, options);
      if (response.ok === true) {
        const data = await response.json();
        this.setState({
          movies: data,
          filteredMovies: data,
          isLoading: false
        });
      } else {
        console.log('Failed to fetch movies:', response.status, response.statusText);
        this.setState({ isLoading: false });
      }
    } catch (error) {
      console.error('Error fetching movies:', error);
      this.setState({ isLoading: false });
    }
  };

  handleSearch = e => {
    const query = e.target.value.toLowerCase();
    this.setState({ searchQuery: query }, this.applyFilters);
  };

  handleGenreChange = e => {
    this.setState({ selectedGenre: e.target.value }, this.applyFilters);
  };

  handleLanguageChange = e => {
    this.setState({ selectedLanguage: e.target.value }, this.applyFilters);
  };

  applyFilters = () => {
    const { movies, searchQuery, selectedGenre, selectedLanguage } = this.state;
    
    let filtered = movies;

    if (searchQuery) {
      filtered = filtered.filter(movie =>
        movie.name.toLowerCase().includes(searchQuery) ||
        movie.director.toLowerCase().includes(searchQuery)
      );
    }

    if (selectedGenre) {
      filtered = filtered.filter(movie =>
        movie.genres.some(genre => genre === selectedGenre)
      );
    }

    if (selectedLanguage) {
      filtered = filtered.filter(movie =>
        movie.language === selectedLanguage
      );
    }

    this.setState({ filteredMovies: filtered });
  };

  renderLoader = () => (
    <div className="loading">Loading movies...</div>
  );

  renderMoviesList = () => {
    const { filteredMovies, searchQuery, selectedGenre, selectedLanguage } = this.state;

    return (
      <div className="home">
        <Header />
        <div className="hero">
          <h1>Where Clarity & Quality Matters</h1>
          <p>Watch movies HD, exclusively available on Vidora.</p>
          
          <div className="search-container">
            <input
              type="text"
              className="input-field"
              placeholder="Search for movies..."
              value={searchQuery}
              onChange={this.handleSearch}
            />
            <button className="btn">Search</button>
          </div>
        </div>

        <div className="filters">
          <select 
            className="select-filter"
            value={selectedGenre}
            onChange={this.handleGenreChange}
          >
            <option value="">All Genres</option>
            <option value="Action">Action</option>
            <option value="Drama">Drama</option>
            <option value="Romance">Romance</option>
            <option value="Comedy">Comedy</option>
            <option value="Thriller">Thriller</option>
            <option value="Horror">Horror</option>
            <option value="Sci-Fi">Sci-Fi</option>
          </select>

          <select 
            className="select-filter"
            value={selectedLanguage}
            onChange={this.handleLanguageChange}
          >
            <option value="">All Languages</option>
            <option value="Telugu">Telugu</option>
            <option value="Hindi">Hindi</option>
            <option value="English">English</option>
          </select>
        </div>

        <div className="movies-section container">
          <h2 className="section-title">Trending Movies</h2>
          
          <div className="movies-grid">
            {filteredMovies.map(movie => (
              <Link to={`/movie/${movie.id}`} key={movie.id} className="movie-card">
                <img src={movie.image} alt={movie.name} />
                <div className="movie-info">
                  <h3 className="movie-title">{movie.name}</h3>
                  <span className="movie-year">{movie.year}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  };

  render() {
    const { isLoading } = this.state;
    const jwtToken = Cookies.get('jwt_token');
    
    if (jwtToken === undefined) {
      return <Redirect to="/login" />;
    }
    
    return (
      <>
        {isLoading ? this.renderLoader() : this.renderMoviesList()}
      </>
    );
  }
}

export default Home;