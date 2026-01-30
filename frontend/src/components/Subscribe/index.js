import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import Cookies from 'js-cookie';
import Header from '../Header';
import './index.css';

class Subscribe extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedPlan: null
    };
  }

  handlePlanSelect = plan => {
    this.setState({ selectedPlan: plan });
    alert(`Thank you for choosing ${plan} plan!`);
  };

  render() {
    const jwtToken = Cookies.get('jwt_token');
    
    if (jwtToken === undefined) {
      return <Redirect to="/login" />;
    }

    const plans = [
      {
        name: 'Basic',
        price: '₹99/month',
        features: ['720p Streaming', 'Basic Library', 'Limited Devices'],
        featured: false
      },
      {
        name: 'Premium',
        price: '₹199/month',
        features: ['1080p HD', 'Full Library', '4 Devices', 'Downloads'],
        featured: true
      },
      {
        name: 'Ultra HD',
        price: '₹299/month',
        features: ['4K Streaming', 'Premium Content', '8 Devices', 'No Ads'],
        featured: false
      }
    ];

    return (
      <>
      <Header />
      <div className="subscribe-page">
        
        <div className="plans-container container">
          <h1 className="plans-title">Choose Your Plan</h1>
          
          <div className="plans-grid">
            {plans.map((plan, index) => (
              <div 
                key={index} 
                className={`plan-card ${plan.featured ? 'featured' : ''}`}
              >
                <h3 className="plan-name">{plan.name}</h3>
                
                <ul className="plan-features">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} style={{ marginBottom: '8px' }}>{feature}</li>
                  ))}
                </ul>
                
                <p className="plan-price">{plan.price}</p>
                
                <button 
                  className="btn"
                  onClick={() => this.handlePlanSelect(plan.name)}
                  style={{ width: '100%' }}
                >
                  Choose Plan
                </button>
              </div>
            ))}
          </div>
          
          <div style={{ marginTop: '40px' }}>
            <Link to="/" className="btn btn-secondary">Back to Home</Link>
          </div>
        </div>
      </div>
      </>
    );
  }
}

export default Subscribe;