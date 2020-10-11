import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import PropTypes from 'prop-types';
import appIcon from '../images/Bunny.png';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import {Link} from 'react-router-dom';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import themeFile from '../util/theme';

import { connect } from 'react-redux';
import { loginUser } from '../redux/actions/userActions';

const style = themeFile;

class login extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      password: '',

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

    const userData = {
      email: this.state.email,
      password: this.state.password,
    };
    this.props.loginUser(userData, this.props.history);
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
    //const { errors } = this.state.errors;
    const { email, password, error } = this.state.errors;
    return (
      <Grid container className={classes.form}>
        <Grid item sm />
        <Grid item sm>
          <Card className={classes.card}>
            <CardContent>
              <img src={appIcon} alt="Maha" className={classes.image} />
              <Typography variant="h5" className={classes.pageTitle}>
                Hello Honey Bunny
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
                {error && (
                  <Typography variant="body2" className={classes.customError}>
                    {error === 'auth/user-not-found' ? 'User Not Found' : error}
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
                    Log In
                  </Button>
                )}
              </form>

              <small>
                Dont Have an account? Sign Up <Link to="/signUp">here</Link>
              </small>
            </CardContent>
          </Card>
        </Grid>
        <Grid item sm />
      </Grid>
    );
  }
}

login.propTypes = {
  classes: PropTypes.object.isRequired,
  loginUser: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  UI: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.user,
  UI: state.UI,
});
const mapActionsToProps = {
  loginUser,
};
export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(style)(login));
