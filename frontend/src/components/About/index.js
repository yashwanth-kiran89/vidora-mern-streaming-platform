import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Header from '../Header';
import './index.css';

class About extends Component {
  render() {
    return (
      <>
        <Header />
        <div className="about-page">
          <div className="about-backdrop">
            <div className="about-overlay"></div>
          </div>
          <div className="about-content container">
            <h1 className="about-title">About Vidora</h1>
            <div className="about-card">
              <p className="about-text">
                Vidora is your ultimate destination for discovering, exploring, and enjoying
                the latest and greatest movies. Our platform brings together a rich collection
                of films across genres, languages, and eras.
              </p>
              <p className="about-text">
                From thrilling blockbusters to heartwarming dramas, action-packed adventures
                to inspiring stories, Vidora delivers cinematic experiences straight to your screen.
              </p>
              <p className="about-text">
                Join our community of movie enthusiasts and never miss a great film again!
              </p>
              <div className="about-cta">
                <Link to="/" className="about-btn">Back to Home</Link>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default About;