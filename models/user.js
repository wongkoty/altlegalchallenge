var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Hashtag = require('./hashtag')
// console.log(Hashtag.schema)

mongoose.Promise = global.Promise;

var UserSchema = new Schema({
  name: String,
  twitterID: String,
  created_at: {
    type: Date,
    default: Date.now
  },
  hashtags: [Hashtag.schema] 
})

UserSchema.pre('save', function(next) {
  if (this.hashtags.length > 3) {
    next(new Error('Already have 3 lists'));
  } else {
    next();
  }
})

module.exports = mongoose.model('users', UserSchema)
