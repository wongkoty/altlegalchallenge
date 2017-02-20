var express = require('express');
var app = express();
var logger = require('morgan');
var hbs = require('hbs');
var session = require('express-session')
var bodyParser = require('body-parser');
var methodOverride = require('method-override')
var port = process.env.PORT || 3001
var mongoose = require('mongoose')
var cookieParser = require('cookie-parser');


// db
var mongoURI = process.env.MONGODB_URI || 'mongodb://localhost/altlegal'
mongoose.connect(mongoURI)
var db = mongoose.connection;

const server = app.listen(port, function() {
  console.log(`we are on port ${port}`)
})

const io = require('socket.io')(server);

// Controllers
var twitterController = require('./controllers/twitter.js');

app.use(express.static('client/build'));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    var method = req.body._method
    delete req.body._method
    return method
  }
}))
app.use(cookieParser());
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
  maxAge: 20000,
  secure: false,
}));


app.use(express.static('public'))
app.use(logger('dev'));


app.use('/', function(req, res, next){
  res.io = io
  next()
}, twitterController)
