const express = require("express");
const app = express();
const models = require('./models');
const bodyParser = require("body-parser");
const session = require("express-session");
require('dotenv').config();
const axios = require("axios");
const keys = require('./config/keys')
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const authRoutes = require('./routes/auth-routes')
const profileRoutes = require('./routes/profile-routes')
const mustacheExpress = require('mustache-express');
const passportSetup = require('./config/passport-setup');
const cookieSession = require('cookie-session');
const cookieParser = require('cookie-parser')

var pbkdf2 = require('pbkdf2');
var salt = process.env.SALT_KEY;

function encryptionPassword(password){
  var key = pbkdf2.pbkdf2Sync(
    password, salt, 36000, 256, 'sha256'
  );
  var hash = key.toString('hex');
  return hash;
  }

/*  PASSPORT SETUP  */

app.engine('mustache', mustacheExpress());

app.use(cookieSession({
  maxAge: 24 * 60 * 60 * 1000,
  keys: [keys.session.cookieKey]
}));

app.use(cookieParser());

app.use(session({secret: "dogs", resave: false, saveUninitialized: true}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.set('view engine', 'mustache');
app.set('views', __dirname + '/public');

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(__dirname + 'public'));

app.listen(process.env.PORT, function () {
  console.log('server listening on port ' + process.env.PORT + ' app name= ' + process.env.PROJECT_NAME);
})

module.exports = app;


//SETUP ROUTES

app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);

app.get('/', function(req, res){
  res.render('index.mustache');
});

app.get('/bucketlist', function(req, res){
  res.render('bucketlist.mustache');
});


// /* PASSPORT LOCAL AUTHENTICATION */

const LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
  function (username, password, done) {
    models.user.findOne({
      where: {
        username: username
      }
    }).then(function (user) {
      if (!user) {
        console.log("No user")
        return done(null, false);
      }

      if (user.password != encryptionPassword(password)) {
        console.log("Incorrect Password")
        return done(null, false);
      }
      console.log("logged in")
      return done(null, user);
    }).catch(function (err) {
      return done(err);
    });
  }
));

app.post('/',
  passport.authenticate('local', { failureRedirect: '/error' }),
  function(req, res) {
    res.redirect('/login');
  });



app.post("/signup", function (req, response) {
  models.user.create({ username: req.body.username, password: encryptionPassword(req.body.password)})
    .then(function (user) {
      response.redirect('/login');
      
    });
});

//LOCAL PASSPORT

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/login', function(req, res) {
  res.render('profile')
});

app.get('/signup', function(req, res) {
  res.render('login')
});

// app.post("/signup", function (req, res){
//   console.log("creating user");
//   console.log(req.body);
//   models.user.create({username: userName, password: password});
// })


app.use(express.static(__dirname + '/public'));


