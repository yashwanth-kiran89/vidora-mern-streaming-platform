import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import Popup from 'reactjs-popup';
import ReactPlayer from 'react-player';
import Header from '../Header';
import './index.css';

// Import slick CSS for similar movies carousel
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from 'react-slick';

class MovieDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      movie: null,
      isLoading: true,
      error: null,
      trailerModalOpen: false,
      similarMovies: [],
      playTrailer: false
    };
  }

  componentDidMount() {
    this.fetchMovie();
    this.fetchSimilarMovies();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.id !== this.props.match.params.id) {
      this.fetchMovie();
      this.fetchSimilarMovies();
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

  fetchSimilarMovies = async () => {
    // In a real app, this would be an API call
    // For now, we'll simulate similar movies
    const url = 'http://localhost:5000/api/movies';
    const options = { method: 'GET' };

    try {
      const response = await fetch(url, options);
      if (response.ok) {
        const data = await response.json();
        // Filter similar movies by genre or other criteria
        this.setState({ 
          similarMovies: data.slice(0, 10) 
        });
      }
    } catch (error) {
      console.error('Error fetching similar movies:', error);
    }
  };

  openTrailerModal = () => {
    this.setState({ 
      trailerModalOpen: true,
      playTrailer: true 
    });
  };

  closeTrailerModal = () => {
    this.setState({ 
      trailerModalOpen: false,
      playTrailer: false 
    });
  };

  renderLoader = () => (
    <div className="movie-details-loading">
      <div className="loading-spinner"></div>
      <div className="loading-text">Loading movie details...</div>
    </div>
  );

  renderSimilarMoviesCarousel = () => {
    const { similarMovies } = this.state;

    if (similarMovies.length === 0) return null;

    const settings = {
      dots: false,
      infinite: true,
      speed: 500,
      slidesToShow: 5,
      slidesToScroll: 3,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 4,
            slidesToScroll: 2,
          }
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 2,
          }
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
          }
        }
      ]
    };

    return (
      <div className="similar-movies-section">
        <h3 className="similar-movies-title">More Like This</h3>
        <Slider {...settings} className="similar-movies-carousel">
          {similarMovies.map(movie => (
            <div key={movie.id} className="similar-movie-slide">
              <Link to={`/movie/${movie.id}`} className="similar-movie-card">
                <img src={movie.image} alt={movie.name} />
                <div className="similar-movie-info">
                  <h4>{movie.name}</h4>
                  <span>{movie.year}</span>
                </div>
              </Link>
            </div>
          ))}
        </Slider>
      </div>
    );
  };

  renderMovieDetails = () => {
    const { movie } = this.state;

    return (
      <>
        <Header />
        
        {/* Movie Backdrop */}
        <div className="movie-backdrop">
          <img 
            src={movie.image} 
            alt={movie.name}
            className="backdrop-image" 
          />
          <div className="backdrop-gradient"></div>
        </div>

        <div className="movie-details-container">
          {/* Movie Content */}
          <div className="movie-content">
            <div className="movie-poster-wrapper">
              <img 
                src={movie.image} 
                alt={movie.name} 
                className="movie-poster-large"
              />
              <div className="poster-overlay">
                <button 
                  className="play-trailer-btn"
                  onClick={this.openTrailerModal}
                >
                  <svg viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                  <span>Play Trailer</span>
                </button>
              </div>
            </div>
            
            <div className="movie-info-container">
              <div className="movie-header">
                <h1 className="movie-title">{movie.name}</h1>
                <div className="movie-metadata">
                  <span className="movie-year">{movie.year}</span>
                  <span className="movie-rating">
                    <svg viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                    </svg>
                    8.5
                  </span>
                  <span className="movie-duration">2h 28m</span>
                  <span className="movie-quality">4K</span>
                </div>
                
                <div className="movie-genres">
                  {movie.genres.map((genre, index) => (
                    <span key={index} className="genre-tag">{genre}</span>
                  ))}
                </div>
              </div>
              
              <div className="movie-actions">
                <button 
                  className="action-btn watch-btn"
                  onClick={this.openTrailerModal}
                >
                  <svg viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                  <span>Watch Trailer</span>
                </button>
                
                <button className="action-btn add-btn">
                  <svg viewBox="0 0 24 24">
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                  </svg>
                  <span>Add to List</span>
                </button>
                
                <button className="action-btn share-btn">
                  <svg viewBox="0 0 24 24">
                    <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
                  </svg>
                </button>
              </div>
              
              <div className="movie-synopsis">
                <h3>Synopsis</h3>
                <p>{movie.synopsis}</p>
              </div>
              
              <div className="movie-cast-crew">
                <div className="cast-section">
                  <h4>Cast</h4>
                  <div className="cast-list">
                    {movie.cast.map((actor, index) => (
                      <span key={index} className="cast-member">{actor}</span>
                    ))}
                  </div>
                </div>
                
                <div className="crew-section">
                  <h4>Director</h4>
                  <p className="director-name">{movie.director}</p>
                </div>
                
                <div className="details-section">
                  <h4>Details</h4>
                  <div className="details-list">
                    <div className="detail-item">
                      <span className="detail-label">Language:</span>
                      <span className="detail-value">{movie.language}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Release Year:</span>
                      <span className="detail-value">{movie.year}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Country:</span>
                      <span className="detail-value">India</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Similar Movies Carousel */}
          {this.renderSimilarMoviesCarousel()}
          
          {/* Back Button */}
          <div className="back-to-home">
            <Link to="/" className="back-btn">
              <svg viewBox="0 0 24 24">
                <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
              </svg>
              <span>Back to Home</span>
            </Link>
          </div>
        </div>

        {/* Trailer Modal */}
        <Popup
          open={this.state.trailerModalOpen}
          closeOnDocumentClick={false}
          onClose={this.closeTrailerModal}
          modal
          overlayStyle={{ background: 'rgba(0, 0, 0, 0.9)' }}
          contentStyle={{
            background: 'transparent',
            border: 'none',
            width: '90%',
            maxWidth: '900px',
            padding: 0,
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8)'
          }}
        >
          <div className="movie-trailer-modal">
            <button className="close-modal-btn" onClick={this.closeTrailerModal}>
              <svg viewBox="0 0 24 24">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            </button>
            
            <div className="trailer-player-wrapper">
              {movie.embed ? (
                <ReactPlayer
                  url={movie.embed}
                  playing={this.state.playTrailer}
                  controls={true}
                  width="100%"
                  height="100%"
                  config={{
                    youtube: {
                      playerVars: {
                        autoplay: 1,
                        modestbranding: 1,
                        rel: 0
                      }
                    }
                  }}
                />
              ) : (
                <div className="no-trailer">
                  <svg viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  <h3>Trailer Coming Soon</h3>
                  <p>We're working on bringing you the official trailer.</p>
                </div>
              )}
            </div>
            
            <div className="trailer-modal-info">
              <h3 className="trailer-modal-title">{movie.name} - Official Trailer</h3>
              <div className="trailer-modal-meta">
                <span>{movie.year}</span>
                <span>{movie.language}</span>
                <span>2h 28m</span>
              </div>
            </div>
          </div>
        </Popup>
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
        <div className="movie-error">
          <Header />
          <div className="error-container">
            <div className="error-icon">🎬</div>
            <h2 className="error-title">Movie Not Found</h2>
            <p className="error-text">{error || 'The movie you are looking for does not exist.'}</p>
            <Link to="/" className="back-to-home-btn">Back to Home</Link>
          </div>
        </div>
      );
    }
    
    return this.renderMovieDetails();
  }
}

export default MovieDetails;