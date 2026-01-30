import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import Cookies from 'js-cookie';
import './index.css';

class Header extends Component {
  onClickLogout = () => {
    Cookies.remove('jwt_token');
    const { history } = this.props;
    history.replace('/login');
  };

  render() {
    const jwtToken = Cookies.get('jwt_token');
    
    return (
      <nav className="navbar">
        <Link to="/" className="navbar-brand">Vidora</Link>
        
        <div className="navbar-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/about" className="nav-link">About</Link>
          
          {jwtToken ? (
            <>
              <Link to="/subscribe" className="nav-link">Subscribe</Link>
              <div className="user-info">
                <button onClick={this.onClickLogout} className="btn btn-secondary">Logout</button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="btn">Register</Link>
            </>
          )}
        </div>
      </nav>
    );
  }
}

export default withRouter(Header);