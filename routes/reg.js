var express = require('express');
var router = express.Router();

/* GET reg page. */
router.get('/', function(req, res, next) {
  res.render('reg', { title: '注册' });
});

router.post('/', function(req, res, next){
    
})

module.exports = router;