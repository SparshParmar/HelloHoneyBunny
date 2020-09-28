import React, { Component, Fragement, Fragment } from 'react';
import { Link } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

//Icons

import AddIcon from '@material-ui/icons/Add';
import HomeIcon from '@material-ui/icons/Home';
import Notifications from '@material-ui/icons/Notifications';

import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import MyButton from '../util/MyButton';
import { Typography } from '@material-ui/core';
class NavBar extends Component {
  render() {
    const { authenticated } = this.props;

    return (
      <AppBar>
        <Toolbar className="nav-container">
          {authenticated ? (
            <Fragment>
              <MyButton tip="Create a Post">
                <AddIcon color="inherit" />
              </MyButton>

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
            <MyButton tip="Notifications">
              <Notifications color="inherit" />
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
