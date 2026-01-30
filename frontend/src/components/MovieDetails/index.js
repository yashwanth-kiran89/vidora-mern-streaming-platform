import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import Header from '../Header';
import './index.css';

class MovieDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      movie: null,
      isLoading: true,
      error: null
    };
  }

  componentDidMount() {
    this.fetchMovie();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.id !== this.props.match.params.id) {
      this.fetchMovie();
    }
  }

  fetchMovie = async () => {
    const { id } = this.props.match.params;
    const jwtToken = Cookies.get('jwt_token');
    const url = `http://localhost:5000/api/movies/${id}`;
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    };

    try {
      this.setState({ isLoading: true });
      const response = await fetch(url, options);
      
      if (response.ok === true) {
        const data = await response.json();
        this.setState({ 
          movie: data,
          isLoading: false,
          error: null 
        });
      } else {
        this.setState({
          error: 'Movie not found',
          isLoading: false
        });
      }
    } catch (error) {
      this.setState({
        error: 'Network error',
        isLoading: false
      });
    }
  };

  renderLoader = () => (
    <div className="loading">Loading movie details...</div>
  );

  renderMovieDetails = () => {
    const { movie } = this.state;

    return (
      <>
      <Header />
      <div className="movie-details container">
        
        
        <div className="details-header">
          <img src={movie.image} alt={movie.name} className="movie-poster" />
          
          <div className="details-info">
            <h1 className="details-title">{movie.name}</h1>
            
            <div className="details-meta">
              <span className="meta-tag">{movie.year}</span>
              <span className="meta-tag">{movie.language}</span>
              {movie.genres.map((genre, index) => (
                <span key={index} className="meta-tag">{genre}</span>
              ))}
            </div>
            
            <p><strong>Cast:</strong> {movie.cast.join(', ')}</p>
            <p><strong>Director:</strong> {movie.director}</p>
            
            <div className="action-buttons" style={{ marginTop: '20px' }}>
              <button className="btn" style={{ marginRight: '10px' }}>
                Watch Trailer
              </button>
              <button className="btn btn-secondary">
                Download
              </button>
            </div>
          </div>
        </div>

        {movie.embed && (
          <div className="trailer-container">
            <iframe
              className="trailer-iframe"
              src={movie.embed}
              title={movie.name}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}

        <div className="synopsis">
          <h3>Synopsis</h3>
          <p>{movie.synopsis}</p>
        </div>

        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <Link to="/" className="btn">Back to Home</Link>
        </div>
      </div>
      </>
    );
  };

  render() {
    const { movie, isLoading, error } = this.state;
    const jwtToken = Cookies.get('jwt_token');
    
    if (jwtToken === undefined) {
      return <Redirect to="/login" />;
    }
    
    if (isLoading) {
      return this.renderLoader();
    }
    
    if (error || !movie) {
      return (
        <div className="container">
          <Header />
          <div className="error-message">{error || 'Movie not found'}</div>
          <Link to="/" className="btn">Back to Home</Link>
        </div>
      );
    }
    
    return this.renderMovieDetails();
  }
}

export default MovieDetails;