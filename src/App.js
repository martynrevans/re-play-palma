import React, { Component } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

import Home from './components/Home';
import Persons from './components/Persons';
import Sessions from './components/Sessions';
import Session from './components/Session';

import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

class App extends Component {

  render() {
    
    return (
      <Router>
        <div>
          <Navbar bg="dark" variant="dark">
            <Navbar.Brand href="#home">
              <img
                alt=""
                src="/logo.svg"
                width="30"
                height="30"
                className="d-inline-block align-top"
              />
              {' RE:PLAY'}
            </Navbar.Brand>
            <Nav className="mr-auto">
              <Link to={'/'} className="nav-link"> Home </Link>
              <Link to={'/persons'} className="nav-link">Persons</Link>
              <Link to={'/sessions'} className="nav-link">Sessions</Link>
            </Nav>
          </Navbar>          
          <Switch>
              <Route exact path='/' component={Home} />
              <Route path='/persons' component={Persons} />
              <Route path='/sessions' component={Sessions} />
              <Route path='/session/:id' component={Session} />
          </Switch>
        </div>
      </Router>


 
    );
  }
}

export default App;


