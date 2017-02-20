var express = require('express');
var router = express.Router();
// var passportTwitter = require('../auth/twitter');
var request = require('request');
var async = require('async');
var config = require('../_config');
var Twitter = require('twitter');
var request = require('request');
var qs = require('querystring')
var rcookie = require('react-cookie')
// var io = require('socket.io')();


var client = new Twitter({
    consumer_key: config.twitter.consumerKey,
    consumer_secret: config.twitter.consumerSecret,
    access_token_key: config.twitter.accessToken, 
    access_token_secret: config.twitter.accessTokenSecret, 
})

// models
var User = require('../models/user')
var Hashtag = require('../models/hashtag')

router.get('/sockets', function(req, res){
  console.log('in sockets')
  console.log(res.io)
  // console.log(res.io)
  res.io.emit('hello', {poo: 'pee'})

})

router.get('/', function(req, res){
  res.render('twitter/index');
})

router.get('/loggedinuser', function(req, res){
  console.log('test')
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  console.log(req.session);
  res.send({
    user: 'koty',
    hashtags: ['bananas', 'beer']
  })
  // res.send(req.session.current_user)
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

router.get('/auth/twitter', function(req, res){
  console.log('auth twitter route')
  var oauth = {
    callback: 'http://127.0.0.1:3001/auth/twitter/callback',
    consumer_key: config.twitter.consumerKey,
    consumer_secret: config.twitter.consumerSecret,
  }
  var url = 'https://api.twitter.com/oauth/request_token'
  request.post({url: url, oauth: oauth}, function(err, response, body){
    if (!err && response.statusCode == 200) {
      console.log(body)
      var req_data = qs.parse(body)
      var uri = 'https://api.twitter.com/oauth/authenticate' + '?' + qs.stringify({oauth_token: req_data.oauth_token})
      // res.redirect(uri)

      // res.send(uri)
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
      res.send(uri)
    } else {
      console.log(err)
    }
  })

})

// route when it was only server side rendering
// router.get('/auth/twitter', passportTwitter.authenticate('twitter'));

router.post('/auth/twitter_token', function(req, res){
  console.log('in twitter token');
  console.log(req.body)
  var query = decodeURI(req.body);
  console.log(query);
  request.get(req.body.data, function(err, response, body){
    // console.log(body)
  })
})

router.get('/auth/twitter/callback', function(req, res){
  console.log('in auth callback')
  console.log(req.user);
  console.log(req.body);
  // console.log(req);
  console.log(req.query.oauth_verifier)

  // var auth_data = qs.parse(req)
  // console.log(auth_data)
  var oauth =
    { consumer_key: config.twitter.consumerKey,
      consumer_secret: config.twitter.consumerSecret,
      token: req.query.oauth_token, 
      // token_secret: req.query.oauth_verifier, 
      verifier: req.query.oauth_verifier
    }
  var url = 'https://api.twitter.com/oauth/access_token';

  request.post({url:url, oauth:oauth}, function (err, response, body) {
    // console.log('data')
    // console.log(body)
  // ready to make signed requests on behalf of the user 
    if (!err && response.statusCode == 200) {
      var perm_data = qs.parse(body)
      // console.log(typeof body)
      console.log(perm_data)
      // console.log(`perm_data is ${perm_data}`)

      
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
        console.log('user twitter')
        // console.log(user);
        if(err) {
          console.log('error' + err);
        } else {
          // console.log(user)
          // return done(null, user);
          req.session.oauth_token = perm_data.oauth_token;
          req.session.oauth_token_secret = perm_data.oauth_token_secret;
          req.session.current_user = user.name
          req.session.save(function(err){
            console.log(err)
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
            console.log('this is the session', req.session);
            res.redirect('/')
            // res.end();
          });
        }
      });
      // req.session.current_user = user;


    }
  })

})

router.post('/gettweets', function(req, res){
  console.log('getting tweets');
  // client.get('favorites/list', function(error, tweets, response) {
  //   if(error) throw error;
  //   console.log(tweets);  // The favorites. 
  //   console.log(response);  // Raw response object. 
  // });

  var testArr = [];
    async.each(req.body.data, function(item, callback) {
    console.log(item);
    var params = {
      q: '#' + item,
      count: '5',
      result_type: 'popular'
    }
      client.get('search/tweets', params, function(err, tweets, response) {
        if (err) {
          callback(err)
        } else {
          var obj = {
            name: item,
            tweets: tweets,
          }
          console.log(obj)
          console.log(obj.tweets.statuses)
          testArr.push(obj);
          console.log(testArr);
          callback();
        }
      })
    }, function(err) {
      if (err) {
        return 500; //Example
      } else {
        res.io.emit('hello', {data: testArr})
        return testArr;
      }
    })

























//   // console.log(res.io)
//   console.log(req.body)
//   var hashtags = req.body.data.toString();
//   var params = {
//     track: '#' + hashtags
//   };

//   // var stream = client.stream('statuses/filter', {track: 'javascript'});
//   client.stream('statuses/filter', params, function(stream) {
//   stream.on('data', function(event) {
//     // console.log(event);
//     console.log('sending event')
//     // console.log(event.entities)
//     event.entities.hashtags.forEach(function(hashtag){
//       // console.log('req.body is', req.body.data)
//       console.log('this is hashtag', hashtag)
//       req.body.data.forEach(function(hashtag_user){
//         console.log('this is hashtag_user', hashtag_user)
//         if(hashtag.text == hashtag_user){
//           console.log(hashtag_user);
//           res.io.emit('hello', {data: hashtag_user});
//         }
//       })
//     })
//     // res.send(event && event.text)
//     // res.send(event)
//     // io.on('event', function(){
//     //   io.emit('hello', {meow: 'meow'});
//     // })

//     // io.emit('emitting message')
//   });
 
//   stream.on('error', function(error) {
//     console.log('error with poling')
//     console.log(error)
//   });
// });
//   // res.send('got it')

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








// router.get('/:id', function(req, res){
//   console.log(req.params.id);
//   console.log(req.session)
  
//   // console.log(TwitterHelper.getTweets(req.user.hashtags));

//     var testArr = [];

//     async.each(req.user.hashtags, function(item, callback) {
//       // console.log(item);
//       var params = {q: '#' + item.name,
//                     count: '5',
//                     result_type: 'popular'}
//         client.get('search/tweets', params, function(err, tweets, response) {
//           if (err) {
//             callback(err)
//           } else {
//             var obj = {
//               name: item.name,
//               tweets: tweets,
//             }
//             testArr.push(obj);
//             // console.log(testArr);
//             callback();
//           }
//         })
//       }, function(err) {
//        if (err) {
//         return 500; //Example
//        } else {
//         // console.log('at the end');
//         // console.log('===========')
//         // console.log(testArr[0])
//         return testArr;
//        }
//   });
//   // console.log('tweets are', TwitterHelper.getTweets(req.user.hashtags));
//   setTimeout(function(){ //This is not the most elegant solution without using a front-end framework or sockets.
//     // console.log(testArr[0].tweets.statuses);
//     res.render('twitter/show', {user: req.user,
//                                 errors: req.session.errors,
//                                 tweets: testArr
//                                 })
//   }, 800)


//   // setTimeout(function(){
//   //   console.log(tweets);
//   // }, 5500);
// })
