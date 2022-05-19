var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  if(!req.session.memberId){
    res.render('index');
  }else{
    res.render('student/main', {memberName: req.session.memberName });
  }
});

module.exports = router;
