var express = require('express');
var router = express.Router();
var multer = require('multer');
var fs = require('fs');
var groupData = require('../models/group_data');
var activityData = require('../models/activity_data');
var uploadPath;
var storage = multer.diskStorage({
  destination: function (req, file, cb){
    cb(null, './public/files')
  }
});
var upload = multer({
  storage: storage
});
function setUploadPath(groupId){
    return new Promise(function(resolve){
        uploadPath='./public/files/group'+groupId;
        setTimeout(function(){
            resolve(uploadPath);
        });
    });
}
function checkMemberValidity(activityId, groupId, memberId, identity, cb){
    if(identity=='老師'){
        groupData.checkTeacherGroupIdentity(memberId, groupId, activityId, function(data){
            if(data.checked){  
                cb(true);
            }else{
                res.redirect('/teacher');
            }
        });                            
    }else{
        groupData.checkStudentGroupIdentity(memberId, groupId, activityId, function(data){
            if(data.checked){
                cb(true);
            }else{
                res.redirect('/student');
            }
        });
    }
}
function getFileNameAndType(originalName){
    // let d = new Date();
    let attachmentNameArray= originalName.split(".");   
    let fileFormat=attachmentNameArray.pop();
    let fileType;
    if(fileFormat == "png" || fileFormat =="jpg" || fileFormat =="jpeg"){
        fileType="圖片";
    }else if(fileFormat == "pdf" || fileFormat == "docx" || fileFormat == "doc" || fileFormat == "xlsx" || fileFormat == "pptx"){
        fileType="文件";
    }else if(fileFormat == "mp4"){
        fileType="影片";
    }else{
        fileType="其他";
    }
    let fileName= attachmentNameArray.join(".")
    +"."+fileFormat;
    return [fileName, fileType];
}
function getTextareaImageNameAndType(originalName, memberId){
    let d = new Date();
    let attachmentNameArray= originalName.split(".");   
    let fileFormat=attachmentNameArray.pop();
    let fileType;
    if(fileFormat == "png" || fileFormat =="jpg" || fileFormat =="jpeg"){
        fileType="圖片";
    }else if(fileFormat == "pdf" || fileFormat == "docx" || fileFormat == "doc" || fileFormat == "xlsx" || fileFormat == "pptx"){
        fileType="文件";
    }else if(fileFormat == "mp4"){
        fileType="影片";
    }else{
        fileType="其他";
    }
    let fileName= attachmentNameArray.join(".")
    +'_'+memberId+'_'+(d.getMonth()+1)+d.getDate()+d.getHours()+d.getMinutes()+d.getSeconds()+d.getMilliseconds()
    +"."+fileFormat;
    return [fileName, fileType];
}
function saveAndMoveAttachment(oldPath, uploadPath, file, nodeId, share, memberId, groupId){
    console.log(file);
    return new Promise(function(resolve){
        let fileNameAndType= getFileNameAndType(file.originalname);        
        fs.rename(oldPath, uploadPath+'/'+fileNameAndType[0], function(err){
            if(err) throw err;
            console.log("檔案移動完成");
            groupData.addAttachment(nodeId, share, memberId, groupId, fileNameAndType[0], fileNameAndType[1], function(data){
                resolve(data);
            });
        });
    });
}
function checkAttachmentExist(attachmentName, groupId){
    return new Promise(function(resolve){
        groupData.checkAttachmentExist(attachmentName, groupId, function(exist){
            console.log(attachmentName+' '+exist);
            resolve({attachmentName: attachmentName, exist: exist});
        });
    });    
}
/* GET home page. */
router.get('/', function(req, res, next) {
    console.log('groupId:' +req.query.groupId);
    let groupId=req.query.groupId;
    let activityId=req.query.activityId;
    if(!req.session.memberId){
        res.redirect('/');
    }else{        
        groupData.getGroupNode(groupId, function(node){
            groupData.getGroupEdge(groupId, function(edge){
                activityData.getActivityInfo(activityId, function(activity){
                    activityData.getGroup(groupId, function(group){
                        // console.log(node);
                        // console.log(edge);
                        if(req.session.memberIdentity=='老師'){
                            groupData.checkTeacherGroupIdentity(req.session.memberId, groupId, activityId, function(data){
                                if(data.checked){
                                    res.render('teacher/group',{   
                                        activityTitle: activity[0].activity_title, 
                                        groupName: group[0].group_name, 
                                        memberName: req.session.memberName, 
                                        memberId: req.session.memberId,
                                        memberIdentity: req.session.memberIdentity,
                                        nodeData: JSON.stringify(node), 
                                        edgeData: JSON.stringify(edge), 
                                        activityId: activityId,
                                        groupId: groupId 
                                    });
                                }else{
                                    res.redirect('/teacher');
                                }
                            });                            
                        }else{
                            groupData.checkStudentGroupIdentity(req.session.memberId, groupId, activityId, function(data){
                                if(data.checked){
                                    res.render('student/group',{   
                                        activityTitle: activity[0].activity_title, 
                                        groupName: group[0].group_name, 
                                        memberName: req.session.memberName, 
                                        memberId: req.session.memberId,
                                        memberIdentity: req.session.memberIdentity,
                                        nodeData: JSON.stringify(node), 
                                        edgeData: JSON.stringify(edge), 
                                        activityId: activityId,
                                        groupId: groupId 
                                    });
                                }else{
                                    res.redirect('/student');
                                }
                            });
                        } 
                    });
                });            
            });        
        }); 
    } 
});
router.post('/add_key_question', upload.array('file', 5), function(req, res, next){
    console.log('[router] add_key_question');
    console.log(req.body);
    let groupId= req.body.groupId;
    let nodeData, edgeData;
    console.log(req.files);
    let promises = req.files.map(function(file){
        return checkAttachmentExist(file.originalname, groupId);
    })
    Promise.all(promises).then(function(data){
        console.log(data);
        let existAttachment= data.filter(attachment=> attachment.exist==true);
        console.log(existAttachment);
        if(existAttachment.length>0){
            res.send(existAttachment);
        }else{
            groupData.addKeyQuestionNode(req.session.memberId, req.session.memberName, groupId, 
            req.body.nodeTitle, req.body.keyQuestionInfo, req.body.fromNodeId, function(data){
                console.log(data);
                nodeData= data.nodeData;
                edgeData=data.edgeData? data.edgeData: [];
                let nodeId= data.nodeData[0].node_id;
                setUploadPath(groupId).then(function(url){
                    req.files.forEach(function(value, index){
                        let fileNameAndType= getFileNameAndType(value.originalname);
                        fs.rename(value.path,url+'/'+fileNameAndType[0], function(err){
                            if(err) throw err;
                            console.log("檔案移動完成");   
                            groupData.addAttachment(nodeId, 1,req.session.memberId, groupId, fileNameAndType[0], fileNameAndType[1], function(data){
                                console.log(data);
                            });           
                        });
                    });
                    res.send({nodeData: nodeData, edgeData: edgeData});
                });
            });
        }
    });
});
router.post('/add_idea', upload.array('file', 5), function(req, res, next){
    console.log('[router] add_idea');
    console.log(req.body);
    let groupId= req.body.groupId;
    let nodeData, edgeData;
    console.log(req.files);
    let promises = req.files.map(function(file){
        return checkAttachmentExist(file.originalname, groupId);
    })
    Promise.all(promises).then(function(data){
        console.log(data);
        let existAttachment= data.filter(attachment=> attachment.exist==true);
        console.log(existAttachment);
        if(existAttachment.length>0){
            res.send(existAttachment);
        }else{
            groupData.addIdeaNode(req.session.memberId, req.session.memberName, groupId, 
            req.body.nodeTitle, req.body.ideaContent, 
            req.body.countScaffold, req.body.fromNodeId, function(data){
                console.log(data);
                nodeData= data.nodeData;
                let edgeData=data.edgeData? data.edgeData: [];
                let nodeId= data.nodeData[0].node_id;
                setUploadPath(groupId).then(function(url){
                    req.files.forEach(function(value, index){
                        let fileNameAndType= getFileNameAndType(value.originalname);
                        fs.rename(value.path,url+'/'+fileNameAndType[0], function(err){
                            if(err) throw err;
                            console.log("檔案移動完成");   
                            groupData.addAttachment(nodeId, 1,req.session.memberId, groupId, fileNameAndType[0], fileNameAndType[1], function(data){
                                console.log(data);
                            });           
                        });
                    });
                    res.send({nodeData: nodeData, edgeData: edgeData});
                });
            });
        }
    });
});
router.post('/add_attachment', upload.array('file'), function(req, res){
    console.log('[router] add_attachment');
    console.log(req.body);
    let groupId= req.body.groupId;
    let promises = req.files.map(function(file){
        return checkAttachmentExist(file.originalname, groupId);
    })
    Promise.all(promises).then(function(data){
        console.log(data);
        let existAttachment= data.filter(attachment=> attachment.exist==true);
        console.log(existAttachment);
        if(existAttachment.length>0){
            res.send({existAttachment: existAttachment});
        }else{
            setUploadPath(groupId).then(function(uploadPath){
                let promises = req.files.map(function(file){
                    return saveAndMoveAttachment(file.path, uploadPath, file, req.body.nodeId, req.body.share, req.session.memberId, groupId);
                });
                Promise.all(promises).then(function(data){
                    res.send(data);
                });
            }); 
        }
    });     
});
router.post('/upload_textarea_image', upload.single('image'), function(req, res){
    console.log('[router] upload_textarea_image');
    console.log(req.body);
    setUploadPath(req.body.groupId).then(function(url){
        let fileNameAndType= getTextareaImageNameAndType(req.file.originalname, req.session.memberId);
        fs.rename(req.file.path,url+'/'+fileNameAndType[0], function(err){
            if(err) throw err;
            console.log("檔案移動完成");
            res.send({imageUrl: '/files/group'+req.body.groupId+'/'+fileNameAndType[0]});
        });
    });
});
router.get('/check_attachment_exists', function(req, res){
    console.log('[router] check_attachment_exists');
    groupData.checkAttachmentExist(req.query.attachmentName, req.query.groupId, function(exists){
        res.send(exists);
    });
});
router.post('/add_directive_observation_record', function(req, res){
    console.log('[router] add_directive_observation_record');
    console.log(req.body);
    groupData.addDirectiveObservationRecord(req.body.nodeId, req.session.memberId, req.body.directiveObservationRecord, function(data){
        res.send(data);
    });
});
router.post('/add_operational_observation_record', function(req, res){
    console.log('[router] add_operational_observation_record');
    console.log(req.body);
    groupData.addOperationalObservationRecord(req.body.nodeId, req.session.memberId, req.body.operationalObservationRecord, function(data){
        res.send(data);
    });
});
router.post('/add_experiment_record', function(req, res){
    console.log('[router] add_experiment_record');
    console.log(req.body);
    groupData.addExperimentRecord(req.body.nodeId, req.session.memberId, req.body.experimentRecord, function(data){
        res.send(data);
    })
})
router.post('/save_experiment_design', function(req, res){
    console.log('[router] save_experiment_design');
    let memberName= req.session.memberName;
    console.log(memberName);
    console.log(req.body);
    groupData.saveExperimentDesign(memberName, req.body.nodeId, req.body.steps, req.body.materials, function(data){
        res.send(data);
    });
});
router.post('/edit_record', function(req, res){
    console.log('[router] edit_record');
    console.log(req.body);
    let recordType= req.body.recordType;
    let recordId= req.body.recordId;
    let recordContent= req.body.record;
    groupData.editRecord(recordType, recordId, recordContent).then(function(recordData){
        console.log(recordData);
        res.send(recordData);
    })
});
router.post('/remove_record', function(req, res){
    console.log('[router] remove_record');
    console.log(req.body);
    let recordType= req.body.recordType;
    let recordId= req.body.recordId;
    groupData.removeRecord(recordType, recordId).then(function(recordData){
        console.log(recordData);
        res.send(recordData);
    })
});
router.post('/add_favorite', function(req, res){
    console.log('[router] add_favorite');
    groupData.addFavorite(req.body.nodeId, req.session.memberId, req.body.groupId, function(data){
        res.send(data);
    });
});
router.post('/remove_favorite', function(req, res){
    console.log('[router] remove_favorite');
    console.log(req.body);
    groupData.removeFavorite(req.body.nodeId, req.session.memberId, function(data){
        res.send(data);
    });
});
router.get('/practice_results', function(req, res) {
    console.log('[router] practice_results');
    let groupId=req.query.groupId;
    let activityId=req.query.activityId;
    if(!req.session.memberId){
        res.redirect('/');
    }else{        
       activityData.getActivityInfo(activityId, function(activity){
            activityData.getGroup(groupId, function(group){
                groupData.getGroupPractice(groupId, function(practice){
                    // console.log(JSON.stringify(practice));
                    if(req.session.memberIdentity=='老師'){
                        groupData.checkTeacherGroupIdentity(req.session.memberId, groupId, activityId, function(data){
                            if(data.checked){
                                res.render('teacher/practice_results',{   
                                    activityTitle: activity[0].activity_title, 
                                    groupName: group[0].group_name, 
                                    memberName: req.session.memberName, 
                                    memberId: req.session.memberId,
                                    activityId: activityId,
                                    groupId: groupId,
                                    directiveObservationList: JSON.stringify(practice.directiveObservationList),
                                    operationalObservationList: JSON.stringify(practice.operationalObservationList),
                                    experimentList: JSON.stringify(practice.experimentList),
                                    directiveObservationData: JSON.stringify(practice.directiveObservationData),
                                    operationalObservationData: JSON.stringify(practice.operationalObservationData),
                                    experimentData: JSON.stringify(practice.experimentData)
                                });
                            }else{
                                res.redirect('/teacher');
                            }
                        });                            
                    }else{
                        groupData.checkStudentGroupIdentity(req.session.memberId, groupId, activityId, function(data){
                            if(data.checked){
                                res.render('student/practice_results',{   
                                    activityTitle: activity[0].activity_title, 
                                    groupName: group[0].group_name, 
                                    memberName: req.session.memberName, 
                                    memberId: req.session.memberId,
                                    activityId: activityId,
                                    groupId: groupId,
                                    directiveObservationList: JSON.stringify(practice.directiveObservationList),
                                    operationalObservationList: JSON.stringify(practice.operationalObservationList),
                                    experimentList: JSON.stringify(practice.experimentList),
                                    directiveObservationData: JSON.stringify(practice.directiveObservationData),
                                    operationalObservationData: JSON.stringify(practice.operationalObservationData),
                                    experimentData: JSON.stringify(practice.experimentData)
                                });
                            }else{
                                res.redirect('/student');
                            }
                        });
                    }
                });
            });
        });
    }
});
router.get('/learning_process', function(req, res, next){
    console.log('[router] learning_process');
    let groupId=req.query.groupId;
    let activityId=req.query.activityId;
    if(!req.session.memberId){
        res.redirect('/');
    }else{
        checkMemberValidity(activityId, groupId, req.session.memberId, req.session.memberIdentity, function(check){
            if(check){
                activityData.getActivityInfo(activityId, function(activity){
                    activityData.getGroup(groupId, function(group){
                        groupData.getGroupIdeaAction(groupId, function(ideaActionData){
                            groupData.getGroupIdeaScaffold(groupId, function(ideaScaffoldData){
                                groupData.getGroupIdeaIncrease(groupId, function(ideaIncreaseData){
                                    let renderData= {                                                                   
                                        activityId: activityId,
                                        groupId: groupId,
                                        activityTitle: activity[0].activity_title, 
                                        groupName: group[0].group_name, 
                                        memberName: req.session.memberName, 
                                        memberId: req.session.memberId,
                                        memberIdentity: req.session.memberIdentity,
                                        ideaActionData: JSON.stringify(ideaActionData),
                                        ideaScaffoldData: JSON.stringify(ideaScaffoldData),
                                        ideaIncreaseData: JSON.stringify(ideaIncreaseData)
                                    }
                                    // console.log(renderData);
                                    if(req.session.memberIdentity=='老師'){
                                        res.render('teacher/learning_process',renderData);   
                                    }else{
                                        res.render('student/learning_process',renderData);
                                    }
                                });                                
                            });                            
                        });
                    });
                });
            }
        });
    }
});
router.get('/personal_space', function(req, res, next){
    console.log('[router] personal_space');
    let groupId=req.query.groupId;
    let activityId=req.query.activityId;
    if(!req.session.memberId){
        res.redirect('/');
    }else{
        checkMemberValidity(activityId, groupId, req.session.memberId, req.session.memberIdentity, function(check){
            if(check){
                activityData.getActivityInfo(activityId, function(activity){
                    activityData.getGroup(groupId, function(group){
                        groupData.getPersonalFavoriteIdea(groupId, req.session.memberId, function(favoriteIdea){
                            groupData.getPersonalNote(groupId, req.session.memberId, function(personalNoteContent){
                                let renderData= {                                                                   
                                    activityId: activityId,
                                    groupId: groupId,
                                    activityTitle: activity[0].activity_title, 
                                    groupName: group[0].group_name, 
                                    memberName: req.session.memberName, 
                                    memberId: req.session.memberId,
                                    favoriteIdea: JSON.stringify(favoriteIdea),
                                    personalNoteContent: JSON.stringify(personalNoteContent)
                                }
                                console.log(renderData);
                                if(req.session.memberIdentity=='老師'){
                                    res.render('teacher/personal_space',renderData);   
                                }else{
                                    res.render('student/personal_space',renderData);
                                } 
                            });                                                       
                        });
                    });
                });
            }
        });
    }
    
});
router.post('/save_personal_note', function(req, res, next){
    console.log('[router] save_personal_note');
    groupData.savePersonalNote(req.body.groupId, req.session.memberId, req.body.noteContent, function(data){
        res.send(data);
    });
});
router.get('/file_manager', function(req, res, next) {
    console.log('[router] file_manager');
    let groupId=req.query.groupId;
    let activityId=req.query.activityId;
    if(!req.session.memberId){
        res.redirect('/');
    }else{
        checkMemberValidity(activityId, groupId, req.session.memberId, req.session.memberIdentity, function(check){
            if(check){
                activityData.getActivityInfo(activityId, function(activity){
                    activityData.getGroup(groupId, function(group){
                        groupData.getFileByGroup(groupId, req.session.memberId, function(fileList){
                            let renderData= {                                                                   
                                activityId: activityId,
                                groupId: groupId,
                                activityTitle: activity[0].activity_title, 
                                groupName: group[0].group_name, 
                                memberName: req.session.memberName, 
                                memberId: req.session.memberId,
                                groupSharedFileData: JSON.stringify(fileList.groupSharedFileData),
                                personalFileData: JSON.stringify(fileList.personalFileData),
                            }
                            // console.log(renderData);
                            if(req.session.memberIdentity=='老師'){
                                res.render('teacher/file_manager',renderData);   
                            }else{
                                res.render('student/file_manager',renderData);
                            }                                                        
                        });
                    });
                });
            }
        });
    }
});
router.post('/remove_personal_attachment', function(req, res, next){
    console.log('[router] remove_personal_attachment');
    groupData.removePersonalAttachment(req.body.attachmentId, function(data){
        if(req.body.attachmentType=='連結'){
            res.send(data.finished);
        }else{
            let filePath= './public/files/group'+req.body.groupId+'/'+req.body.attachmentName;
            fs.unlink(filePath, function(err){
                if(err) throw err;
                console.log('刪除'+filePath+'成功！');
                res.send(data.finished);
            });
        }
        
    });
});
router.post('/share_attachment_to_group', function(req, res, next){
    console.log('[router] share_attachment_to_group');
    groupData.sharePersonalAttachmentToGroup(req.body.attachmentId, function(data){
        res.send(data);
    });
});
router.post('/add_link', function(req, res, next){
    console.log('[router] add_link');
    groupData.addAttachment(req.body.nodeId, req.body.share, req.session.memberId, req.body.groupId, req.body.link, "連結", function(data){
        console.log(data);
        res.send(data);
    });
});
router.get('/get_broadcast', function(req, res, next){
    console.log('[router] get_broadcast');
    console.log(req.query);
    groupData.getBroadcastByGroup(req.query.groupId).then(function(data){
        res.send(data);
    });
});
module.exports = router;
