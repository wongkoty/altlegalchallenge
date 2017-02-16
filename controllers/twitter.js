var express = require('express');
var router = express.Router();
var passportTwitter = require('../auth/twitter');
var request = require('request');

// models
var User = require('../models/user')
var Hashtag = require('../models/hashtag')



router.get('/', function(req, res){
  res.render('twitter/index');
})

router.get('/signup', function(req, res){
  res.render('twitter/signup')
})

router.get('/login', function(req, res){
  res.render('twitter/login');
})

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/')
})

router.get('/auth/twitter', passportTwitter.authenticate('twitter'));

router.get('/auth/twitter/callback',
  passportTwitter.authenticate('twitter', { failureRedirect: '/login'}),
  function(req, res){
    console.log(req.user);
    res.redirect(`/${req.user.id}`);
  }
)

router.get('/:id', function(req, res){
  console.log(req.params.id);
  console.log(req.session)
  res.render('twitter/show', {user: req.user,
                              errors: req.session.errors})
})

router.post('/:id/hashtag', function(req, res){
  console.log(req.body);
  hashtag = new Hashtag(req.body);
  // hashtag.save();
  User.findById(req.params.id, function(err, user){
    console.log(user);
    user.hashtags.push(hashtag);
    user.save(function(err){
      if(err){
        // console.log('here is the error in post route', err)
        // console.log(err.error)
        req.session.errors = "Only 3 lists allowed!"
        // console.log(typeof err);
        req.session.save()
      } else {
        console.log('success')
      }
    });
  })
  res.redirect(`/${req.user.id}`);
})

router.delete('/:id/hashtag/:hashtagid', function(req, res) {
  console.log('delete');
  console.log(req.params.hashtagid);
  User.findById(req.params.id, function(err, user){
    console.log(user);
    user.hashtags.id(req.params.hashtagid).remove();
    user.save(function(err){
      if(err){
        console.log(err);
      } else {
        console.log('success')
      }
    });
    console.log(user);
    req.session.errors = "";
    req.session.save();
  })
  res.redirect(`/${req.user.id}`);
})



module.exports = router;
