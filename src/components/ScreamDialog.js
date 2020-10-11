import React, { Component, Fragment } from 'react';

import { editUserDetails } from '../redux/actions/userActions';
import PropTypes from 'prop-types';
import MyButton from '../util/MyButton';
import withStyles from '@material-ui/core/styles/withStyles';


import dayjs from 'dayjs';
import {Link} from 'react-router-dom';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Close from '@material-ui/icons/Close';
import DialogTitle from '@material-ui/core/DialogTitle';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Typography'
import UnfoldMore from '@material-ui/icons/UnfoldMore';
import ChatIcon from '@material-ui/icons/Chat';

import CloseIcon from '@material-ui/icons/Close';
import {connect} from 'react-redux';
import {getScream} from '../redux/actions/dataActions'
import Typography from '@material-ui/core/Typography';
import LikeButton from './LikeButton'
const styles = {
  invisibleSeperator:{
    border: 'none',
     margin: 4
  },

  expandButton:{
    position:'absolute'
  },
  
  DialogContent: {
    padding: '20px'
  },
  profileImage:{
    maxWidth:'200px',
    maxHeight:'200px',
    borderRadius : '50%',
    objectFit : 'cover'
  },
  closeButton:{
    position: 'absolute',
    left: '90%'
  },
  spinnerDiv: {
    textAlign: 'center',
    marginTop: 50,
    marginBottom: 50
  }
}

class ScreamDialog extends Component {
state = {
  open: false
}
handleOpen = () => {
  this.setState({open: true})
  this.props.getScream(this.props.screamId)
}
handleClose = () => {
  this.setState({open:false})
}

render(){
  const {
    classes, 
    scream :  {screamId, body, createdAt, likeCount, commentCount, userImage, userHandle},
  UI: {loading}
}=this.props;

const dialogMarkup = loading? (<div className={classes.spinnerDiv}><CircularProgress size={200} thickness={2}/></div>):(
  <Fragment>
  <Grid container  spacing={16}>

    <Grid item sm={5}>
      <img src={userImage} alt="Profile" className={classes.profileImage}/>
    </Grid>

    <Grid item sm={7}>
      <Typography
      component={Link}
      color="primary"
      variant="h5"
      to={`/users/${userHandle}`}>
        @{userHandle}
      </Typography>

      <hr className={classes.invisibleSeperator}/>
      <Typography variant="body2" color="textSecondary">
        {dayjs(createdAt).format('h:mm a, MMMM DD YYYY')}
      </Typography>
      <hr className={classes.invisibleSeperator}/>
      
      <Typography variant="body1">{body}</Typography>
      <LikeButton screamId={screamId}></LikeButton>
      <span>{this.props.scream.likeCount} {this.props.scream.likeCount===1?"Like" : "Likes"}</span>

            <MyButton tip="Comments">
              <ChatIcon color="primary" />
            </MyButton>

            <span>{commentCount} comments</span>
    </Grid>
  </Grid> 
  </Fragment>
) 


return (
  <Fragment>
    <MyButton onClick={this.handleOpen} tip="Expand scream" tipclassName={classes.expandButton}>
      <UnfoldMore color="primary"></UnfoldMore>
    </MyButton>


    <Dialog open={this.state.open} onClose={this.handleClose} fullWidth maxWidth="sm">

      <MyButton tip="Close" onClick={this.handleClose} tipClassName={classes.closeButton}>
        <CloseIcon/>
      </MyButton>

      <DialogContent className={classes.DialogContent}>
        {dialogMarkup}
      </DialogContent>
    
    </Dialog>
  </Fragment>
)
}
}

ScreamDialog.propTypes = {
  getScream : PropTypes.func.isRequired,
  screamId: PropTypes.string.isRequired,
  userHandle: PropTypes.string.isRequired,
  scream: PropTypes.object.isRequired,
  UI: PropTypes.object.isRequired
}

const mapStateToProps=state => ( {
  scream: state.data.scream,
  UI: state.UI
})

const mapActionsToProps = {
  getScream
}
export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(ScreamDialog));
