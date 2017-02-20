var express = require('express');
var app = express();
var logger = require('morgan');
var hbs = require('hbs');
var hbsIntl = require('handlebars-intl');
var session = require('express-session')
var bodyParser = require('body-parser');
var passport = require('passport');
var methodOverride = require('method-override')
var port = process.env.PORT || 3001
var cors = require('cors')
var livereload = require('connect-livereload');
var mongoose = require('mongoose')
var cookieParser = require('cookie-parser');
var MongoStore = require('connect-mongo')(session);



// db
var mongoURI = process.env.MONGODB_URI || 'mongodb://localhost/altlegal'
mongoose.connect(mongoURI)
var db = mongoose.connection;

const server = app.listen(port, function() {
  console.log(`we are on port ${port}`)
})

const io = require('socket.io')(server);
// console.log(io)

// Controllers
var twitterController = require('./controllers/twitter.js');

app.use(livereload())
app.use(express.static('client/build'));


app.use(function(req, res, next){
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
})

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
app.use(cookieParser());
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
  maxAge: 20000,
  secure: false,
  store: new MongoStore({ mongooseConnection: db})
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static('public'))
app.set('view engine', 'hbs');
hbsIntl.registerWith(hbs)
app.use(logger('dev'));


app.use('/', function(req, res, next){
  res.io = io
  next()
},twitterController)


io.on('connection', (socket) => {
  console.log('a user connected');
  
  // setInterval(function(){
  //   io.emit('hello', {poo: 'pee'})
  // }, 1000)

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});
