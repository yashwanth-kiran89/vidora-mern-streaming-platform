import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import Cookies from 'js-cookie';
import Slider from 'react-slick';
import Popup from 'reactjs-popup';
import ReactPlayer from 'react-player';
import { API_URL } from '../../config';
import Header from '../Header';
import VideoCard from '../VideoCard';
import './index.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

class Home extends Component {
  state = {
    movies: [],
    trendingMovies: [],
    searchQuery: '',
    selectedGenre: '',
    selectedLanguage: '',
    isLoading: true,
    hoveredMovie: null,
    hoverTimeout: null,
    trailerModalOpen: false,
    selectedTrailer: ''
  };

  componentDidMount() {
    this.fetchMovies();
    this.fetchTrending();
  }

  componentWillUnmount() {
    if (this.state.hoverTimeout) {
      clearTimeout(this.state.hoverTimeout);
    }
  }

  fetchMovies = async () => {
    try {
      const response = await fetch(`${API_URL}/api/movies`);
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

  fetchTrending = async () => {
    try {
      const response = await fetch(`${API_URL}/api/trending`);
      if (response.ok) {
        const data = await response.json();
        this.setState({ trendingMovies: data });
      }
    } catch (error) {
      console.error('Error fetching trending:', error);
    }
  };

  handleSearch = e => {
    this.setState({ searchQuery: e.target.value });
  };

  handleGenreChange = e => {
    this.setState({ selectedGenre: e.target.value });
  };

  handleLanguageChange = e => {
    this.setState({ selectedLanguage: e.target.value });
  };

  handleSearchSubmit = e => {
    e.preventDefault();
    const { searchQuery, selectedGenre, selectedLanguage } = this.state;
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (selectedGenre) params.set('genre', selectedGenre);
    if (selectedLanguage) params.set('language', selectedLanguage); 
    console.log(params.toString());
    this.props.history.push(`/search?${params.toString()}`);
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

  getMoviesByGenre = genre => {
    const { movies } = this.state;
    return movies.filter(movie => movie.genres.some(g => g === genre)).slice(0, 10);
  };

  getPopularMovies = () => {
    const { movies } = this.state;
    return [...movies].sort((a, b) => b.year - a.year).slice(0, 10);
  };

  renderLoader = () => (
    <div className="loading-screen">
      <div className="loading-spinner" />
      <div className="loading-text">Loading your cinematic experience...</div>
    </div>
  );

  renderCarousel = (title, movies, settings = {}) => {
    const defaultSettings = {
      dots: false,
      infinite: true,
      speed: 500,
      slidesToShow: 6,
      slidesToScroll: 4,
      swipeToSlide: true,
      responsive: [
        { breakpoint: 1400, settings: { slidesToShow: 5, slidesToScroll: 3 } },
        { breakpoint: 1024, settings: { slidesToShow: 4, slidesToScroll: 3 } },
        { breakpoint: 768, settings: { slidesToShow: 3, slidesToScroll: 2 } },
        { breakpoint: 480, settings: { slidesToShow: 2, slidesToScroll: 1 } }
      ],
      ...settings
    };

    if (movies.length === 0) return null;

    return (
      <div className="carousel-section">
        <div className="carousel-header">
          <h2 className="carousel-title">{title}</h2>
        </div>
        <Slider {...defaultSettings} className="netflix-carousel">
          {movies.map(movie => (
            <div key={movie.id} className="carousel-slide">
              <VideoCard
                movie={movie}
                isHovered={this.state.hoveredMovie?.id === movie.id}
                onMouseEnter={() => this.handleMovieHover(movie)}
                onMouseLeave={this.handleMouseLeave}
                onPlayTrailer={this.openTrailerModal}
              />
            </div>
          ))}
        </Slider>
      </div>
    );
  };

  renderMoviesList = () => {
    const {
      searchQuery,
      selectedGenre,
      selectedLanguage,
      trendingMovies,
      movies
    } = this.state;

    const popularMovies = this.getPopularMovies();
    const actionMovies = this.getMoviesByGenre('Action');
    const dramaMovies = this.getMoviesByGenre('Drama');
    const thrillerMovies = this.getMoviesByGenre('Thriller');
    const horrorMovies = this.getMoviesByGenre('Horror');
    const comedyMovies = this.getMoviesByGenre('Comedy');
    const sciFiMovies = this.getMoviesByGenre('Sci-Fi');

    return (
      <>
        <Header />
        <div className="hero-banner">
          <div className="hero-backdrop">
            <img
              src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80"
              alt="Hero Banner"
            />
            <div className="hero-gradient" />
          </div>
          <div className="hero-content container">
            <h1 className="hero-title">Unlimited Movies, TV Shows & More</h1>
            <p className="hero-subtitle">Watch anywhere. Cancel anytime.</p>
            <form onSubmit={this.handleSearchSubmit} className="hero-search">
              <div className="search-wrapper">
                <input
                  type="text"
                  className="hero-search-input"
                  placeholder="Search for movies, directors..."
                  value={searchQuery}
                  onChange={this.handleSearch}
                />
                <button type="submit" className="hero-search-btn">
                  <svg className="search-icon" viewBox="0 0 24 24">
                    <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                  </svg>
                </button>
              </div>
              <div className="hero-filters">
                <select
                  className="hero-select-filter"
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
                  className="hero-select-filter"
                  value={selectedLanguage}
                  onChange={this.handleLanguageChange}
                >
                  <option value="">All Languages</option>
                  <option value="Telugu">Telugu</option>
                  <option value="Hindi">Hindi</option>
                  <option value="English">English</option>
                </select>
              </div>
            </form>
            <div className="hero-cta">
              <button
                className="hero-play-btn"
                onClick={() => {
                  document.querySelector('.carousels-container').scrollIntoView({
                    behavior: 'smooth'
                  });
                }}
              >
                <svg viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                <span>Watch Free Demo</span>
              </button>
              <Link to="/about" className="hero-info-btn">
                <svg viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                </svg>
                <span>More Info</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="carousels-container">
          {this.renderCarousel('Trending Now', trendingMovies, { slidesToShow: 6 })}
          {this.renderCarousel('Popular on Vidora', popularMovies, { slidesToShow: 5 })}
          {actionMovies.length > 0 && this.renderCarousel('Action Movies', actionMovies)}
          {dramaMovies.length > 0 && this.renderCarousel('Drama Series', dramaMovies)}
          {thrillerMovies.length > 0 && this.renderCarousel('Thriller Movies', thrillerMovies)}
          {comedyMovies.length > 0 && this.renderCarousel('Comedy Movies', comedyMovies)}
          {sciFiMovies.length > 0 && this.renderCarousel('Sci-Fi Movies', sciFiMovies)} 
          {horrorMovies.length > 0 && this.renderCarousel('Horror Movies', horrorMovies)}
        </div>

        <Popup
          open={this.state.trailerModalOpen}
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
                  url={this.state.selectedTrailer}
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
      </>
    );
  };

  render() {
    const { isLoading } = this.state;
    const jwtToken = Cookies.get('jwt_token');
    if (!jwtToken) return <Redirect to="/login" />;
    return (
      <div className="home-container">
        {isLoading ? this.renderLoader() : this.renderMoviesList()}
      </div>
    );
  }
}

export default Home;