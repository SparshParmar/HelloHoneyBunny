import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';

import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';

import NavBar from './components/layout/NavBar';
import AuthRoute from './util/AuthRoute';
import home from './pages/home';
import login from './pages/login';
import signUp from './pages/signUp';
import themeFile from './util/theme.js';
import jwtDecode from 'jwt-decode';
import { Provider } from 'react-redux';
import store from './redux/store';

import { SET_AUTHENTICATED } from './redux/types';
import { logoutUser, getUserData } from './redux/actions/userActions';
import Axios from 'axios';
const theme = createMuiTheme(themeFile);

const token = localStorage.FBIdToken;

if (token) {
  const decodedToken = jwtDecode(token);
  if (decodedToken.exp * 1000 < Date.now()) {
    window.location.href = '/login';
    store.dispatch(logoutUser());
  } else {
    store.dispatch({ type: SET_AUTHENTICATED });
    Axios.defaults.headers.common['Authorization'] = token;
    store.dispatch(getUserData());
  }
}
class App extends Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <Provider store={store}>
          <Router>
            <NavBar />
            <div className="container">
              <Switch>
                <Route exact path="/" component={home} />
                <AuthRoute exact path="/login" component={login} />
                <AuthRoute exact path="/signUp" component={signUp} />
              </Switch>
            </div>
          </Router>
        </Provider>
      </MuiThemeProvider>
    );
  }
}

export default App;
