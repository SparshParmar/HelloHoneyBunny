import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';

import { editUserDetails } from '../redux/actions/userActions';
import PropTypes from 'prop-types';
import MyButton from '../util/MyButton';
import withStyles from '@material-ui/core/styles/withStyles';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';

import DialogTitle from '@material-ui/core/DialogTitle';

import Tooltip from '@material-ui/core/Tooltip';

import IconButton from '@material-ui/core/IconButton';
import theme from '../util/theme';
import Edit from '@material-ui/icons/Edit';

const styles = {
  ...theme,
  button: {
    float: 'right',
  },
};

class EditDetails extends Component {
  state = {
    bio: '',
    website: '',
    location: '',
    open: false,
  };

  mapUserDetailsToState = (credentials) => {
    this.setState({
      bio: credentials.bio ? credentials.bio : '',
      website: credentials.website ? credentials.website : '',

      location: credentials.location ? credentials.location : '',
    });
  };
  componentDidMount() {
    const { credentials } = this.props;
    this.mapUserDetailsToState(credentials);
  }

  handleOpen = () => {
    this.setState({ open: true });
    this.mapUserDetailsToState(this.props.credentials);
  };
  handleClose = () => {
    this.setState({ open: false });
  };

  handleSubmit = () => {
    const userDetails = {
      bio: this.state.bio,
      website: this.state.website,
      location: this.state.location,
    };
    this.props.editUserDetails(userDetails);
    this.handleClose();
  };

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  render() {
    const { classes } = this.props;
    return (
      <Fragment>
        <MyButton
          tip="Edit"
          onClick={this.handleOpen}
          btnClassName="classes.button"
        >
          <Edit color="primary" />
        </MyButton>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Edit Your Details</DialogTitle>
          <DialogContent>
            <form>
              <TextField
                name="bio"
                type="text"
                lable="Bio"
                multiline
                rows="3"
                placeholder="A short bio about you"
                className={classes.textField}
                value={this.state.bio}
                onChange={this.handleChange}
                fullWidth
              />

              <TextField
                name="website"
                type="text"
                lable="website"
                placeholder=" Your Website"
                className={classes.textField}
                value={this.state.website}
                onChange={this.handleChange}
                fullWidth
              />
              <TextField
                name="location"
                type="text"
                lable="Location"
                placeholder="Location"
                className={classes.textField}
                value={this.state.location}
                onChange={this.handleChange}
                fullWidth
              />
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancle
            </Button>
            <Button onClick={this.handleSubmit} color="primary">
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      </Fragment>
    );
  }
}

EditDetails.propTypes = {
  editUserDetails: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  credentials: state.user.credentials,
});
export default connect(mapStateToProps, { editUserDetails })(
  withStyles(styles)(EditDetails)
);
