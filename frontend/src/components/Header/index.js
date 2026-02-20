import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import Cookies from 'js-cookie';
import Popup from 'reactjs-popup';          // <-- added import
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
                <Link to = "/">
                  <svg className="search-icon" viewBox="0 0 24 24">
                    <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                  </svg>
                </Link>
              </div>
              
              {jwtToken ? (
                <div className="navbar-auth">
                  <div className="user-info">
                    <span className="username">Welcome</span>
                    {/* Desktop Logout with Popup */}
                    <Popup
                      trigger={
                        <button className="btn-logout">
                          <span>Logout</span>
                          <svg className="logout-icon" viewBox="0 0 24 24">
                            <path d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5c-1.11 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>
                          </svg>
                        </button>
                      }
                      modal
                      lockScroll
                      closeOnDocumentClick
                      overlayStyle={{
                        background: 'rgba(0, 0, 0, 0.95)',
                        backdropFilter: 'blur(10px)',
                        zIndex: 9999
                      }}
                      contentStyle={{
                        background: '#141414',
                        border: '1px solid rgba(255, 215, 0, 0.2)',
                        width: '90%',
                        maxWidth: '400px',
                        padding: '0',
                        borderRadius: '8px',
                        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8)',
                        animation: 'popupFadeIn 0.3s ease'
                      }}
                    >
                      {close => (
                        <div className="logout-popup">
                          <div className="logout-popup-header">
                            <h3>Confirm Logout</h3>
                            <button className="close-popup-btn" onClick={close}>
                              <svg viewBox="0 0 24 24" width="20" height="20">
                                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="white"/>
                              </svg>
                            </button>
                          </div>
                          <div className="logout-popup-body">
                            <p>Are you sure you want to logout?</p>
                          </div>
                          <div className="logout-popup-actions">
                            <button className="cancel-btn" onClick={close}>Cancel</button>
                            <button className="confirm-logout-btn" onClick={this.onClickLogout}>Logout</button>
                          </div>
                        </div>
                      )}
                    </Popup>
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
                {/* Mobile Logout with Popup */}
                <Popup
                  trigger={
                    <button className="mobile-nav-link logout">Logout</button>
                  }
                  modal
                  lockScroll
                  closeOnDocumentClick
                  overlayStyle={{
                    background: 'rgba(0, 0, 0, 0.95)',
                    backdropFilter: 'blur(10px)',
                    zIndex: 9999
                  }}
                  contentStyle={{
                    background: '#141414',
                    border: '1px solid rgba(255, 215, 0, 0.2)',
                    width: '90%',
                    maxWidth: '400px',
                    padding: '0',
                    borderRadius: '8px',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8)',
                    animation: 'popupFadeIn 0.3s ease'
                  }}
                >
                  {close => (
                    <div className="logout-popup">
                      <div className="logout-popup-header">
                        <h3>Confirm Logout</h3>
                        <button className="close-popup-btn" onClick={close}>
                          <svg viewBox="0 0 24 24" width="20" height="20">
                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="white"/>
                          </svg>
                        </button>
                      </div>
                      <div className="logout-popup-body">
                        <p>Are you sure you want to logout?</p>
                      </div>
                      <div className="logout-popup-actions">
                        <button className="cancel-btn" onClick={close}>Cancel</button>
                        <button className="confirm-logout-btn" onClick={this.onClickLogout}>Logout</button>
                      </div>
                    </div>
                  )}
                </Popup>
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