import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import MyButton from '../util/MyButton';

//
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DeleteOutline from '@material-ui/icons/DeleteOutline';

import { connect } from 'react-redux';
import { deleteScream } from '../redux/actions/dataActions';
import theme from '../util/theme';
import { IconButton, Tooltip } from '@material-ui/core';
import Add  from '@material-ui/icons/Add';
const styles = {
  deleteButton: {
    position: 'absolute',
    left: '90%',
    top: '4%',
    transition: 'transform .5s',
      "&:hover": {
        color: '#FF0000',
        transform: 'scale(1.1)',
        'box-shadow': '2px 2px 2px #999999'
      }
    
  },
  
};

class DeleteScream extends Component {
  state = {
    open: false,
  };

  handleOpen=(e)=> {
    this.setState({open: true})
    console.log(this.state);
    e.preventDefault()

  };
  handleClose = (e) => {
    this.setState({ open: false });
    console.log(this.state);

  e.preventDefault()

  };
  deleteScream = (e) => {
    console.log(this.props.screamId)
    this.props.deleteScream(this.props.screamId);
    this.setState({ open: false });
    e.preventDefault()

  };
  render() {
    const {classes} = this.props;
    
    return (
      <Fragment>
        <Tooltip title="Delete">
          <IconButton onClick={this.handleOpen} className={classes.deleteButton}>
          <DeleteOutline   color= '#FF0000'/>
          </IconButton>
        </Tooltip>

       
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          fullWidth
          maxWidth="sm"
        >
        <DialogTitle>
            Are you sure you want to delete this scream ?
          </DialogTitle>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.deleteScream} color="secondary">
              Delete
            </Button>
          </DialogActions>
        </Dialog>

       </Fragment>
    );
  }
}

DeleteScream.propTypes = {
  deleteScream: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  screamId: PropTypes.string.isRequired,
};

export default connect(null, { deleteScream })(
  withStyles(styles)(DeleteScream)
);
