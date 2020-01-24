const express = require("express");
const app = express();
const models = require('./models');
const bodyParser = require("body-parser");
const session = require("express-session");
require('dotenv').config();
const axios = require("axios");


const mustacheExpress = require('mustache-express');
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', __dirname + '/public');



app.get('/all', function(req, res){
  
  models.stadiums.findAll({
    

  }).then(stadiums => { 
     res.render('all.mustache', {stadiums})
  })
})

app.get('/', function(req,res){
  res.render('bucketlist.mustache')
})

app.get('/mybucketlist', function(req, res){
  res.render('mybucketlist.mustache')
})

app.get('/nfl', function(req, res){
  
  models.stadiums.findAll({
    where: {
      type: "Professional",
      sports: "football"
    }

  }).then(stadiums => { 
     res.render('nfl.mustache', {stadiums})
  })
})

app.get('/college', function(req, res){
  models.stadiums.findAll({
    where: {
      type: "College"
    }
  }).then(stadiums => {
    res.render('college.mustache', {stadiums})
  })
})

app.get('/mlb', function (req, res) {
  models.stadiums.findAll({
    where: {
      type: "Professional",
      sports: "baseball"
    }
  }).then(stadiums => {
    res.render('mlb.mustache', {stadiums})
  })
})

app.get('/nba', function(req, res){
  models.stadiums.findAll({
    where: {
      type: "Professional",
      sports: "basketball"
    }
  }).then(stadiums =>{
    res.render('nba.mustache', {stadiums})
  })
})

app.get('/nhl', function(req, res){
  models.stadiums.findAll({
    where: {
      type: "Professional",
      sports: "hockey"
    }
  }).then(stadiums =>{
    res.render('nhl.mustache', {stadiums})
  })
})



var pbkdf2 = require('pbkdf2');
var salt = process.env.SALT_KEY;

function encryptionPassword(password){
  var key = pbkdf2.pbkdf2Sync(
    password, salt, 36000, 256, 'sha256'
  );
  var hash = key.toString('hex');
  return hash;
}
app.use(session({secret: "dogs", resave: false, saveUninitialized: true}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(__dirname + '/public'));



/*  PASSPORT SETUP  */

// const passport = require('passport');
// app.use(passport.initialize());
// app.use(passport.session());

// app.get('/success', function(req, res){ 
//   if (req.isAuthenticated()) {
//     res.send("Welcome " + req.query.username + "!!")
//   } else {
//     res.send("not authorized.");
//   }
//   });

//    app.get('/create_artist', function(req, res){ 
//      if (req.isAuthenticated()) {
//        res.redirect('create_artist');
//      } else {
//        res.send("not authorized.");
//      }
//      });
//   app.get('/create_artist', function(req, res){ 
//     if (req.isAuthenticated()) {
//       res.redirect('create_artist');
//     } else {
//       res.send("not authorized.");
//     }
//     });


// app.get('/logout', function(req, res){
//   if(req.isAuthenticated()) {
//     console.log("user logged out");
//     req.logOut();
//     res.send("user logged out");
//   } else {
//     res.send("You don't have a session open")
//   }
// });

// app.get('/error', (req, res) => res.send("error logging in"));

// passport.serializeUser(function (user, cb) {
//   cb(null, user.id);
// });

// passport.deserializeUser(function (id, cb) {
//   models.user.findOne({ where: { id: id } }).then(function (user) {
//     cb(null, user);
//   });
// });

// /* PASSPORT LOCAL AUTHENTICATION */

// const LocalStrategy = require('passport-local').Strategy;

// passport.use(new LocalStrategy(
//   function (username, password, done) {
//     models.user.findOne({
//       where: {
//         username: username
//       }
//     }).then(function (user) {
//       if (!user) {
//         return done(null, false);
//       }

//       if (user.password != encryptionPassword(password)) {
//         return done(null, false);
//       }
//       return done(null, user);
//     }).catch(function (err) {
//       return done(err);
//     });
//   }
// ));

// app.post('/',
//   passport.authenticate('local', { failureRedirect: '/error' }),
//   function(req, res) {
//     res.redirect('/success');

//   });



app.post("/sign-up", function (req, response) {
   models.user.create({ userName: req.body.userName, password: encryptionPassword(req.body.password)})
    .then(function (user) {
      response.redirect('/');
      
    });
});



app.post("/mybucketlist", function (req, res){
  models.bucketlist.create({
    
  })
    .then(function (bucketlist) {
      res.redirect('mybucketlist.mustache')
    })
})


// app update
app.listen(process.env.PORT, function () {
  console.log('server listening on port ' + process.env.PORT + ' app name= ' + process.env.PROJECT_NAME);
})
