import React, { Component, Fragment } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import ScreamDialog from './ScreamDialog'
//Material UI Stuff
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import ChatIcon from '@material-ui/icons/Chat';

import MyButton from '../../util/MyButton';

import DeleteScream from '../scream/DeleteScream'
import LikeButton from './LikeButton'
const styles = {
  card: {
    position: 'relative',
    display: 'flex',
    marginBottom: 20,
    padding : '10px'
  },
  image: {
    minWidth: 200,
    minHeight: 200,
    maxWidth: 200,
    maxHeight:200,
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 10,
  },
  content: {
    padding: 25,
    objectFit: 'cover',
  },
  line:{
    position : 'absolute',
    bottom: '3px',
    padding:'3px'
  }
};

class Scream extends Component {
 

 
  render() {
    dayjs.extend(relativeTime);
    const {
      classes,
      scream: {
        body,
        createdAt,
        userImage,
        userHandle,
        screamId,
        commentCount,
      },
      user: {
        authenticated,
        credentials: { handle },
      },
      
    } = this.props;

    

    const deleteButton =
      authenticated && handle === userHandle ? (
        <DeleteScream screamId={screamId} />
      ) : null;

    return (
      <Fragment>
        <Card className={classes.card}>
          <CardMedia
            image={userImage}
            title="Profile Image"
            className={classes.image}
          />

          <CardContent className={classes.content}>
            <Typography
              variant="h5"
              color="textSecondary"
              component={Link}
              to={`/users/${userHandle}`}
            >
              {userHandle}

              {deleteButton}
            </Typography>
            <Typography variant="body2" color="primary">
              {dayjs(createdAt).fromNow()}
            </Typography>
            <Typography variant="body1" color="textPrimary">
              {body}
            </Typography>
            <span>
              <br></br>
            </span>
            <span className={classes.line}>
            <LikeButton screamId={screamId}></LikeButton>
            <span>{this.props.scream.likeCount} {this.props.scream.likeCount===1?"Like" : "Likes"}</span>

            <MyButton tip="Comments">
              <ChatIcon color="primary" />
            </MyButton>

            <span>{commentCount} comments</span>

            <ScreamDialog screamId={screamId} userHandle={userHandle}/>

            </span>
          </CardContent>
        </Card>
      </Fragment>
    );
  }
}

Scream.propTypes = {
  
  user: PropTypes.object.isRequired,
  scream: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.user,
});



export default connect(
  mapStateToProps,
  
)(withStyles(styles)(Scream));
