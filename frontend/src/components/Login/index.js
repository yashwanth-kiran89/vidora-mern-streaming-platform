import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import './index.css';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      showSubmitError: false,
      errorMsg: '',
      isLoading: false,
      showPassword: false
    };
  }

  onChangeEmail = event => {
    this.setState({ email: event.target.value });
  };

  onChangePassword = event => {
    this.setState({ password: event.target.value });
  };

  togglePasswordVisibility = () => {
    this.setState(prevState => ({
      showPassword: !prevState.showPassword
    }));
  };

  onSubmitSuccess = jwtToken => {
    const { history } = this.props;
    Cookies.set('jwt_token', jwtToken, { expires: 30 });
    history.replace('/');
  };

  onSubmitFailure = errorMsg => {
    this.setState({ showSubmitError: true, errorMsg });
  };

  submitForm = async event => {
    event.preventDefault();
    this.setState({ isLoading: true, showSubmitError: false });
    const { email, password } = this.state;
    
    const userDetails = { email, password };
    const url = 'http://localhost:5000/api/login';
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
        this.onSubmitFailure(data.error || 'Invalid credentials');
        this.setState({ isLoading: false });
      }
    } catch (error) {
      this.onSubmitFailure('Something went wrong. Please try again.');
      this.setState({ isLoading: false });
    }
  };

  render() {
    const { email, password, showSubmitError, errorMsg, isLoading, showPassword } = this.state;
    const jwtToken = Cookies.get('jwt_token');
    
    if (jwtToken !== undefined) {
      return <Redirect to="/" />;
    }
    
    return (
      <div className="login-container">
        <div className="login-gradient"></div>
        
        <div className="login-header">
          <Link to="/" className="login-brand">
            <span className="brand-text">VIDORA</span>
            <span className="brand-subtitle">STREAM</span>
          </Link>
        </div>
        
        <div className="login-content">
          <div className="login-form-wrapper">
            <div className="login-form">
              <h2 className="login-title">Sign In</h2>
              
              {showSubmitError && (
                <div className="login-error">
                  <svg className="error-icon" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                  </svg>
                  <span>{errorMsg}</span>
                </div>
              )}
              
              <form onSubmit={this.submitForm} className="login-form-fields">
                <div className="form-group">
                  <input
                    type="email"
                    className="login-input"
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
                      className="login-input"
                      value={password}
                      onChange={this.onChangePassword}
                      placeholder="Password"
                      required
                    />
                    <button 
                      type="button"
                      className="password-toggle"
                      onClick={this.togglePasswordVisibility}
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
                
                <button 
                  type="submit" 
                  className="login-submit-btn" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="loading-spinner-small"></div>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </form>
              
              <div className="login-help">
                <div className="remember-me">
                  <input type="checkbox" id="remember" className="remember-checkbox" />
                  <label htmlFor="remember" className="remember-label">Remember me</label>
                </div>
                <Link to="#" className="forgot-password">Need help?</Link>
              </div>
              
              <div className="login-divider">
                <span>OR</span>
              </div>
              
              <div className="login-signup">
                <p className="signup-text">
                  New to Vidora?{' '}
                  <Link to="/register" className="signup-link">Sign up now.</Link>
                </p>
                <p className="signup-note">
                  This page is protected by Google reCAPTCHA to ensure you're not a bot.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="login-footer">
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

export default Login;