import React, { Component } from 'react';
import appIcon from '../images/Bunny.png';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import {Link} from 'react-router-dom';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
//Redux
import { connect } from 'react-redux';
import { signupUser } from '../redux/actions/userActions';
import { withStyles } from '@material-ui/core';
import themeFile from '../util/theme';

const style = themeFile;

class signUp extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      loading: false,
      confirmPassword: '',
      handle: '',
      errors: {},
    };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.UI.errors) {
      this.setState({ errors: nextProps.UI.errors });
    }
  }
  handleSubmit = (event) => {
    event.preventDefault();
    this.setState({
      loading: true,
    });
    const newUserData = {
      email: this.state.email,
      password: this.state.password,
      confirmPassword: this.state.confirmPassword,
      handle: this.state.handle,
    };
    this.props.signupUser(newUserData, this.props.history);
  };

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  render() {
    const {
      classes,
      UI: { loading },
    } = this.props;

    const {
      email,
      password,
      handle,
      confirmPassword,
      general,
    } = this.state.errors;
    return (
      <Grid container className={classes.form}>
        <Grid item sm />

        <Grid item sm>
          <Card className={classes.card}>
            <CardContent>
              <img src={appIcon} alt="Maha" className={classes.image} />
              <Typography variant="h5" className={classes.pageTitle}>
                SignUp
              </Typography>
              <form noValidate onSubmit={this.handleSubmit}>
                <TextField
                  id="email"
                  name="email"
                  type="email"
                  label="Email"
                  className={classes.textField}
                  helperText={email}
                  error={email ? true : false}
                  onChange={this.handleChange}
                  value={this.state.email}
                  fullWidth
                />
                <TextField
                  id="password"
                  name="password"
                  type="password"
                  label="password"
                  className={classes.textField}
                  onChange={this.handleChange}
                  helperText={password}
                  error={password ? true : false}
                  fullWidth
                />
                <TextField
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  label="confirm password"
                  className={classes.textField}
                  onChange={this.handleChange}
                  helperText={confirmPassword}
                  error={confirmPassword ? true : false}
                  fullWidth
                />
                <TextField
                  id="handle"
                  name="handle"
                  type="text"
                  label="User Handle"
                  className={classes.textField}
                  helperText={handle}
                  error={handle ? true : false}
                  onChange={this.handleChange}
                  value={this.state.handle}
                  fullWidth
                />
                {general && (
                  <Typography variant="body2" className={classes.customError}>
                    {general === 'Something went Wrongauth/weak-password'
                      ? 'Weak Password'
                      : general}
                  </Typography>
                )}
                {loading ? (
                  <img
                    src={require('../images/Loading3.gif')}
                    alt="Loading"
                    className={classes.Loading}
                  />
                ) : (
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    disabled={loading}
                  >
                    Sign Up
                  </Button>
                )}
              </form>

              <small>
                Already Have an account? Log in <Link to="/login">here</Link>
              </small>
            </CardContent>
          </Card>
        </Grid>
        <Grid item sm></Grid>
      </Grid>
    );
  }
}

signUp.propTypes = {
  classes: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  UI: PropTypes.object.isRequired,
  signupUser: PropTypes.func.isRequired,
};
const mapStateToProps = (state) => ({
  user: state.user,
  UI: state.UI,
});
export default connect(mapStateToProps, { signupUser })(
  withStyles(style)(signUp)
);
