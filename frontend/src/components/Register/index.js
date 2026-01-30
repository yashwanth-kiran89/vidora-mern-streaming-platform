import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import Cookies from 'js-cookie';
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
      isLoading: false
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
    
    const { password, confirmPassword } = this.state;
    if (password !== confirmPassword) {
      this.setState({ 
        showSubmitError: true, 
        errorMsg: 'Passwords do not match' 
      });
      return;
    }

    this.setState({ isLoading: true, showSubmitError: false });
    const { username, email, password: pwd } = this.state;
    
    const userDetails = { username, email, password: pwd };
    const url = 'http://localhost:5000/api/register';
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
    const { username, email, password, confirmPassword, showSubmitError, errorMsg, isLoading } = this.state;
    const jwtToken = Cookies.get('jwt_token');
    
    if (jwtToken !== undefined) {
      return <Redirect to="/" />;
    }
    
    return (
      <div className="auth-container">
        <div className="auth-form">
          <h2 className="auth-title">Join Vidora</h2>
          
          {showSubmitError && <div className="error-message">{errorMsg}</div>}
          
          <form onSubmit={this.submitForm}>
            <div className="form-group">
              <label className="form-label">Username</label>
              <input
                type="text"
                className="input-field"
                value={username}
                onChange={this.onChangeUsername}
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="input-field"
                value={email}
                onChange={this.onChangeEmail}
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="input-field"
                value={password}
                onChange={this.onChangePassword}
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input
                type="password"
                className="input-field"
                value={confirmPassword}
                onChange={this.onChangeConfirmPassword}
                required
              />
            </div>
            
            <button 
              type="submit" 
              className="btn" 
              disabled={isLoading}
              style={{ width: '100%' }}
            >
              {isLoading ? 'Registering...' : 'Register'}
            </button>
          </form>
          
          <p className="auth-link">
            Already have an account? <a href="/login">Login here</a>
          </p>
        </div>
      </div>
    );
  }
}

export default Register;