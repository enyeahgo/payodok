const firebase = require('../Firebase');

module.exports = function getUserData(req, res, next) {
    var sessionData = req.cookies['__session'] ? req.cookies['__session'] : {};
    firebase.database().ref('Users').child(res.uid).once('value')
            .then(function(dataSnapshot) {
                sessionData.error = '';
                sessionData.userdata = dataSnapshot.val();
                res.cookie('__session', sessionData, { httpOnly: true, sameSite: "none" });
                res.redirect('/')
            }).catch(function(error) {
                console.log(error.message)
                res.redirect('/login')
            })
}