import React from 'react';
import { Link } from 'react-router-dom';
import './index.css';

const VideoCard = ({ movie, isHovered, onMouseEnter, onMouseLeave, onPlayTrailer }) => {
  return (
    <div
      className="movie-card"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <Link to={`/movie/${movie.id}`} className="movie-card-link">
        <div className="movie-card-image-container">
          <img
            src={movie.image}
            alt={movie.name}
            className={`movie-card-image ${isHovered ? 'hovered' : ''}`}
          />
          <div className="movie-card-overlay" />

          {isHovered && (
            <div className="movie-card-hover-info">
              <div className="hover-info-content">
                <h4 className="hover-movie-title">{movie.name}</h4>
                <div className="hover-movie-meta">
                  <span className="hover-year">{movie.year}</span>
                  <span className="hover-language">{movie.language}</span>
                  <span className="hover-rating">★ {movie.rating}</span>
                </div>
                <p className="hover-genres">{movie.genres.join(', ')}</p>
                <div className="hover-actions">
                  <button
                    className="hover-action-btn play-btn"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onPlayTrailer(movie.embed);
                    }}
                  >
                    <svg viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    <span>Trailer</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="movie-card-info">
          <h3 className="movie-card-title">{movie.name}</h3>
          <div className="movie-card-meta">
            <span className="movie-card-year">{movie.year}</span>
            <span className="movie-card-rating">★ {movie.rating}</span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default VideoCard;