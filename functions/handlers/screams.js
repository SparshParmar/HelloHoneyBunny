const { db } = require('../utils/admin');

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
          commentCount: doc.data().commentCount,
          likeCount: doc.data().likeCount,
          userImage: doc.data().userImage,
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
      comment: 'comment must not be empty',
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
      return doc.ref.update({ commentCount: doc.data().commentCount + 1 });
    })
    .then(() => {
      return db.collection('comments').add(commentToBePosted);
    })
    .then(() => {
      return res.json(commentToBePosted);
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

exports.deleteComment = (req, res) => {};
exports.postOneScream = (req, res) => {
  {
    const newScream = {
      body: req.body.body,
      userHandle: req.user.handle,
      createdAt: new Date().toISOString(),
      userImage: req.user.imageUrl,
      likeCount: 0,
      commentCount: 0,
    };

    // console.log(newScream);

    db.collection('screams')
      .add(newScream)
      .then((doc) => {
        const resScream = newScream;
        resScream.screamId = doc.id;
        return res.json({
          resScream,
        });
      })
      .catch((err) => {
        return res.status(500).json({
          error: 'something really went wrong while creating the new scream',
          err: err,
          scream: newScream,
        });
        // console.error(err);
      });
  }
};

exports.likeScream = (req, res) => {
  const likeDocument = db
    .collection('likes')
    .where('userHandle', '==', req.user.handle)
    .where('screamId', '==', req.params.screamId)
    .limit(1);

  const screamDocument = db.doc(`/screams/${req.params.screamId}`);
  let screamData = {};
  screamDocument
    .get()
    .then((doc) => {
      if (doc.exists) {
        screamData = doc.data();
        return likeDocument.get();
      } else {
        return res.status(404).json({
          error: 'the scream does non exists',
        });
      }
    })
    .then((data) => {
      if (data.empty) {
        return db
          .collection('likes')
          .add({
            screamId: req.params.screamId,
            userHandle: req.user.handle,
          })
          .then(() => {
            screamData.likeCount++;
            return screamDocument.update({ likeCount: screamData.likeCount });
          })
          .then(() => {
            return res.json(screamData);
          });
      } else {
        return res.status(400).json({
          error: 'scream already liked',
        });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

exports.unlikeScream = (req, res) => {
  const likeDocument = db
    .collection('likes')
    .where('userHandle', '==', req.user.handle)
    .where('screamId', '==', req.params.screamId)
    .limit(1);

  const screamDocument = db.doc(`/screams/${req.params.screamId}`);
  let screamData = {};
  screamDocument
    .get()
    .then((doc) => {
      if (doc.exists) {
        screamData = doc.data();
        return likeDocument.get();
      } else {
        return res.status(404).json({
          error: 'the scream does non exists',
        });
      }
    })
    .then((data) => {
      if (data.empty) {
        return res.status(400).json({
          error: 'scream not liked',
        });
      } else {
        return db
          .doc(`/likes/${data.docs[0].id}`)
          .delete()
          .then(() => {
            screamData.likeCount--;
            return screamDocument.update({ likeCount: screamData.likeCount });
          })
          .then(() => {
            return res.json(screamData);
          });
      }
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

exports.deleteScream = (req, res) => {
  const document = db.doc(`/screams/${req.params.screamId}`);
  document
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: 'scream not found' });
      }
      if (doc.data().userHandle !== req.user.handle) {
        return res.status(403).json({ error: 'unauthorised' });
      } else {
        return document.delete();
      }
    })
    .then(() => {
      return res.json({
        message: 'Scream deleted successfully',
      });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({
        error: err.code,
      });
    });
};
