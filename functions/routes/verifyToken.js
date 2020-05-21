const firebaseAdmin = require('../FirebaseAdmin')

module.exports = function verifyToken(req, res, next) {

    if(req.cookies['__session']){

        if(req.cookies['__session'].token){
            firebaseAdmin.auth().verifyIdToken(req.cookies['__session'].token)
                    .then(function(decodedToken) {
                        res.verified = true;
                        res.user = decodedToken;
                        // console.log(decodedToken);
                        next()
                    }).catch(function(error) {
                        res.error = error.message;
                        res.verified = false;
                        next()
                    });
        } else {
            res.verified = false;
            next()
        }
    } else {
        if(req.url == '/'){
            res.verified = false;
            next()
        } else {
            res.error = 'You need to login to continue.';
            res.verified = false;
            next()
        }
    }
}
