var express = require('express');
var router = express.Router();
var activityData = require('../models/activity_data');
var groupData = require('../models/group_data');

router.get('/teacher_activity', function(req, res){
  activityData.getTeacherActivity(req.session.memberId, function(results){
    //   console.log(results);
      res.send(results);
  })
});
router.get('/teacher_group', function(req, res){
    activityData.getActivityGroup(req.query.activityId, function(results){
        // console.log(results);
        res.send(results);
    });
});
router.get('/student_group', function(req, res){
    activityData.getJoinedGroup(req.session.memberId, function(data){
        // console.log(data);
        res.send(data);
    });
});
router.get('/idea_node', function(req, res){
    groupData.getIdeaNode(req.query.nodeId, req.session.memberId, req.query.groupId, function(ideaData){
        res.send(ideaData);
    });
});
router.get('/key_question_node', function(req, res){
    groupData.getKeyQuestionNode(req.query.nodeId, req.session.memberId, req.query.groupId, function(keyQuestiondata){
        res.send(keyQuestiondata);
    });
});
router.get('/directive_observation_node', function(req, res){
    groupData.getDirectiveObservationNode(req.query.nodeId, req.session.memberId, req.query.groupId, function(directiveObservationData){
        res.send(directiveObservationData);
    });
});
router.get('/directive_observation_record', function(req, res){
    groupData.getDirectiveObservationRecord(req.query.nodeId, function(directiveObservationRecordData){
        res.send(directiveObservationRecordData);
    });
});
router.get('/operational_observation_node', function(req, res){
    groupData.getOperationalObservationNode(req.query.nodeId, req.session.memberId, req.query.groupId, function(operationalObservationData){
        res.send(operationalObservationData);
    });
});
router.get('/operational_observation_record', function(req, res){
    groupData.getOperationalObservationRecord(req.query.nodeId, function(operationalObservationRecordData){
        res.send(operationalObservationRecordData);
    });
});
router.get('/experiment_node', function(req, res){
    groupData.getExperimentNode(req.query.nodeId, req.session.memberId, req.query.groupId, function(experimentData){
        res.send(experimentData);
    });
});
router.get('/experiment_record_node', function(req, res){
    groupData.getExperimentRecordNode(req.query.nodeId, req.session.memberId, req.query.groupId, function(experimentRecordData){
        res.send(experimentRecordData);
    });
});
router.get('/attachment', function(req, res){
    groupData.getAttachmentNode(req.query.nodeId, req.session.memberId, req.query.groupId, function(attachmentData){
        res.send(attachmentData);
    })
});
module.exports = router;