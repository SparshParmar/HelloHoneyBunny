import React, { Component, Fragment } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

//Icons

import HomeIcon from '@material-ui/icons/Home';
import Notifications from '@material-ui/icons/Notifications';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import MyButton from '../../util/MyButton';
import PostScream from '../scream/PostScream';
const Link = require('react-router-dom').Link;

class NavBar extends Component {
  render() {
    const { authenticated } = this.props;

    return (
      <AppBar>
        <Toolbar className="nav-container">
          {authenticated ? (
            <Fragment>
              <PostScream />

              <Link to="/">
                <MyButton tip="Home">
                  <HomeIcon color="inherit" />
                </MyButton>
              </Link>

              <MyButton tip="Notifications">
                <Notifications color="inherit" />
              </MyButton>
            </Fragment>
          ) : (
            <MyButton tip="home">
              <Link to="/">
                <HomeIcon color="inherit" />
              </Link>
            </MyButton>
          )}
        </Toolbar>
      </AppBar>
    );
  }
}

const mapStateToProps = (state) => ({
  authenticated: state.user.authenticated,
});

NavBar.propTypes = {
  authenticated: PropTypes.bool.isRequired,
};

export default connect(mapStateToProps)(NavBar);
