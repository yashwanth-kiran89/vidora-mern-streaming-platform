import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import Cookies from 'js-cookie'; 
import { API_URL } from "../../config.js"
import './index.css';

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      showSubmitError: false,
      errorMsg: '',
      isLoading: false,
      showPassword: false,
      showConfirmPassword: false
    };
  }

  onChangeUsername = event => {
    this.setState({ username: event.target.value });
  };

  onChangeEmail = event => {
    this.setState({ email: event.target.value });
  };

  onChangePassword = event => {
    this.setState({ password: event.target.value });
  };

  onChangeConfirmPassword = event => {
    this.setState({ confirmPassword: event.target.value });
  };

  togglePasswordVisibility = (field) => {
    if (field === 'password') {
      this.setState(prevState => ({
        showPassword: !prevState.showPassword
      }));
    } else {
      this.setState(prevState => ({
        showConfirmPassword: !prevState.showConfirmPassword
      }));
    }
  };

  onSubmitSuccess = jwtToken => {
    const { history } = this.props;
    Cookies.set('jwt_token', jwtToken, { expires: 30 });
    history.replace('/');
  };

  onSubmitFailure = errorMsg => {
    this.setState({ showSubmitError: true, errorMsg });
  };

  validateForm = () => {
    const { username, email, password, confirmPassword } = this.state;
    
    if (!username.trim()) {
      this.onSubmitFailure('Username is required');
      return false;
    }
    
    if (!email.trim()) {
      this.onSubmitFailure('Email is required');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      this.onSubmitFailure('Please enter a valid email address');
      return false;
    }
    
    if (password.length < 6) {
      this.onSubmitFailure('Password must be at least 6 characters');
      return false;
    }
    
    if (password !== confirmPassword) {
      this.onSubmitFailure('Passwords do not match');
      return false;
    }
    
    return true;
  };

  submitForm = async event => {
    event.preventDefault();
    
    if (!this.validateForm()) {
      return;
    }

    this.setState({ isLoading: true, showSubmitError: false });
    const { username, email, password } = this.state;
    
    const userDetails = { username, email, password };
    const url =  `${API_URL}/api/register`;
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userDetails),
    };

    try {
      const response = await fetch(url, options);
      const data = await response.json();
      
      if (response.ok === true) {
        this.onSubmitSuccess(data.jwtToken);
      } else {
        this.onSubmitFailure(data.error || 'Registration failed');
        this.setState({ isLoading: false });
      }
    } catch (error) {
      this.onSubmitFailure('Something went wrong. Please try again.');
      this.setState({ isLoading: false });
    }
  };

  render() {
    const { 
      username, 
      email, 
      password, 
      confirmPassword, 
      showSubmitError, 
      errorMsg, 
      isLoading,
      showPassword,
      showConfirmPassword 
    } = this.state;
    
    const jwtToken = Cookies.get('jwt_token');
    
    if (jwtToken !== undefined) {
      return <Redirect to="/" />;
    }
    
    return (
      <div className="register-container">
        <div className="register-gradient"></div>
        
        <div className="register-header">
          <Link to="/" className="register-brand">
            <span className="brand-text">VIDORA</span>
            <span className="brand-subtitle">STREAM</span>
          </Link>
        </div>
        
        <div className="register-content">
          <div className="register-form-wrapper">
            <div className="register-form">
              <h2 className="register-title">Create Account</h2>
              
              {showSubmitError && (
                <div className="register-error">
                  <svg className="error-icon" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                  </svg>
                  <span>{errorMsg}</span>
                </div>
              )}
              
              <form onSubmit={this.submitForm} className="register-form-fields">
                <div className="form-group">
                  <input
                    type="text"
                    className="register-input"
                    value={username}
                    onChange={this.onChangeUsername}
                    placeholder="Username"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <input
                    type="email"
                    className="register-input"
                    value={email}
                    onChange={this.onChangeEmail}
                    placeholder="Email"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <div className="password-input-wrapper">
                    <input
                      type={showPassword ? "text" : "password"}
                      className="register-input"
                      value={password}
                      onChange={this.onChangePassword}
                      placeholder="Password (min. 6 characters)"
                      required
                    />
                    <button 
                      type="button"
                      className="password-toggle"
                      onClick={() => this.togglePasswordVisibility('password')}
                    >
                      {showPassword ? (
                        <svg className="eye-icon" viewBox="0 0 24 24">
                          <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                        </svg>
                      ) : (
                        <svg className="eye-icon" viewBox="0 0 24 24">
                          <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
                
                <div className="form-group">
                  <div className="password-input-wrapper">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      className="register-input"
                      value={confirmPassword}
                      onChange={this.onChangeConfirmPassword}
                      placeholder="Confirm Password"
                      required
                    />
                    <button 
                      type="button"
                      className="password-toggle"
                      onClick={() => this.togglePasswordVisibility('confirm')}
                    >
                      {showConfirmPassword ? (
                        <svg className="eye-icon" viewBox="0 0 24 24">
                          <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                        </svg>
                      ) : (
                        <svg className="eye-icon" viewBox="0 0 24 24">
                          <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
                
                <div className="form-terms">
                  <input type="checkbox" id="terms" className="terms-checkbox" required />
                  <label htmlFor="terms" className="terms-label">
                    I agree to the <Link to="#" className="terms-link">Terms of Service</Link> and <Link to="#" className="terms-link">Privacy Policy</Link>
                  </label>
                </div>
                
                <button 
                  type="submit" 
                  className="register-submit-btn" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="loading-spinner-small"></div>
                  ) : (
                    'Create Account'
                  )}
                </button>
              </form>
              
              <div className="register-divider">
                <span>Already have an account?</span>
              </div>
              
              <div className="register-login">
                <Link to="/login" className="login-link">
                  <svg className="login-icon" viewBox="0 0 24 24">
                    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                  </svg>
                  <span>Sign In to Existing Account</span>
                </Link>
              </div>
              
              <div className="register-note">
                <p>
                  By creating an account, you agree to Vidora's Terms of Service and Privacy Policy.
                </p>
                <p>
                  This page is protected by Google reCAPTCHA to ensure you're not a bot.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="register-footer">
          <p>Questions? Call 000-800-919-1694</p>
          <div className="footer-links">
            <Link to="#">FAQ</Link>
            <Link to="#">Help Center</Link>
            <Link to="#">Terms of Use</Link>
            <Link to="#">Privacy</Link>
            <Link to="#">Cookie Preferences</Link>
            <Link to="#">Corporate Information</Link>
          </div>
          <div className="footer-language">
            <select className="language-select">
              <option>English</option>
              <option>हिन्दी</option>
            </select>
          </div>
        </div>
      </div>
    );
  }
}

export default Register;