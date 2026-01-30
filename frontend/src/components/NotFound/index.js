import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './index.css';

class NotFound extends Component {
  render() {
    return (
      <div className="not-found">
        <div className="not-found-content">
          <div className="not-found-icon">🔍</div>
          <h1 className="not-found-title">404</h1>
          <h2 className="not-found-subtitle">Page Not Found</h2>
          <p className="not-found-text">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>
          <Link to="/" className="btn btn-shine">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }
}

export default NotFound;