var express = require('express');
var router = express.Router();
var activityData = require('../models/activity_data');

router.post('/group', function(req, res){
    console.log(req.body.activityId+" "+req.session.memberId+" "+req.body.groupNumber+" "+req.body.currentGroupNumber);
    let groupNumber = parseInt(req.body.groupNumber);
    let currentGroupNumber = parseInt(req.body.currentGroupNumber);
    activityData.addGroup(req.body.activityId, req.session.memberId, groupNumber, currentGroupNumber, function(data){
        console.log(data);
        res.send(data);
    });
});
router.post('/activity', function(req, res){
    activityData.addActivity(req.session.memberId, req.body.activityTitle, req.body.activityInfo, req.body.activityGroupNumber, function(data){
        console.log(data);
        res.send(data);
    });
});
router.post('/join_group', function(req, res){
    // console.log("Key: "+req.body.groupKey);
    activityData.joinGroup(req.body.groupKey, req.session.memberId, function(data){
        console.log(data);
        res.send(data);
    })
});

module.exports = router;