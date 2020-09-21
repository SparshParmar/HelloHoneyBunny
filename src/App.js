import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';

import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';

import NavBar from './components/NavBar';
import AuthRoute from './util/AuthRoute';
import home from './pages/home';
import login from './pages/login';
import signUp from './pages/signUp';
import themeFile from './util/theme.js';
import jwtDecode from 'jwt-decode';
const theme = createMuiTheme(themeFile);

let authenticated;
const token = localStorage.FBIdToken;

if (token) {
  const decodedToken = jwtDecode(token);
  console.log(decodedToken.exp * 1000);
  if (decodedToken.exp * 1000 < Date.now()) {
    window.location.href = '/login';
    authenticated = false;
  } else {
    authenticated = true;
  }
}
class App extends Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <div className="App">
          <Router>
            <NavBar />
            <div className="container">
              <Switch>
                <Route exact path="/" component={home} />
                <AuthRoute
                  exact
                  path="/login"
                  component={login}
                  authenticated={authenticated}
                />
                <AuthRoute
                  exact
                  path="/signUp"
                  component={signUp}
                  authenticated={authenticated}
                />
              </Switch>
            </div>
          </Router>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
