var express = require('express');
var router = express.Router();
const firebase = require('../Firebase');
const verifyToken = require('./verifyToken');
const getUserData = require('./getUserData');
const getUserDataFromCookie = require('./getUserDataFromCookie');

router.get('/', getUserDataFromCookie, function(req, res, next) {
  if(res.isLoggedIn){
    res.render('index', {
      title: 'Payodok',
      fullname: res.userdata.fullname,
      email: res.userdata.email,
      mobile: res.userdata.mobile,
      uid: res.userdata.uid,
      hasPhoto: false,
      isLoggedIn: true,
      hasMessage: true,
      messageCount: 5,
      hasNotif: true,
      notifCount: 9
    });
  } else {
    res.render('index', {
      title: 'Payodok',
      isLoggedIn: false
    });
  }
});

router.get('/login', function(req, res, next) {
  res.render('login', {
    error: req.cookies['__session'] ? req.cookies['__session'].error : ''
  })
})

router.post('/login', function(req, res, next) {
  var email = req.body.email;
  var password = req.body.password;
  var sessionData = req.cookies['__session'] ? req.cookies['__session'] : {};

  firebase.auth().signInWithEmailAndPassword(email, password)
          .catch(function(error) {
            sessionData.error = error.message;
            res.cookie('__session', sessionData, { httpOnly: true, sameSite: "none" });
            res.redirect('/login');
          });
  firebase.auth().onAuthStateChanged(function(user) {
    if(user){
      res.uid = user.uid;
      next()
    }
  })
}, getUserData)

router.get('/registerpx', function(req, res, next) {
  res.render('registerpx', {
    title: 'Create Account',
    error: req.cookies['__session'] ? req.cookies['__session'].error : ''
  })
})

router.get('/registerdr', function(req, res, next) {
  res.render('registerdr', {
    title: 'Become our partner',
    error: req.cookies['__session'] ? req.cookies['__session'].error : ''
  })
})

router.post('/registerpx', function(req, res, next) {
  var fullname = req.body.fullname;
  var email = req.body.email;
  var mobile = req.body.mobile;
  var password = req.body.password;
  var rpass = req.body.rpass;
  var bday = req.body.bday;
  var gender = req.body.gender;
  var sessionData = req.cookies['__session'] ? req.cookies['__session'] : {};

  if(password !== rpass){
    sessionData.error = 'Password Mismatch!';
    res.cookie('__session', sessionData, { httpOnly: true, sameSite: "none" });
    res.redirect('/registerpx');
  } else {
    firebase.auth().createUserWithEmailAndPassword(email, password)
            .catch(function(error) {
              sessionData.error = error.message;
              res.cookie('__session', sessionData, { httpOnly: true, sameSite: "none" });
              res.redirect('/registerpx');
            })
  }
  firebase.auth().onAuthStateChanged(function(user) {
    if(user){

      const usersDb = firebase.database().ref('Users');
      usersDb.child(user.uid).set({
        fullname: fullname,
        email: email,
        mobile: mobile,
        bday: bday,
        gender: gender,
        hasPhoto: false,
        isDoctor: false,
        uid: user.uid
      })
      
      res.uid = user.uid;
      next()
    }
  })
}, getUserData)

router.post('/registerdr', function(req, res, next) {
  var fullname = req.body.fullname;
  var specialty = req.body.specialty;
  var subspecialty = req.body.subspecialty;
  var prcid = req.body.prcid;
  var email = req.body.email;
  var mobile = req.body.mobile;
  var password = req.body.password;
  var rpass = req.body.rpass;
  var sessionData = req.cookies['__session'] ? req.cookies['__session'] : {};

  if(password !== rpass){
    sessionData.error = 'Password Mismatch!';
    res.cookie('__session', sessionData, { httpOnly: true, sameSite: "none" });
    res.redirect('/registerdr');
  } else {
    firebase.auth().createUserWithEmailAndPassword(email, password)
            .catch(function(error) {
              sessionData.error = error.message;
              res.cookie('__session', sessionData, { httpOnly: true, sameSite: "none" });
              res.redirect('/registerdr');
            })
  }
  firebase.auth().onAuthStateChanged(function(user) {
    if(user){

      const doctorsDb = firebase.database().ref('Doctors');
      doctorsDb.child(user.uid).set({
        fullname: fullname,
        specialty: specialty,
        subspecialty: subspecialty,
        prcid: prcid,
        email: email,
        mobile: mobile,
        hasPhoto: false,
        uid: user.uid
      })

      const usersDb = firebase.database().ref('Users');
      usersDb.child(user.uid).set({
        fullname: fullname,
        specialty: specialty,
        subspecialty: subspecialty,
        prcid: prcid,
        email: email,
        mobile: mobile,
        isDoctor: true,
        hasPhoto: false,
        uid: user.uid
      })

      res.uid = user.uid;
      next()
    }
  })
}, getUserData)

router.get('/logout', function(req, res, next) {
  firebase.auth().signOut();
  res.clearCookie('__session');
  res.redirect('/');
})

router.get('/forgotpassword', function(req, res, next) {
  res.render('forgotpassword', {
    error: req.cookies['__session'] ? req.cookies['__session'].error : '',
    success: req.cookies['__session'] ? req.cookies['__session'].success : ''
  })
})

router.post('/forgotpassword', function(req, res, next) {
  var email = req.body.email;
  var sessionData = req.cookies['__session'] ? req.cookies['__session'] : {};

  firebase.auth().sendPasswordResetEmail(email).then(function() {
    sessionData.error = '';
    sessionData.success = 'Password Reset Email Sent!';
    res.cookie('__session', sessionData, { httpOnly: true, sameSite: "none" });
    res.redirect('/forgotpassword');
  }).catch(function(error) {
    sessionData.error = error.message;
    res.cookie('__session', sessionData, { httpOnly: true, sameSite: "none" });
    res.redirect('/forgotpassword');
  });
})

router.get('/profile', verifyToken, getUserData, function(req, res, next) {
  if(res.verified){
    res.render('profile', {
      title: 'Profile',
      fullname: res.userdata.fullname,
      email: res.userdata.email,
      mobile: res.userdata.mobile,
      uid: res.userdata.uid,
      isLoggedIn: true
    })
  } else {
    res.redirect('/login')
  }
})

router.get('/app', function(req, res, next) {
  res.render('app', {
    title: "Vimogy App"
  })
})

router.get('/search', function(req, res, next) {
  res.render('search', {
    title: "Payodok"
  })
})

router.get('/ourdoctors', function(req, res, next) {
  res.render('doctors', {
    title: "Vimogy App"
  })
})

router.get('/template', function(req, res, next) {
  res.render('template', {
    title: 'Payodok',
    fullname: 'Inigo Orosco',
    email: 'enyeahgo@gmail.com',
    mobile: '09159476988',
    uid: 'uidofmrinigoorosco',
    hasPhoto: false,
    isLoggedIn: false,
    hasMessage: true,
    messageCount: 5,
    hasNotif: true,
    notifCount: 9
  })
})

module.exports = router;