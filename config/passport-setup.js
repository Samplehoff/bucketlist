const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const keys = require('./keys')
const models = require('../models');


passport.serializeUser((user,done)=> {
    done(null, user.id);
});

passport.deserializeUser((id, done)=>{
    models.user.findOne({where: {id: id}}).then((user) => {
        done(null, user)
    })
});

passport.use(
    new GoogleStrategy({
      callbackURL:'/auth/google/redirect',
      clientID: keys.google.clientID,
      clientSecret: keys.google.clientSecret
    }, (accessToken, refreshToken, profile, done) => {
      //CHECK IF USER ALREADY EXISTS IN DB
    models.user.findOne({ where : {password: profile.id}}).then((currentUser) => {
        if(currentUser){
            
            console.log('user is ' + currentUser);
            // done(null, currentUser);
            done(null, currentUser);
        } else{
            console.log(currentUser);
            models.user.create({
                userName: profile.displayName,
                password: profile.id
            }).then((newUser)=>{
                
                console.log(newUser)
                done(null, newUser);
            });
            // done(null, newUser);
        }
    });
    })
  )