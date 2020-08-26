const { db } = require('../utils/admin');
const firebase = require('firebase');

const { config } = require('../utils/config');
const { signUpValidators, loginValidators } = require('../utils/validators');

firebase.initializeApp(config);

exports.signUp = (req, res) => {
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    handle: req.body.handle,
  };
  const { valid, errors } = signUpValidators(newUser);
  if (!valid) {
    return res.status(400).json({ errors });
  }

  let token, userId;
  db.doc(`/users/${newUser.handle}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        return res.status(400).json({
          handle: ' handleinvalid',
        });
      } else {
        return firebase
          .auth()
          .createUserWithEmailAndPassword(newUser.email, newUser.password);
      }
    })
    .then((data) => {
      userId = data.user.uid;
      return data.user.getIdToken();
    })
    .then((idToken) => {
      // return res.status(201).json({ token });
      console.log('hello');
      token = idToken;
      const userCredentials = {
        handle: newUser.handle,
        email: newUser.email,
        createdAt: new Date().toISOString(),
        userId,
      };
      return db.doc(`/users/${newUser.handle}`).set(userCredentials);
    })
    .then(() => {
      return res.status(201).json({ token: token });
    })
    .catch((err) => {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        return res.status(500).json({
          error: 'EMAIL ID EXISTS',
        });
      }
      return res.status(500).json({
        error_is: err.code,
      });
    });
};

exports.Login = (req, res) => {
  const loginCredantials = {
    email: req.body.email,
    password: req.body.password,
  };

  const { valid, errors } = loginValidators(loginCredantials);

  if (!valid) {
    return res.status(400).json({ errors });
  }

  firebase
    .auth()
    .signInWithEmailAndPassword(
      loginCredantials.email,
      loginCredantials.password
    )
    .then((data) => {
      return data.user.getIdToken();
    })
    .then((token) => {
      return res.json({ token });
    })
    .catch((err) => {
      console.error(err);
      if (err.code === 'auth/wrong-password') {
        return res
          .status(403)
          .json({ error: 'Wrong credentials, please try again' });
      } else return res.status(500).json({ error: err.code });
    });
};
