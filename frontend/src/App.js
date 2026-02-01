import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';


// Components
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import MovieDetails from './components/MovieDetails';
import About from './components/About';
import Subscribe from './components/Subscribe';
import NotFound from './components/NotFound';
import ProtectedRoute from './components/ProtectedRoute';

import './App.css';

const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/about" component={About} />
        <ProtectedRoute exact path="/" component={Home} />
        <ProtectedRoute exact path="/subscribe" component={Subscribe} />
        <ProtectedRoute exact path="/movie/:id" component={MovieDetails} />
        <Route path="/not-found" component={NotFound} />
        <Redirect to="/not-found" />
      </Switch>
    </Router>
  );
};

export default App;