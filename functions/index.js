const functions = require('firebase-functions');
const admin = require('firebase-admin');

var serviceAccount = require('./serviceAccKey/serviceAccountKey.json');
const app = require('express')();
const firebase = require('firebase');
var firebaseConfig = {
  apiKey: 'AIzaSyB2S1o2LHtoSXxdlS7gbA-x4eHR7KvOiUg',
  authDomain: 'hellohoneybunny-1fb9e.firebaseapp.com',
  databaseURL: 'https://hellohoneybunny-1fb9e.firebaseio.com',
  projectId: 'hellohoneybunny-1fb9e',
  storageBucket: 'hellohoneybunny-1fb9e.appspot.com',
  messagingSenderId: '59100487660',
  appId: '1:59100487660:web:41575379ba889795f0eac9',
  measurementId: 'G-YYXMKRQWWW',
};
firebase.initializeApp(firebaseConfig);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://hellohoneybunny-1fb9e.firebaseio.com',
});
admin.firestore().settings({ ignoreUndefinedProperties: true });
const db = admin.firestore();

app.get('/screams', (req, res) => {
  db.collection('screams')
    .orderBy('createdAt', 'desc')
    .get()
    .then((data) => {
      let screams = [];
      data.forEach((doc) => {
        screams.push({
          screamId: doc.id,
          userHandle: doc.data().userHandle,
          body: doc.data().body,
          createdAt: doc.data().createdAt,
        });
      });
      return res.json(screams);
    })
    .catch((err) => console.error('Error in getScreams _ : ' + err));
});

const FBauth = (req, res, next) => {
  let idToken;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    idToken = req.headers.authorization.split('Bearer ')[1];
  } else {
    console.error('No token Found');
    return res.status(403).json({ error: 'Unauthorized' });
  }
  admin
    .auth()
    .verifyIdToken(idToken)
    .then((decodedToken) => {
      req.user = decodedToken;
      console.log(decodedToken);
      return db
        .collection('users')
        .where('userId', '==', req.user.uid)
        .limit(1)
        .get();
    })
    .then((data) => {
      req.user.handle = data.docs[0].data().handle;
      return next();
    })
    .catch((err) => {
      console.error(err);
      return res.status(403).json({ err });
    });
};
app.post('/scream', FBauth, (req, res) => {
  {
    const newScream = {
      body: req.body.body,
      userHandle: req.user.handle,
      createdAt: new Date().toISOString(),
    };

    // console.log(newScream);

    db.collection('screams')
      .add(newScream)
      .then((doc) => {
        return res.json({
          message: `sparsh, the scream with the id: ${doc.id} created in a very sexy order`,
        });
      })
      .catch((err) => {
        res.status(500).json({
          error: 'something really went wrong while creating the new scream',
          err: err,
          scream: newScream,
        });
        console.error(err);
      });
  }
});

const isEmpty = (string) => {
  return string.trim() === '';
};
const isEmailValid = (email) => {
  const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (email.match(emailRegEx)) {
    return true;
  } else {
    return false;
  }
};

app.post('/signup', (req, res) => {
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    handle: req.body.handle,
  };
  let errors = {};
  if (isEmpty(newUser.email)) {
    errors.email = 'email must not be empty';
  } else if (!isEmailValid(newUser.email)) {
    errors.email =
      'invalid email format, please make sure you entered the correct email id';
  }

  if (isEmpty(newUser.password)) {
    errors.password = 'password must not be empty';
  }
  if (!(newUser.password === newUser.confirmPassword)) {
    errors.confirmPassword =
      'confirm Password is not the same as the entered password';
  }
  if (isEmpty(newUser.handle)) {
    errors.handle = 'handle must not be empty';
  }

  if (Object.keys(errors).length > 0) return res.status(400).json(errors);

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
        error: err.code,
      });
    });
});

app.post('/login', (req, res) => {
  const loginCredantials = {
    email: req.body.email,
    password: req.body.password,
  };
  const errors = {};
  if (isEmpty(loginCredantials.email)) {
    errors.email = 'empty email';
  } else if (!isEmailValid(loginCredantials.email)) {
    errors.email = 'invalid email';
  }
  if (isEmpty(loginCredantials.password)) {
    errors.password = 'Empty password';
  }
  if (Object.keys(errors).length > 0) {
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
});
exports.api = functions.https.onRequest(app);
