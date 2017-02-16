var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.Promise = global.Promise;

var HashtagSchema = new Schema({
  name: String,
  created_at: {
    type: Date,
    default: Date.now
  } 
})

module.exports = mongoose.model('hashtags', HashtagSchema)
