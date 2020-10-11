import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import Paper from '@material-ui/core/Paper';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';

import withStyles from '@material-ui/core/styles/withStyles';
import MuiLink from '@material-ui/core/Link';
import Button from '@material-ui/core/Button';
import { Typography } from '@material-ui/core';
import LocationOn from '@material-ui/icons/LocationOn';
import LinkIcon from '@material-ui/icons/Link';
import CalendarToday from '@material-ui/icons/CalendarToday';
import EditIcon from '@material-ui/icons/Edit';
import KeyboardReturn from '@material-ui/icons/KeyboardReturn';
import dayjs from 'dayjs';
import theme from '../../util/theme';
import MyButton from '../../util/MyButton';
import { logoutUser, uploadImage } from '../../redux/actions/userActions';
import EditDetails from '../profile/EditDetails'

const styles = theme;

export class Profile extends Component {
  handleImageChange = (event) => {
    const image = event.target.files[0];
    const formData = new FormData();
    formData.append('image', image, image.name);
    this.props.uploadImage(formData);
  };
  handleEditPicture = () => {
    const fileInput = document.getElementById('imageInput');
    fileInput.click();
  };

  handleLogout = () => {
    this.props.logoutUser();
  };

  render() {
    const {
      classes,
      user: {
        credentials: { handle, createdAt, imageUrl, bio, website, location },
        loading,
        authenticated,
      },
    } = this.props;
    let profileMarkup = !loading ? (
      authenticated ? (
        <Paper className={classes.paper}>
          <div className={classes.profile}>
            <div className="image-wrapper">
              <img src={imageUrl} alt="profile" className="profile-image" />
              <input
                type="file"
                id="imageInput"
                onChange={this.handleImageChange}
                hidden="hidden"
              />

              <MyButton
                tip="Change haha Profile Picture"
                onClick={this.handleEditPicture}
                btnClassName="button"
              >
                <EditIcon color="primary" />
              </MyButton>
            </div>

            <hr />
            <div className="profile-details">
              <MuiLink
                component={Link}
                to={`/users/${handle}`}
                color="primary"
                variant="h5"
              >
                {' '}
                @{handle}
              </MuiLink>
              <hr />
              {bio && <Typography variant="body2">{bio}</Typography>}
              {location && (
                <Fragment>
                  <LocationOn color="primary" /> <span>{location}</span>
                  <br />
                </Fragment>
              )}
              {website && (
                <Fragment>
                  <LinkIcon color="primary" />
                  <a href={website}   rel="noopener noreferre">
                    {' '}
                    {website}
                  </a>
                  <br />
                </Fragment>
              )}
              <CalendarToday color="primary" />{' '}
              <span>Joined {dayjs(createdAt).format('MMM YYYY')}</span>
            </div>

            <MyButton tip="logout" onClick={this.handleLogout}>
              <KeyboardReturn color="primary" />
            </MyButton>

            <EditDetails />
          </div>
        </Paper>
      ) : (
        <Paper className="paper">
          <Typography variant="body2" align="center">
            You are Logged Out
          </Typography>

          <div className={classes.buttons}>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to="/login"
            >
              Login
            </Button>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to="/signup"
            >
              SignUp
            </Button>
          </div>
        </Paper>
      )
    ) : (
      <p>loading...</p>
    );
    return profileMarkup;
  }
}
const mapStateToProps = (state) => ({
  user: state.user,
});

const mapActionsToProps = { logoutUser, uploadImage };

Profile.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  uploadImage: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
};
export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(Profile));
