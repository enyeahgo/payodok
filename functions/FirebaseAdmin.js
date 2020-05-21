const firebaseAdmin = require('firebase-admin');

const config = {
    // Insert Credentials here
}

firebaseAdmin.initializeApp(config);

module.exports = firebaseAdmin;