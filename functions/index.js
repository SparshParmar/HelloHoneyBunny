const {
  getAllScreams,
  postOneScream,
  getScream,
  commentOnScream,
} = require('./handlers/screams');
const {
  signUp,
  Login,
  uploadImage,
  addUserDetails,
  getAuthenticatedUser,
} = require('./handlers/users');
const FBauth = require('./utils/FBauth');
const functions = require('firebase-functions');
const app = require('express')();

//scream routes
app.get('/screams', getAllScreams);
app.post('/scream', FBauth, postOneScream);
app.get('/scream/:screamId', getScream);
app.post('/scream/:screamId/comment', FBauth, commentOnScream);
//user route
app.post('/signup', signUp);
app.post('/login', Login);
app.post('/user/uploadImage', FBauth, uploadImage);
app.post('/user', FBauth, addUserDetails);
app.get('/user', FBauth, getAuthenticatedUser);
exports.api = functions.https.onRequest(app);
