var express = require('express');
var router = express.Router();
var member = require('../models/member');

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log("index session: "+req.session.memberIdentity);
  if(req.session.memberId && req.session.memberIdentity === '老師'){
    res.redirect('/teacher');
  } else if(req.session.memberId && req.session.memberIdentity === '學生'){
    res.redirect('/student');
  } else{
    res.render('index', { title: '科學探究學習系統' });
  }
});
router.get('/login', function(req, res){
  // console.log("login: "+req.query.login_account);
  if(req.session.memberId && req.session.memberName){
    res.json({alreadyLogin: true, success: false});
  }else{
    member.login(req.query.loginAccount, req.query.loginPassword, req.query.loginIdentity, function(results){
      console.log(results);
      if(results.length > 0){
        req.session.memberId = results[0].member_id;
        req.session.memberName = results[0].member_name;      
        req.session.memberIdentity = results[0].member_identity;
        console.log("SET SESSION: "+req.session.memberId+" "+req.session.memberName);
        if((req.session.memberIdentity=="老師")||(req.session.memberIdentity=="學生")&&req.session.memberId&&req.session.memberName){
          res.json({success: true});
        }else{
          req.session.destroy();
          res.json({success: false});
        }
      }else{
        res.json({success: false});
      }  
    });
  }  
});
router.get('/regist', function(req, res){
  // console.log("註冊!");
  console.log(req.query);
  member.regist(req.query.registAccount, req.query.registPassword, req.query.registName, req.query.registIdentity, req.query.registCity, req.query.registSchool, function(results){
    console.log(results);
    if(results.existed){
      res.json({success: false});
    }else{
      // res.json({code: 1, msg: "註冊成功！請登入"});
      req.session.memberId = results.data;
      req.session.memberName = req.query.registName;      
      req.session.memberIdentity = req.query.registIdentity;
      console.log("SET SESSION: "+req.session.memberId+" "+req.session.memberName);
      if((req.session.memberIdentity=="老師"||req.session.memberIdentity=="學生") && req.session.memberId && req.session.memberName){
        res.json({success: true});
      }else{
        req.session.destroy();
        res.json({success: false});
      }
    }
  });  
});
router.get('/logout', function(req, res){
  console.log(req.session.memberId+': '+req.session.memberName+" logout!");
  req.session.destroy();
  res.redirect('/');
});
router.get('/check_session', function(req, res){
  if(typeof req.session.memberId !== 'undefined'){
    res.send(true);
  }else{
    res.send(false);
  }
})

module.exports = router;