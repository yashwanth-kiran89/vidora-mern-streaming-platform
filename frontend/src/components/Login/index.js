import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
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
      isLoading: false
    };
  }

  onChangeEmail = event => {
    this.setState({ email: event.target.value });
  };

  onChangePassword = event => {
    this.setState({ password: event.target.value });
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
    const { email, password, showSubmitError, errorMsg, isLoading } = this.state;
    const jwtToken = Cookies.get('jwt_token');
    
    if (jwtToken !== undefined) {
      return <Redirect to="/" />;
    }
    
    return (
      <div className="auth-container">
        <div className="auth-form">
          <h2 className="auth-title">Login to Vidora</h2>
          
          {showSubmitError && <div className="error-message">{errorMsg}</div>}
          
          <form onSubmit={this.submitForm}>
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
            
            <button 
              type="submit" 
              className="btn" 
              disabled={isLoading}
              style={{ width: '100%' }}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          
          <p className="auth-link">
            Don't have an account? <a href="/register">Register here</a>
          </p>
        </div>
      </div>
    );
  }
}

export default Login;