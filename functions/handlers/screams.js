const { db } = require('../utils/admin');
const FBauth = require('../utils/FBauth');

exports.getAllScreams = (req, res) => {
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
};
exports.getScream = (req, res) => {
  let screamData = {};
  db.doc(`/screams/${req.params.screamId}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: 'scream Not Found' });
      }
      screamData = doc.data();
      screamData.screamId = doc.id;
      return db
        .collection('comments')
        .orderBy('createdAt', 'desc')
        .where('screamId', '==', req.params.screamId)
        .get();
    })
    .then((data) => {
      screamData.comments = [];
      data.forEach((doc) => {
        console.log('1');

        screamData.comments.push(doc.data());
      });
      return res.json(screamData);
    })
    .catch((err) => {
      console.error(err), res.json({ error: err.code });
    });
};

exports.commentOnScream = (req, res) => {
  let commentToBePosted = {};

  if (req.body.body.trim() === '')
    return res.status(400).json({
      error: 'comment must not be empty',
    });

  commentToBePosted.body = req.body.body;
  commentToBePosted.createdAt = new Date().toISOString();
  commentToBePosted.screamId = req.params.screamId;
  commentToBePosted.userHandle = req.user.handle;
  commentToBePosted.userImage = req.user.imageUrl;

  db.doc(`/screams/${req.params.screamId}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: 'scream not Found' });
      }
      return db.collection('comments').add(commentToBePosted);
    })
    .then(() => {
      res.json(commentToBePosted);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};
exports.postOneScream = (req, res) => {
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
};
