import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import Cookies from 'js-cookie';
import './index.css';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scrolled: false,
      showMobileMenu: false
    };
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll = () => {
    const isScrolled = window.scrollY > 50;
    if (isScrolled !== this.state.scrolled) {
      this.setState({ scrolled: isScrolled });
    }
  };

  onClickLogout = () => {
    Cookies.remove('jwt_token');
    const { history } = this.props;
    history.replace('/login');
  };

  toggleMobileMenu = () => {
    this.setState(prevState => ({
      showMobileMenu: !prevState.showMobileMenu
    }));
  };

  render() {
    const { scrolled, showMobileMenu } = this.state;
    const jwtToken = Cookies.get('jwt_token');
    
    return (
      <>
        <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''} ${showMobileMenu ? 'mobile-menu-open' : ''}`}>
          <div className="navbar-container">
            <div className="navbar-left">
              <Link to="/" className="navbar-brand">
                <span className="brand-text">VIDORA</span>
                <span className="brand-subtitle">STREAM</span>
              </Link>
              
              <div className="navbar-main-links">
                <Link to="/" className="nav-link">Home</Link>
                <Link to="/about" className="nav-link">About</Link>
                {jwtToken && <Link to="/subscribe" className="nav-link">Plans</Link>}
              </div>
            </div>
            
            <div className="navbar-right">
              <div className="navbar-search">
                <svg className="search-icon" viewBox="0 0 24 24">
                  <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                </svg>
              </div>
              
              {jwtToken ? (
                <div className="navbar-auth">
                  <div className="user-info">
                    <span className="username">Welcome</span>
                    <button onClick={this.onClickLogout} className="btn-logout">
                      <span>Logout</span>
                      <svg className="logout-icon" viewBox="0 0 24 24">
                        <path d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5c-1.11 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>
                      </svg>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="navbar-auth">
                  <Link to="/login" className="nav-link auth-link">Sign In</Link>
                  <Link to="/register" className="btn-register">Sign Up</Link>
                </div>
              )}
              
              <button className="mobile-menu-toggle" onClick={this.toggleMobileMenu}>
                <span className={`hamburger-line ${showMobileMenu ? 'active' : ''}`}></span>
                <span className={`hamburger-line ${showMobileMenu ? 'active' : ''}`}></span>
                <span className={`hamburger-line ${showMobileMenu ? 'active' : ''}`}></span>
              </button>
            </div>
          </div>
          
          {/* Mobile Menu */}
          <div className={`mobile-menu ${showMobileMenu ? 'show' : ''}`}>
            <Link to="/" className="mobile-nav-link" onClick={() => this.setState({ showMobileMenu: false })}>Home</Link>
            <Link to="/about" className="mobile-nav-link" onClick={() => this.setState({ showMobileMenu: false })}>About</Link>
            {jwtToken ? (
              <>
                <Link to="/subscribe" className="mobile-nav-link" onClick={() => this.setState({ showMobileMenu: false })}>Plans</Link>
                <button onClick={this.onClickLogout} className="mobile-nav-link logout">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="mobile-nav-link" onClick={() => this.setState({ showMobileMenu: false })}>Sign In</Link>
                <Link to="/register" className="mobile-nav-link" onClick={() => this.setState({ showMobileMenu: false })}>Sign Up</Link>
              </>
            )}
          </div>
        </nav>
        
        {/* Gradient overlay for Netflix effect */}
        <div className="navbar-gradient"></div>
      </>
    );
  }
}

export default withRouter(Header);