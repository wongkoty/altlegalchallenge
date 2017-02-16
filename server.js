var express = require('express');
var app = express();
var logger = require('morgan');
var hbs = require('hbs');
var session = require('express-session')
var bodyParser = require('body-parser');
var passport = require('passport');
var methodOverride = require('method-override')
var port = process.env.PORT || 3000
var mongoose = require('mongoose')

// Controllers
var twitterController = require('./controllers/twitter.js');

// db
var mongoURI = process.env.MONGODB_URI || 'mongodb://localhost/altlegal'
mongoose.connect(mongoURI)

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method
    delete req.body._method
    return method
  }
}))
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static('public'))
app.set('view engine', 'hbs');
app.use(logger('dev'));


app.use('/', twitterController)

app.listen(port, function() {
  console.log(`we are on port ${port}`)
})
