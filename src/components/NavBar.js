import React, { Component } from 'react';
import Link from 'react-router-dom/Link';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';

class navBar extends Component {
  render() {
    return (
      <AppBar>
        <Toolbar class="nav-container">
          <Button color="inherit" component={Link} to="/login">
            Login
          </Button>
          <Button color="inherit" component={Link} to="/">
            Home
          </Button>
          <Button color="inherit" component={Link} to="/signUp">
            SignUp
          </Button>
        </Toolbar>
      </AppBar>
    );
  }
}

export default navBar;
