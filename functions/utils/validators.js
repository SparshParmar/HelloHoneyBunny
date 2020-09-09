const { user } = require('firebase-functions/lib/providers/auth');

const isEmpty = (string) => {
  return string.trim() === '';
};
const isEmailValid = (email) => {
  const emailRegEx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (email.match(emailRegEx)) {
    return true;
  } else {
    return false;
  }
};

exports.signUpValidators = (data) => {
  let errors = {};

  if (isEmpty(data.email)) {
    errors.email = 'email must not be empty';
  } else if (!isEmailValid(data.email)) {
    errors.email =
      'invalid email format, please make sure you entered the correct email id';
  }

  if (isEmpty(data.password)) {
    errors.password = 'password must not be empty';
  }
  if (!(data.password === data.confirmPassword)) {
    errors.confirmPassword =
      'confirm Password is not the same as the entered password';
  }
  if (isEmpty(data.handle)) {
    errors.handle = 'handle must not be empty';
  }

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false,
  };
};

exports.loginValidators = (data) => {
  const errors = {};
  if (isEmpty(data.email)) {
    errors.email = 'empty email';
  } else if (!isEmailValid(data.email)) {
    errors.email = 'invalid email';
  }
  if (isEmpty(data.password)) {
    errors.password = 'Empty password';
  }

  return { errors, valid: Object.keys(errors).length === 0 ? true : false };
};

exports.reduceUserDetails = (data) => {
  let userDetails = {};
  if (!isEmpty(data.bio.trim())) userDetails.bio = data.bio;
  if (!isEmpty(data.website.trim())) {
    if (data.website.trim().substring(0, 4) !== 'http') {
      userDetails.website = `http://${data.website.trim()}`;
    } else {
      userDetails.website = data.website;
    }
  }
  if (!isEmpty(data.location.trim())) userDetails.location = data.location;

  return userDetails;
};
