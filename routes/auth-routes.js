const router = require('express').Router();
const passport = require('passport');


//auth login
router.get('/login', (req, res)=>{
    res.render('mybucketlist.mustache');
});

//auth logout
router.get('/logout', (req, res)=>{
    //handle with passport
    res.send('logging out');
})

//auth with google
router.get('/google', passport.authenticate('google',{
    scope: ['profile']
}));

//callback route for google to redirect to
router.get('/google/redirect', passport.authenticate('google'), (req, res)=>{
    // res.send(req.user)
    console.log("recieved after redirect")
    res.redirect('mybucketlist.mustache')
});
//change to a profile page

module.exports = router;