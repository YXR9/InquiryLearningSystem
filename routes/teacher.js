var express = require('express');
var router = express.Router();
var multer = require('multer');
var fs = require('fs');
var groupData = require('../models/group_data');
var activityData = require('../models/activity_data');
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
        let uploadPath='./public/files/group'+groupId;
        setTimeout(function(){
            resolve(uploadPath);
        });
    });
}
function getFileNameAndType(originalName){
    return new Promise(function(resolve){
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
        resolve([fileName, fileType]);
    });    
}
function getTextareaImageNameAndType(originalName, memberId){
    return new Promise(function(resolve){
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
        +'_'+memberId+'_'+(d.getMonth()+1)+d.getDay()+d.getHours()+d.getMinutes()+d.getSeconds()
        +"."+fileFormat;
        resolve([fileName, fileType]);
    });    
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
            // console.log(attachmentName+' '+exist);
            resolve({attachmentName: attachmentName, exist: exist});
        });
    });    
}
function uploadGroupFile(originalname, path, url, nodeId, memberId, groupId){
    return new Promise(function(resolve){
        console.log(originalname+' path:'+path+' url:'+url+' nodeId:'+nodeId+' memberId:'+memberId+' groupId:'+groupId);
        getFileNameAndType(originalname).then(function(data){
            let fileName= data[0];
            let fileType= data[1];
            fs.copyFile(path,url+'/'+fileName, function(err){
                if(err) throw err;
                // console.log(url+'/'+fileName+"檔案移動完成");   
                groupData.addAttachment(nodeId, 1, memberId, groupId, fileName, fileType, function(data){
                    resolve(data[0]);
                });           
            });
        });        
    });    
}
function setupGroupUploadUrl(node, file){
    return new Promise(function(resolve){
        // console.log('<setupGroupUploadUrl>');
        // console.log(node);
        let nodeId= node.node_id;
        let groupId= node.group_id;
        let memberId= node.member_id;
        setUploadPath(groupId).then(function(url){
            return uploadGroupFile(file.originalname, file.path, url, nodeId, memberId, groupId);
        }).then(function(attachmentNode){
            // console.log('<attachmentNode>');
            // console.log(attachmentNode);
            resolve(attachmentNode);
        });
    });
}
/* GET home page. */
router.get('/', function(req, res, next) {
    if(!req.session.memberId){
        res.render('index');
    }else{
        res.render('teacher/main', { memberName: req.session.memberName });
    }    
});
router.get('/group_manager', function(req, res, next){
    let activityId=req.query.activityId;
    console.log("activityId="+activityId);
    if(!req.session.memberId){
        res.redirect('/');
    }else{
        activityData.checkActivityIdentity(req.session.memberId, activityId, function(data){
            console.log(data);
            if(data.checked){
                activityData.getActivityInfo(activityId, function(data){
                    res.render('teacher/group_manager', {
                        activityId: activityId,
                        activityTitle: data[0].activity_title, 
                        memberId: req.session.memberId, 
                        memberName: req.session.memberName
                    });
                }); 
            }else{
                res.redirect('/teacher');
            }
        });
    }
});
router.get('/broadcast', function(req, res, next){
    let activityId=req.query.activityId;
    console.log("activityId="+activityId);
    if(!req.session.memberId){
        res.redirect('/');
    }else{
        activityData.checkActivityIdentity(req.session.memberId, activityId, function(data){
            console.log(data);
            if(data.checked){
                activityData.getActivityInfo(activityId, function(data){
                    activityData.getActivityGroup(activityId, function(groupData){
                        activityData.getBroadcastByActivity(activityId, req.session.memberId).then(function(broadcastData){
                            // console.log(broadcastData);
                            let renderData={
                                activityId: activityId,
                                activityTitle: data[0].activity_title,
                                memberId: req.session.memberId, 
                                memberName: req.session.memberName,
                                groupData: JSON.stringify(groupData),
                                broadcastData: JSON.stringify(broadcastData)
                            }
                            res.render('teacher/broadcast', renderData);
                        });
                    });                    
                }); 
                
            }else{
                res.redirect('/teacher');
            }
        });
    }
});
router.get('/get_broadcast_by_activity', function(req, res, next){
    let activityId= req.query.activityId;
    activityData.getBroadcastByActivity(activityId, req.session.memberId).then(function(broadcastData){
        console.log(broadcastData);
        res.send(broadcastData);
    });
});
router.post('/add_group_broadcast_message', function(req, res, next){
    console.log(req.body);
    let activityId= req.body.activityId;
    let broadcastMessage= req.body.broadcastMessage;
    let selectedGroupId= req.body.selectedGroupId.split(',');
    let selectedGroupName= req.body.selectedGroupName.split(',');
    let promises= selectedGroupId.map(function(group, index){
        return activityData.addBroadcast(broadcastMessage, '訊息', activityId, group, selectedGroupName[index], -1, req.session.memberId);
    });
    Promise.all(promises).then(function(data){
        console.log(data);
        res.send(data);
    });

});
router.post('/add_group_keyquestion', upload.array('file'), function(req, res, next){
    console.log(req.body);
    let newNodeIds= [], groupIdOfNodes= [];
    let newNodeTitle;
    let nodeData;
    let activityId= req.body.activityId;
    let groupIds= req.body.selectedGroup.split(',');
    let promises= groupIds.map(function(groupId){
        return req.files.map(function(file){
            // console.log(file.originalname, groupId);
            return checkAttachmentExist(file.originalname, groupId);
        });
    });
    Promise.all(promises).then(function(data){
        let existAttachment= data.filter(attachment=> attachment.exist==true);
        if(existAttachment.length>0){
            res.send({existAttachment: true});
        }else{
            newNodeTitle= req.body.nodeTitle;
            let promises= groupIds.map(function(groupId){
                return groupData.addGroupKeyQuestionNode(req.session.memberId, req.session.memberName
                    , groupId, req.body.nodeTitle, req.body.keyQuestionInfo);
            });
            return Promise.all(promises);
        }
    }).then(function(data){
        console.log('<nodeData>');
        nodeData= data;
        console.log(nodeData);
        let nodePromises= nodeData.map(function(node){
            newNodeIds.push(node.node_id);
            groupIdOfNodes.push(node.group_id);
            let filePromises= req.files.map(function(file){
                return setupGroupUploadUrl(node, file);
            });
            return filePromises;
        });
        return Promise.all(nodePromises);
    }).then(function(attachmentData){
        // console.log(attachmentData)   
        let getGroupNamePromises= groupIdOfNodes.map(function(groupId){
            return groupData.getGroupNameById(groupId);
        });
        return Promise.all(getGroupNamePromises);
    }).then(function(groupNameData){
        let broadcastPromises= groupIdOfNodes.map(function(groupId, index){
            return activityData.addBroadcast(newNodeTitle, '關鍵提問', activityId
            , groupId, groupNameData[index]
            , newNodeIds[index], req.session.memberId);     
        });
        Promise.all(broadcastPromises);
    }).then(function(broadcastData){
        let sendData= {broadcastMessage: broadcastData, nodeData: nodeData};
        console.log('<send data>')
        console.log(sendData);
        res.send(sendData);
    });
});
router.post('/add_group_idea', upload.array('file'), function(req, res, next){
    console.log(req.body);
    let newNodeIds= [], groupIdOfNodes= [];
    let newNodeTitle;
    let nodeData;
    let activityId= req.body.activityId;
    let groupIds= req.body.selectedGroup.split(',');
    let promises= groupIds.map(function(groupId){
        return req.files.map(function(file){
            // console.log(file.originalname, groupId);
            return checkAttachmentExist(file.originalname, groupId);
        });
    });
    Promise.all(promises).then(function(data){
        let existAttachment= data.filter(attachment=> attachment.exist==true);
        if(existAttachment.length>0){
            res.send({existAttachment: true});
        }else{
            newNodeTitle= req.body.nodeTitle;
            let promises= groupIds.map(function(groupId){
                return groupData.addGroupIdeaNode(req.session.memberId, req.session.memberName
                    , groupId, req.body.nodeTitle, req.body.ideaContent);
            });
            return Promise.all(promises);
        }
    }).then(function(data){
        console.log('<nodeData>');
        nodeData= data;
        console.log(nodeData);
        let nodePromises= nodeData.map(function(node){
            newNodeIds.push(node.node_id);
            groupIdOfNodes.push(node.group_id);
            let filePromises= req.files.map(function(file){
                return setupGroupUploadUrl(node, file);
            });
            return filePromises;
        });
        return Promise.all(nodePromises);
    }).then(function(attachmentData){
        // console.log(attachmentData)   
        let getGroupNamePromises= groupIdOfNodes.map(function(groupId){
            return groupData.getGroupNameById(groupId);
        });
        return Promise.all(getGroupNamePromises);
    }).then(function(groupNameData){
        let broadcastPromises= groupIdOfNodes.map(function(groupId, index){
            return activityData.addBroadcast(newNodeTitle, '想法', activityId
            , groupId, groupNameData[index]
            , newNodeIds[index], req.session.memberId);     
        });
        Promise.all(broadcastPromises);
    }).then(function(broadcastData){
        let sendData= {broadcastMessage: broadcastData, nodeData: nodeData};
        console.log('<send data>')
        console.log(sendData);
        res.send(sendData);
    });
});
router.post('/add_group_directive_observation', function(req, res, next){
    console.log('<add_group_directive_observation>');
    console.log(req.body);
    let newNodeIds= [], groupIdOfNodes= [];
    let newNodeTitle;
    let nodeData;
    let activityId= req.body.activityId;
    let groupIds= req.body.selectedGroup.split(',');
    newNodeTitle= req.body.nodeTitle;
    let promises= groupIds.map(function(groupId){
        return groupData.addGroupDirectiveObservationNode(req.session.memberId, req.session.memberName
            , groupId, req.body.nodeTitle, req.body.directiveObservationInfo);
    });
    Promise.all(promises).then(function(data){
        console.log('<nodeData>');
        nodeData= data;
        console.log(nodeData);
        nodeData.forEach(function(node){
            newNodeIds.push(node.node_id);
            groupIdOfNodes.push(node.group_id);           
        });
        let getGroupNamePromises= groupIdOfNodes.map(function(groupId){
            return groupData.getGroupNameById(groupId);
        });
        return Promise.all(getGroupNamePromises);   
    }).then(function(groupNameData){
        let broadcastPromises= groupIdOfNodes.map(function(groupId, index){
            return activityData.addBroadcast(newNodeTitle, '直接觀察', activityId
            , groupId, groupNameData[index]
            , newNodeIds[index], req.session.memberId);     
        });
        Promise.all(broadcastPromises);
    }).then(function(broadcastData){
        let sendData= {broadcastMessage: broadcastData, nodeData: nodeData};
        console.log('<send data>')
        console.log(sendData);
        res.send(sendData);
    });
});
router.post('/add_group_operational_observation', function(req, res, next){
    console.log('<add_group_operational_observation>');
    console.log(req.body);
    let newNodeIds= [], groupIdOfNodes= [];
    let newNodeTitle;
    let nodeData;
    let activityId= req.body.activityId;
    let groupIds= req.body.selectedGroup.split(',');
    newNodeTitle= req.body.nodeTitle;
    let promises= groupIds.map(function(groupId){
        return groupData.addGroupOperationalObservationNode(req.session.memberId, req.session.memberName
            , groupId, req.body.nodeTitle, req.body.operationalObservationInfo, req.body.steps, req.body.materials);
    });
    Promise.all(promises).then(function(data){
        console.log('<nodeData>');
        nodeData= data;
        console.log(nodeData);
        nodeData.forEach(function(node){
            newNodeIds.push(node.node_id);
            groupIdOfNodes.push(node.group_id);           
        });
        let getGroupNamePromises= groupIdOfNodes.map(function(groupId){
            return groupData.getGroupNameById(groupId);
        });
        return Promise.all(getGroupNamePromises);   
    }).then(function(groupNameData){
        let broadcastPromises= groupIdOfNodes.map(function(groupId, index){
            return activityData.addBroadcast(newNodeTitle, '操作觀察', activityId
            , groupId, groupNameData[index]
            , newNodeIds[index], req.session.memberId);     
        });
        Promise.all(broadcastPromises);
    }).then(function(broadcastData){
        let sendData= {broadcastMessage: broadcastData, nodeData: nodeData};
        console.log('<send data>')
        console.log(sendData);
        res.send(sendData);
    });
});
router.post('/add_group_experiment', function(req, res, next){
    console.log('<add_group_experiment>');
    console.log(req.body);
    let newNodeIds= [], groupIdOfNodes= [];
    let newNodeTitle;
    let nodeData;
    let activityId= req.body.activityId;
    let groupIds= req.body.selectedGroup.split(',');
    newNodeTitle= req.body.nodeTitle;
    let promises= groupIds.map(function(groupId){
        return groupData.addGroupExperimentNode(req.session.memberId, req.session.memberName
            , groupId, req.body.nodeTitle, req.body.researchHypothesis, req.body.researchMotivation);
    });
    Promise.all(promises).then(function(data){
        console.log('<nodeData>');
        nodeData= data;
        console.log(nodeData);
        nodeData.forEach(function(node){
            newNodeIds.push(node.node_id);
            groupIdOfNodes.push(node.group_id);           
        });
        let getGroupNamePromises= groupIdOfNodes.map(function(groupId){
            return groupData.getGroupNameById(groupId);
        });
        return Promise.all(getGroupNamePromises);   
    }).then(function(groupNameData){
        let broadcastPromises= groupIdOfNodes.map(function(groupId, index){
            return activityData.addBroadcast(newNodeTitle, '實驗', activityId
            , groupId, groupNameData[index]
            , newNodeIds[index], req.session.memberId);     
        });
        Promise.all(broadcastPromises);
    }).then(function(broadcastData){
        let sendData= {broadcastMessage: broadcastData, nodeData: nodeData};
        console.log('<send data>')
        console.log(sendData);
        res.send(sendData);
    });
});
module.exports = router;
