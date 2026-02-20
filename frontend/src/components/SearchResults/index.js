import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import Cookies from 'js-cookie';
import Popup from 'reactjs-popup';
import ReactPlayer from 'react-player';
import { API_URL } from '../../config';
import Header from '../Header';
import VideoCard from '../VideoCard';
import './index.css';

class SearchResults extends Component {
  state = {
    movies: [],
    isLoading: true,
    hoveredMovie: null,
    hoverTimeout: null,
    trailerModalOpen: false,
    selectedTrailer: ''
  };

  componentDidMount() {
    this.fetchMovies();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.location.search !== this.props.location.search) {
      this.fetchMovies();
    }
  }

  componentWillUnmount() {
    if (this.state.hoverTimeout) {
      clearTimeout(this.state.hoverTimeout);
    }
  }

  fetchMovies = async () => {
    const { search } = this.props.location;
    this.setState({ isLoading: true });
    try {
      const response = await fetch(`${API_URL}/api/movies${search}`);
      if (response.ok) {
        const data = await response.json();
        this.setState({ movies: data, isLoading: false });
      } else {
        this.setState({ isLoading: false });
      }
    } catch (error) {
      console.error('Error fetching movies:', error);
      this.setState({ isLoading: false });
    }
  };

  handleMovieHover = movie => {
    if (this.state.hoverTimeout) {
      clearTimeout(this.state.hoverTimeout);
    }
    const timeout = setTimeout(() => {
      this.setState({ hoveredMovie: movie });
    }, 300);
    this.setState({ hoverTimeout: timeout });
  };

  handleMouseLeave = () => {
    if (this.state.hoverTimeout) {
      clearTimeout(this.state.hoverTimeout);
    }
    this.setState({ hoveredMovie: null });
  };

  openTrailerModal = trailerUrl => {
    this.setState({
      trailerModalOpen: true,
      selectedTrailer: trailerUrl || 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
    });
  };

  closeTrailerModal = () => {
    this.setState({ trailerModalOpen: false, selectedTrailer: '' });
  };

  renderLoader = () => (
    <div className="loading-screen">
      <div className="loading-spinner" />
      <div className="loading-text">Loading your cinematic experience...</div>
    </div>
  );

  render() {
    const { movies, isLoading, hoveredMovie, trailerModalOpen, selectedTrailer } = this.state;
    const params = new URLSearchParams(this.props.location.search);
    const query = params.get('search') || '';

    const jwtToken = Cookies.get('jwt_token');
    if (!jwtToken) return <Redirect to="/login" />;

    return (
      <div className="home-container">
        <Header />
        <div className="search-results-page">
          <div className="container">
            <h1 className="page-title">
              {query ? `Search Results for "${query}"` : 'All Movies'}
            </h1>

            {isLoading ? (
              this.renderLoader()
            ) : (
              <>
                {movies.length === 0 ? (
                  <div className="no-results">
                    <h2>No movies found</h2>
                    <p>Try different search terms or filters</p>
                    <Link to="/" className="back-home-btn">Back to Home</Link>
                  </div>
                ) : (
                  <div className="movies-grid">
                    {movies.map(movie => (
                      <div key={movie.id} className="grid-movie-card">
                        <VideoCard
                          movie={movie}
                          isHovered={hoveredMovie?.id === movie.id}
                          onMouseEnter={() => this.handleMovieHover(movie)}
                          onMouseLeave={this.handleMouseLeave}
                          onPlayTrailer={this.openTrailerModal}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <Popup
          open={trailerModalOpen}
          closeOnDocumentClick
          onClose={this.closeTrailerModal}
          modal
          lockScroll
          overlayStyle={{
            background: 'rgba(0, 0, 0, 0.95)',
            backdropFilter: 'blur(10px)',
            zIndex: 9999
          }}
          contentStyle={{
            background: '#000',
            border: 'none',
            width: '90%',
            maxWidth: '900px',
            padding: '0',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8)',
            borderRadius: '8px',
            overflow: 'hidden',
            animation: 'popupFadeIn 0.3s ease'
          }}
        >
          {close => (
            <div className="trailer-modal">
              <div className="trailer-header">
                <h3 className="trailer-title">Official Trailer</h3>
                <button className="close-modal-btn" onClick={close}>
                  <svg viewBox="0 0 24 24" width="24" height="24">
                    <path
                      d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
                      fill="white"
                    />
                  </svg>
                </button>
              </div>
              <div className="trailer-player-wrapper">
                <ReactPlayer
                  url={selectedTrailer}
                  playing
                  controls
                  width="100%"
                  height="100%"
                  onEnded={this.closeTrailerModal}
                  config={{
                    youtube: {
                      playerVars: { autoplay: 1, modestbranding: 1, rel: 0 }
                    }
                  }}
                />
              </div>
            </div>
          )}
        </Popup>
      </div>
    );
  }
}

export default SearchResults;