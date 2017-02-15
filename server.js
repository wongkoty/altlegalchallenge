var express = require('express');
var app = express();
var logger = require('morgan');
var hbs = require('hbs');
var bodyParser = require('body-parser');
var passport = require('passport');
var port = process.env.PORT || 3000
var mongoose = require('mongoose')

// Controllers
var twitterController = require('./controllers/twitter.js');

// db
var mongoURI = process.env.MONGODB_URI || 'mongodb://localhost/altlegal'
mongoose.connect(mongoURI)

app.use(express.static('public'))
app.set('view engine', 'hbs');
app.use(logger('dev'));


app.use('/', twitterController)

app.listen(port, function() {
  console.log(`we are on port ${port}`)
})
