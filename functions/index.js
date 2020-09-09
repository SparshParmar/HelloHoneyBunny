const {
  getAllScreams,
  postOneScream,
  getScream,
  commentOnScream,
  deleteComment,
  deleteScream,
  likeScream,
  unlikeScream,
} = require('./handlers/screams');
const {
  signUp,
  Login,
  uploadImage,
  addUserDetails,
  getAuthenticatedUser,
  markNotificationsRead,
  getUserDetails,
} = require('./handlers/users');
const FBauth = require('./utils/FBauth');
const functions = require('firebase-functions');
const { db } = require('./utils/admin');
const app = require('express')();

//scream routes
app.get('/screams', getAllScreams);
app.post('/scream', FBauth, postOneScream);
app.get('/scream/:screamId', getScream);
app.post('/scream/:screamId/comment', FBauth, commentOnScream);
app.delete('/scream/:screamId/deleteScream', FBauth, deleteScream);
app.get('/scream/:screamId/like', FBauth, likeScream);
app.get('/scream/:screamId/unlike', FBauth, unlikeScream);

//user route
app.post('/signup', signUp);
app.post('/login', Login);
app.post('/user/uploadImage', FBauth, uploadImage);
app.post('/user', FBauth, addUserDetails);
app.get('/user', FBauth, getAuthenticatedUser);
app.get('/user/:handle', getUserDetails);
app.post('/notifications', markNotificationsRead);

exports.api = functions.https.onRequest(app);

exports.createNotificationOnLike = functions.firestore
  .document('likes/{id}')
  .onCreate((snapshot) => {
    return db
      .doc(`/screams/${snapshot.data().screamId}`)
      .get()
      .then((doc) => {
        if (
          doc.exists &&
          doc.data().userHandle !== snapshot.data().userHandle
        ) {
          return db.doc(`/notifications/${snapshot.id}`).set({
            createdAt: new Date().toISOString(),
            recipient: doc.data().userHandle,
            sender: snapshot.data().userHandle,
            type: 'like',
            read: false,
            screamId: doc.id,
          });
        } else {
          return;
        }
      })
      .catch((err) => {
        console.error(err);
      });
  });

exports.deleteNotificationsOnUnlike = functions.firestore
  .document('likes/{id}')
  .onDelete((snapshot) => {
    return db
      .doc(`/notifications/${snapshot.id}`)
      .delete()
      .catch((err) => {
        console.error(err);
      });
  });
exports.createNotificationOnComments = functions.firestore
  .document('comments/{id}')
  .onCreate((snapshot) => {
    return db
      .doc(`/screams/${snapshot.data().screamId}`)
      .get()
      .then((doc) => {
        if (
          doc.exists &&
          doc.data().userHandle !== snapshot.data().userHandle
        ) {
          return db.doc(`/notifications/${snapshot.id}`).set({
            createdAt: new Date().toISOString(),
            recipient: doc.data().userHandle,
            sender: snapshot.data().userHandle,
            type: 'comment',
            read: false,
            screamId: doc.id,
          });
        } else {
          return true;
        }
      })
      .catch((err) => {
        console.error(err);
      });
  });

exports.onUserImageChange = functions.firestore
  .document('/users/{userId}')
  .onUpdate((change) => {
    console.log(change.before.data());
    console.log(change.after.data());
    if (change.before.data().imageUrl !== change.after.data().imageUrl) {
      console.log('image has changed');
      const batch = db.batch();
      return db
        .collection('screams')
        .where('userHandle', '==', change.before.data().handle)
        .get()
        .then((data) => {
          data.forEach((doc) => {
            const scream = db.doc(`/screams/${doc.id}`);
            batch.update(scream, { userImage: change.after.data().imageUrl });
          });
          return batch.commit();
        });
    } else return false;
  });

exports.onScreamDelete = functions.firestore
  .document('/screams/{screamId}')
  .onDelete((snapshot, context) => {
    const screamId = context.params.screamId;
    const batch = db.batch();
    return db
      .collection('comments')
      .where('screamId', '==', screamId)
      .get()
      .then((data) => {
        data.forEach((doc) => {
          batch.delete(db.doc(`/comments/${doc.id}`));
        });
        return db.collection('likes').where('screamId', '==', screamId).get();
      })
      .then((data) => {
        data.forEach((doc) => {
          batch.delete(db.doc(`/likes/${doc.id}`));
        });
        return db
          .collection('notifications')
          .where('screamId', '==', screamId)
          .get();
      })
      .then((data) => {
        data.forEach((doc) => {
          batch.delete(db.doc(`/notifications/${doc.id}`));
        });
        return batch.commit();
      })
      .catch((err) => {
        console.error(err);
      });
  });
