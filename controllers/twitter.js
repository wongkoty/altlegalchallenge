var express = require('express');
var router = express.Router();
var request = require('request');
var async = require('async');
var config = require('../_config');
var Twitter = require('twitter');
var request = require('request');
var qs = require('querystring')

var client = new Twitter({
    consumer_key: config.twitter.consumerKey,
    consumer_secret: config.twitter.consumerSecret,
    access_token_key: config.twitter.accessToken, 
    access_token_secret: config.twitter.accessTokenSecret, 
})

// models
var User = require('../models/user')
var Hashtag = require('../models/hashtag')

router.get('/loggedinuser', function(req, res){
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  if(req.session.current_user){
    User.findById(req.session.current_user._id, function(err, user){
      var hashtags = user.hashtags.map(function(hashtag){
        return hashtag.name
      })
      res.send({
        user: user.name,
        hashtags: hashtags
      })
    })

  }
})


router.get('/auth/twitter', function(req, res){
  var oauth = {
    callback: 'http://127.0.0.1:3001/auth/twitter/callback',
    consumer_key: config.twitter.consumerKey,
    consumer_secret: config.twitter.consumerSecret,
  }
  var url = 'https://api.twitter.com/oauth/request_token'
  request.post({url: url, oauth: oauth}, function(err, response, body){
    if (!err && response.statusCode == 200) {
      var req_data = qs.parse(body)
      var uri = 'https://api.twitter.com/oauth/authenticate' + '?' + qs.stringify({oauth_token: req_data.oauth_token})
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
      res.send(uri)
    } else {
      console.log(err)
    }
  })

})

router.post('/newwatch', function(req, res){
  hashtag = new Hashtag(req.body);
  User.findById(req.session.current_user._id, function(err, user){
    user.hashtags.push(hashtag);
    user.save(function(err){
      if(err){
        req.session.errors = "Only 3 lists allowed!"
        req.session.save()
        res.send('errors')
      } else {
        res.send('added list')
      }
    });
  })
})

router.post('/auth/twitter_token', function(req, res){
  var query = decodeURI(req.body);
  request.get(req.body.data, function(err, response, body){
  })
})

router.get('/auth/twitter/callback', function(req, res){
  var oauth =
    { consumer_key: config.twitter.consumerKey,
      consumer_secret: config.twitter.consumerSecret,
      token: req.query.oauth_token, 
      // token_secret: req.query.oauth_verifier, 
      verifier: req.query.oauth_verifier
    }
  var url = 'https://api.twitter.com/oauth/access_token';

  request.post({url:url, oauth:oauth}, function (err, response, body) {
    if (!err && response.statusCode == 200) {
      var perm_data = qs.parse(body)

      var searchQuery = {
        name: perm_data.screen_name
      };

      var updates = {
        name: perm_data.screen_name,
        twitterID: perm_data.user_id
      };

      var options = {
        upsert: true
      };
      User.findOneAndUpdate(searchQuery, updates, options, function(err, user) {
        if(err) {
          console.log('error' + err);
        } else {
          req.session.oauth_token = perm_data.oauth_token;
          req.session.oauth_token_secret = perm_data.oauth_token_secret;
          req.session.current_user = user
          req.session.save(function(err){
            console.log(err)
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

            res.redirect('/')
          });
        }
      });
    }
  })
})

router.post('/gettweets', function(req, res){
  var tweetsArr = req.body.data
  var responseArr = [];

  async.each(tweetsArr, function(item, callback) {
    var params = {
      q: '#' + JSON.stringify(item),
      count: '5',
    };
    client.get('search/tweets', params, function(err, tweets, response) {
      if (err) {
        console.log('error', err)
        callback(err)
      } else {
        var obj = {
          name: item,
          tweets: tweets,
        }
        responseArr.push(obj);
        callback();
      }
    })
  }, function(err) {
    if (err) {
      return 500; //Example
    } else {
      res.io.emit('hello', {data: responseArr})
      return responseArr;
    }
  })
})


router.delete('/hashtag', function(req, res){
  User.findById(req.session.current_user._id, function(err, user){
    user.hashtags.forEach(function(hashtag){
      if(hashtag.name == req.body.data){
        var index = user.hashtags.indexOf(hashtag);
        user.hashtags.splice(index, 1);
        user.save()
        res.send('finished')
      }
    })
  })
})

module.exports = router;



