import React, { Component } from 'react';
import { Grid } from '@material-ui/core';
import axios from 'axios';
import Scream from '../components/Scream';

class home extends Component {
  state = {
    screams: null,
  };
  componentDidMount() {
    axios
      .get('/screams')
      .then((res) => {
        console.log(res.data);
        this.setState({
          screams: res.data,
        });
      })
      .catch((err) => console.log(err));
  }
  render() {
    let recentScreamsMarkup = this.state.screams ? (
      this.state.screams.map((scream) => (
        <Scream key={scream.screamId} scream={scream} />
      ))
    ) : (
      <p>Loading...</p>
    );

    return (
      <Grid container spacing={10}>
        <Grid item sm={8} xs={12}>
          {recentScreamsMarkup}
        </Grid>
      </Grid>
    );
  }
}

export default home;
