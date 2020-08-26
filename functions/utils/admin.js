const admin = require('firebase-admin');

var serviceAccount = require('../serviceAccKey/serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://hellohoneybunny-1fb9e.firebaseio.com',
});

const db = admin.firestore();
db.settings({ ignoreUndefinedProperties: true });

module.exports = { admin, db };
