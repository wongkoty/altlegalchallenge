var config = require('../_config');
var Twitter = require("twitter");
var async = require('async');
var passportTwitter = require('../auth/twitter');

// instantiate twitter client
var client = new Twitter({
  consumer_key: config.twitter.consumerKey,
  consumer_secret: config.twitter.consumerSecret,
  access_token_key: config.twitter.accessToken,
  access_token_secret: config.twitter.accessTokenSecret,
})

var test = function(){
  console.log('test')
  passportTwitter.authenticate('twitter');
}

var getTweets = function(hashtags) {

    var testArr = [];

    async.each(hashtags, function(item, callback) {
      // console.log(hashtag);
      var params = {q: item.name,
                    count: '5'}
      client.get('search/tweets', params, function(err, tweets, response) {
        if (err) {
          callback(err)
        } else {
          testArr.push(tweets);
          // console.log(testArr);
          callback();
        }
      })


    // APIObject.sendRequest(item, function(err, result)) {
    //   if (err)
    //     callback(err);
    //   else
    //   {
    //     merged.push(result);
    //     callback();
    //   }
    // }
  }, function(err) {
       if (err) {
        return 500; //Example
       } else {
        console.log('at the end');
        console.log('===========')
        console.log(testArr[0])
        return testArr[0];
       }
  });

  // hashtags.map(function(hashtag){
  //   // console.log('tweets from hashtags in helper are', tweetsFromHashtags)
  //   var params = {q: hashtag.name,
  //                 count: '5'}
  //   client.get('search/tweets', params)
  //     .then(function(tweet){
  //       // console.log(tweet)
  //       return tweet;
  //     })
  // })

 
}

exports.getTweets = {
  getTweets: getTweets,
  test: test,
};
