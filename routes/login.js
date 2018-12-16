var express = require('express');
var router = express.Router();

/* GET login page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: '登录' });
});

router.post('/', function(req, res, next){

});

module.exports = router;