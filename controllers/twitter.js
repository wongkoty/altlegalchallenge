var express = require('express');
var app = express();
var router = express.Router();
var passportTwitter = require('../auth/twitter');
var request = require('request');
var async = require('async');
var config = require('../_config');
var Twitter = require('twitter');
var TwitterHelper = require('../helpers/twitter')

var client = new Twitter({
  consumer_key: config.twitter.consumerKey,
  consumer_secret: config.twitter.consumerSecret,
  access_token_key: config.twitter.accessToken,
  access_token_secret: config.twitter.accessTokenSecret,
})

router.use(function(req, res, next){
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
})
// helper functions
var TwitterHelper = require('../helpers/twitter')

// models
var User = require('../models/user')
var Hashtag = require('../models/hashtag')

router.get('/test', function(req, res){
  res.send('test')
  res.redirect('/auth/twitter');
})

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

router.get('/twitter', function(req, res){
  TwitterHelper.getTweets();
})

router.get('/auth/twitter1', function(req, res){
  console.log('twitter1');
  TwitterHelper.getTweets.test();

})

router.get('/auth/twitter', passportTwitter.authenticate('twitter'))

router.get('/auth/twitter/callback',
  passportTwitter.authenticate('twitter', { failureRedirect: '/login'}),
  function(req, res){
    console.log('twitter callback')
    console.log(req.user);
    res.send('hello')
    // res.redirect(`/${req.user.id}`);
  }
)

router.get('/:id', function(req, res){
  console.log(req.params.id);
  console.log(req.session)
  
  // console.log(TwitterHelper.getTweets(req.user.hashtags));

    var testArr = [];

    async.each(req.user.hashtags, function(item, callback) {
      // console.log(item);
      var params = {q: '#' + item.name,
                    count: '5',
                    result_type: 'popular'}
        client.get('search/tweets', params, function(err, tweets, response) {
          if (err) {
            callback(err)
          } else {
            var obj = {
              name: item.name,
              tweets: tweets,
            }
            testArr.push(obj);
            // console.log(testArr);
            callback();
          }
        })
      }, function(err) {
       if (err) {
        return 500; //Example
       } else {
        // console.log('at the end');
        // console.log('===========')
        // console.log(testArr[0])
        return testArr;
       }
  });
  // console.log('tweets are', TwitterHelper.getTweets(req.user.hashtags));
  setTimeout(function(){ //This is not the most elegant solution without using a front-end framework or sockets.
    // console.log(testArr[0].tweets.statuses);
    res.render('twitter/show', {user: req.user,
                                errors: req.session.errors,
                                tweets: testArr
                                })
  }, 800)


  // setTimeout(function(){
  //   console.log(tweets);
  // }, 5500);
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
