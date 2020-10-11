import React, { Component } from 'react'
import MyButton from '../util/MyButton'
import {Link} from 'react-router-dom'
import PropTypes from 'prop-types'

import { likeScream, unlikeScream } from '../redux/actions/dataActions';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';

import { connect } from 'react-redux';

export class LikeButton extends Component {
  likedScream = () => {
    if (
      this.props.user.likes &&
      this.props.user.likes.find(
        (like) => like.screamId === this.props.screamId
      )
    )
      return true;
    else return false;
  };
  likeScream = () => {
    this.props.likeScream(this.props.screamId);
  };

  unlikeScream = () => {
    this.props.unlikeScream(this.props.screamId);
  };

  render() {
    const{classes} = this.props
const{authenticated} = this.props.user;
    const likeButton = !authenticated ? (
      <Link to="/login">

      <MyButton tip="Like">
          <FavoriteBorder color="primary" />
      </MyButton>
      </Link>

    ) : this.likedScream() ? (
      <MyButton tip="unlike"  onClick={this.unlikeScream}>
        <FavoriteIcon color="primary" ></FavoriteIcon>
      </MyButton>
    ) : (
      <MyButton tip="like" onClick={this.likeScream} >
        <FavoriteBorder color="primary"></FavoriteBorder>
      </MyButton>
    );

    return likeButton
  }
}

LikeButton.propTypes = {
  user: PropTypes.object.isRequired,
  screamId: PropTypes.string.isRequired,
  likeScream: PropTypes.func.isRequired,
  unlikeScream: PropTypes.func.isRequired
}

const mapStatetoProps = (state) => ({
  user : state.user
})

const mapActionsToProps = ({
  likeScream,
  unlikeScream
})

export default connect(mapStatetoProps,mapActionsToProps)(LikeButton)
