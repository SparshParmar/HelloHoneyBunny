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
        });
      });
      return res.json(screams);
    })
    .catch((err) => console.error('Error in getScreams _ : ' + err));
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
