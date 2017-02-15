var express = require('express');
var router = express.Router();

router.get('/', function(req, res){
  res.render('twitter/index');
})

router.get('/signup', function(req, res){
  res.render('twitter/signup')
})

router.get('/login', function(req, res){
  res.render('twitter/login');
})

module.exports = router;
