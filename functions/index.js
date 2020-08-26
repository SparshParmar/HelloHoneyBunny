const { getAllScreams, postOneScream } = require('./handlers/screams');
const { signUp, Login } = require('./handlers/users');
const FBauth = require('./utils/FBauth');
const functions = require('firebase-functions');
const app = require('express')();

//scream routes
app.get('/screams', getAllScreams);
app.post('/scream', FBauth, postOneScream);
//user route
app.post('/signup', signUp);
app.post('/login', Login);
exports.api = functions.https.onRequest(app);
