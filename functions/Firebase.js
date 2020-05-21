const firebase = require('firebase');
require('firebase/auth');

const config = {
    // Insert Credentials here 
}

firebase.initializeApp(config);

module.exports = firebase;