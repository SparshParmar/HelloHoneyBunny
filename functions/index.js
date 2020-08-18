const functions = require('firebase-functions');
const admin = require('firebase-admin');
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
const express = require('express');
const app = express();
admin.initializeApp();
admin.firestore().settings({ ignoreUndefinedProperties: true });

exports.helloWorld = functions.https.onRequest((request, response) => {
  //functions.logger.info('Hello logs!', { structuredData: true });
  response.send('Hello Honey Bunny ❤️');
});

app.get('/screams', (req, res) => {
  admin
    .firestore()
    .collection('screams')
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

app.post('/scream', (req, res) => {
  {
    const newScream = {
      body: req.body.body,
      userHandle: req.body.userHandle,
      createdAt: admin.firestore.Timestamp.fromDate(new Date()),
    };

    console.log(newScream);
    admin
      .firestore()
      .collection('screams')
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

exports.api = functions.https.onRequest(app);
