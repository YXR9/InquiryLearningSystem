var pool = require('./db');
function newNode(type, memberId, memberName, nodeTitle, groupId){
    return new Promise(function(resolve, reject){
        var sql="INSERT INTO `node` SET ?";
        var sqlValue={
            member_id: memberId,
            group_id: groupId,
            node_type: type,
            node_title: nodeTitle,
            node_author: memberName,
            node_revised_count: 0,
            node_read_count: 0
        }
        pool.query(sql, sqlValue, function(err, results){
            if(err) throw err;
            var newNodeId = results.insertId;
            let sql2='INSERT INTO `node_read_count` SET group_id=?, node_id=?, read_node_member_list="-1"'
            pool.query(sql2, [groupId, newNodeId], function(err, results){
                if(err) throw err;
                resolve(newNodeId);
            });
        });        
    });
}
function editNodeTitle(nodeId, nodeTitle){
    return new Promise(function(resolve){
        let sql="UPDATE `node` SET node_title=? WHERE node_id=?";
        pool.query(sql, [nodeTitle, nodeId], function(err, results){
            if(err) throw err;
            resolve({finished: true});
        });
    });
}
function newEdge(fromId, toId, groupId){
    return new Promise(function(resolve, reject){
        var sql="INSERT INTO `edge` SET?";
        var sqlValue={
            edge_from: fromId,
            edge_to: toId,
            group_id: groupId
        }
        pool.query(sql, sqlValue, function(err, results){
            if(err) throw err;
            var newEdgeId = results.insertId;
            console.log('findish edge id='+newEdgeId);
            resolve(newEdgeId);
        });
    });
}
function newIdea(nodeId, ideaContent, countScaffold){
    return new Promise(function(resolve, reject){
        var sql="INSERT INTO `idea` SET ?";
        var sqlValue={
            node_id: nodeId,
            idea_content: ideaContent,
            idea_scaffold: countScaffold
        }
        pool.query(sql, sqlValue, function(err){
            if(err) throw err;
            resolve(nodeId);
        })       
    });
}
function editIdea(nodeId, ideaContent, countScaffold){
    return new Promise(function(resolve){
        let sql="UPDATE `idea` SET idea_content=?, idea_scaffold=? WHERE node_id=?";
        pool.query(sql, [ideaContent, countScaffold, nodeId], function(err, results){
            if(err) throw err;
            resolve({finished: true});
        });
    });
}
function newKeyQuestion(nodeId, keyQuestionInfo){
    return new Promise(function(resolve, reject){
        var sql="INSERT INTO `key_question` SET ?";
        var sqlValue={
            node_id: nodeId,
            key_question_info: keyQuestionInfo
        }              
        pool.query(sql, sqlValue, function(err){
            if(err) throw err;
            resolve(nodeId);
        })       
    });
}
function editKeyQuestion(nodeId, keyQuestionInfo){
    return new Promise(function(resolve){
        let sql="UPDATE `key_question` SET key_question_info=? WHERE node_id=?";
        pool.query(sql, [keyQuestionInfo, nodeId], function(err, results){
            if(err) throw err;
            resolve({finished: true});
        });
    });
}
function newDirectiveObservation(nodeId, directiveObservationInfo){
    return new Promise(function(resolve, reject){
        var sql="INSERT INTO `directive_observation` SET ?";
        var sqlValue={
            node_id: nodeId,
            directive_observation_info: directiveObservationInfo
        }              
        pool.query(sql, sqlValue, function(err){
            if(err) throw err;
            resolve(nodeId);
        })       
    });
}
function editDirectiveObservation(nodeId, directiveObservationInfo){
    return new Promise(function(resolve){
        let sql="UPDATE `directive_observation` SET directive_observation_info=? WHERE node_id=?";
        pool.query(sql, [directiveObservationInfo, nodeId], function(err, results){
            if(err) throw err;
            resolve({finished: true});
        });
    });
}
function newDirectiveObservationRecord(memberId, directiveObservationId, record){
    return new Promise(function(resolve, reject){
        let sql="INSERT INTO `directive_observation_record` SET ?";
        let sqlValue={
            directive_observation_id: directiveObservationId,
            directive_observation_record: record,
            member_id: memberId
        }
        pool.query(sql, sqlValue, function(err, results){
            if(err) throw err;
            let newRecordId=results.insertId;
            let sql2="SELECT dov.*, m.member_name FROM `directive_observation_record` dov"
            +" INNER JOIN `member` m ON dov.member_id=m.member_id"
            +" WHERE `directive_observation_record_id`=?";
            pool.query(sql2, newRecordId, function(err, results){
                if(err) throw err;
                resolve(results);
            });
        });
    });
}
function newOperationalObservation(nodeId, operationalObservationInfo, steps, materials){
    return new Promise(function(resolve){
        let sql="INSERT INTO `operational_observation` SET ?";
        let sqlValue={
            node_id: nodeId,
            operational_observation_info: operationalObservationInfo,
            steps: steps,
            materials: materials
        }
        pool.query(sql, sqlValue, function(err){
            if(err) throw err;
            resolve(nodeId);
        })
    });
}
function editOperationalObservation(nodeId, operationalObservationInfo, steps, materials){
    return new Promise(function(resolve){
        let sql="UPDATE `operational_observation` SET operational_observation_info=?, steps=?, materials=? WHERE node_id=?";
        pool.query(sql, [operationalObservationInfo, steps, materials, nodeId], function(err, results){
            if(err) throw err;
            resolve({finished: true});
        });
    });
}
function newOperationalObservationRecord(memberId, operationalObservationId, record){
    return new Promise(function(resolve, reject){
        let sql="INSERT INTO `operational_observation_record` SET ?";
        let sqlValue={
            operational_observation_id: operationalObservationId,
            operational_observation_record: record,
            member_id: memberId
        }
        pool.query(sql, sqlValue, function(err, results){
            if(err) throw err;
            let newRecordId=results.insertId;
            let sql2="SELECT dov.*, m.member_name FROM `operational_observation_record` dov"
            +" INNER JOIN `member` m ON dov.member_id=m.member_id"
            +" WHERE `operational_observation_record_id`=?";
            pool.query(sql2, newRecordId, function(err, results){
                if(err) throw err;
                resolve(results);
            });
        });
    });
}
function newExperiment(nodeId, researchHypothesis, researchMotivation, memberName){
    return new Promise(function(resolve){
        let sql="INSERT INTO `experiment` SET ?";
        let sqlValue={
            node_id: nodeId,
            research_hypothesis: researchHypothesis,
            research_motivation: researchMotivation,
            last_editor: memberName
        }
        pool.query(sql, sqlValue, function(err){
            if(err) throw err;
            resolve(nodeId);
        })
    });
}
function editExperiment(nodeId, researchHypothesis, researchMotivation){
    return new Promise(function(resolve){
        let sql="UPDATE `experiment` SET research_hypothesis=?, research_motivation=? WHERE node_id=?";
        pool.query(sql, [researchHypothesis, researchMotivation, nodeId], function(err, results){
            if(err) throw err;
            resolve({finished: true});
        });
    });
}
function updateExperimentRecordNodeId(recordNodeId, nodeId){
    return new Promise(function(resolve){
        let sql= 'UPDATE `experiment` SET experiment_record_node_id=? WHERE node_id=?';
        pool.query(sql, [recordNodeId, nodeId], function(err){
            if(err) throw err;
            resolve({finished: true});
        });
    });
}
function newExperimentRecord(memberId, nodeId, experimentId, record){
    return new Promise(function(resolve, reject){
        let sql="INSERT INTO `experiment_record` SET ?";
        let sqlValue={
            node_id: nodeId,
            experiment_id: experimentId,
            experiment_record: record,
            member_id: memberId
        }
        pool.query(sql, sqlValue, function(err, results){
            if(err) throw err;
            let newRecordId=results.insertId;
            let sql2="SELECT er.*, m.member_name FROM `experiment_record` er"
            +" INNER JOIN `member` m ON er.member_id=m.member_id"
            +" WHERE `experiment_record_id`=?";
            pool.query(sql2, newRecordId, function(err, results){
                if(err) throw err;
                resolve(results);
            });
        });
    });
}
function newAttachment(nodeId, attachmentName, attachmentType, share, memberId, groupId){
    return new Promise(function(resolve, reject){
        let sql="INSERT INTO `attachment` SET ?";
        let sqlValue={
            node_id: nodeId,
            attachment_name: attachmentName,
            attachment_type: attachmentType,
            share: share,
            member_id: memberId,
            group_id: groupId

        }              
        pool.query(sql, sqlValue, function(err, results){
            if(err) throw err;
            resolve(results.insertId);
        })       
    })
}
function addReadCount(nodeId, memberId, groupId, nodeType){
    return new Promise(function(resolve){
        let sql="UPDATE `node` SET node_read_count=node_read_count+1 WHERE node_id=?";
        pool.query(sql, nodeId, function(err, results){
            if(err) throw err;
            let sql2='UPDATE `node_read_count` SET'
            +' node_read_count=node_read_count+1,'
            +' read_node_member_list=CONCAT(read_node_member_list,",","'+memberId+'")'
            +' WHERE node_id=?';
            pool.query(sql2, nodeId, function(err, results){
                if(err) throw err;
                let sql3='UPDATE `member_read_node` SET'
                +' read_node_count=read_node_count+1'
                +' ,read_node_list= CONCAT(read_node_list,",","'+nodeId+'")' 
                +' ,read_'+nodeType+'_node= CONCAT(read_'+nodeType+'_node,",","'+nodeId+'")'               
                +' WHERE member_id=? AND group_id=?';
                pool.query(sql3, [memberId, groupId], function(err, results){
                    if(err) throw err;
                    resolve({finished: true});
                });
            });
        });
    });
}
function addRevisedCount(nodeId){
    return new Promise(function(resolve){
        let sql="UPDATE `node` SET node_revised_count=node_revised_count+1 WHERE node_id=?";
        pool.query(sql, nodeId, function(err, results){
            if(err) throw err;
            resolve({finished: true});
        });
    });
}
function getNodeInfo(nodeId){
    return new Promise(function(resolve){
        let sql="SELECT n.*, COUNT(a.attachment_id) AS attachment_count, DATE_FORMAT(n.node_create_time, '%Y-%m-%d %T') AS create_time FROM `node` n LEFT JOIN `attachment` a ON n.node_id=a.node_id WHERE n.node_id=?";
        pool.query(sql, nodeId, function(err, results){
            if(err) throw err;
            resolve(results);
        });
    });    
}
function getNodeAttachment(nodeId){
    return new Promise(function(resolve){
        let sql= 'SELECT * FROM `attachment` WHERE node_id=?';
        pool.query(sql, nodeId, function(err, results){
            if(err) throw err;
            resolve(results);
        });
    });    
}
function getEdgeByEdgeTo(nodeId){
    return new Promise(function(resolve){
        let sql="SELECT * FROM `edge` WHERE edge_to=?";
        pool.query(sql, nodeId, function(err, results){
            if(err) throw err;
            resolve(results);
        });
    });    
}
function checkFavorite(nodeId, memberId){
    return new Promise(function(resolve){
        let sql="SELECT * FROM `favorite_idea` WHERE node_id=? AND member_id=?";
        pool.query(sql, [nodeId, memberId], function(err, results){
            if(err) throw err;
            console.log(results);
            if(results.length > 0){
                resolve({checked: true});
            }else{
                resolve({checked: false});
            }
        });
    });    
}
function getGroupDirectiveObservation(groupId){
    return new Promise(function(resolve){
        let sql="SELECT n.node_id, dovr.*, DATE_FORMAT(dovr.directive_observation_record_create_time, '%Y-%m-%d %T') AS record_create_time, m.member_name FROM `node` n"
        +" INNER JOIN `directive_observation` dov ON n.node_id=dov.node_id"
        +" INNER JOIN `directive_observation_record` dovr ON dov.directive_observation_id=dovr.directive_observation_id"
        +" INNER JOIN `member` m ON m.member_id=dovr.member_id"
        +" WHERE n.group_id=? ORDER BY n.node_id ASC";
        pool.query(sql, groupId, function(err, results){
            if(err) throw err;
            resolve(results);
        });
    });    
}
function getGroupOperationalObservation(groupId){
    return new Promise(function(resolve){
        let sql="SELECT n.node_id, oovr.*, DATE_FORMAT(oovr.operational_observation_record_create_time, '%Y-%m-%d %T') AS record_create_time, m.member_name FROM `node` n"
        +" INNER JOIN `operational_observation` oov ON n.node_id=oov.node_id"
        +" INNER JOIN `operational_observation_record` oovr ON oov.operational_observation_id=oovr.operational_observation_id"
        +" INNER JOIN `member` m ON m.member_id=oovr.member_id"
        +" WHERE n.group_id=? ORDER BY n.node_id ASC";
        pool.query(sql, groupId, function(err, results){
            if(err) throw err;
            resolve(results);
        });
    });    
}
function getGroupExperiment(groupId){
    return new Promise(function(resolve){
        let sql="SELECT e.node_id, er.experiment_record_id, er.experiment_record, DATE_FORMAT(er.experiment_record_create_time, '%Y-%m-%d %T') AS record_create_time, m.member_name FROM `node` n"
        +" INNER JOIN `experiment` e ON n.node_id=e.node_id"
        +" INNER JOIN `experiment_record` er ON e.experiment_id=er.experiment_id"
        +" INNER JOIN `member` m ON m.member_id=er.member_id"
        +" WHERE n.group_id=? AND n.node_type='experiment'"
        +" ORDER BY n.node_id ASC";
        pool.query(sql, groupId, function(err, results){
            if(err) throw err;
            resolve(results);
        });
    });
}
function countMemberViewType(memberId, groupId){
    return new Promise(function(resolve){
        let sql= 'SELECT mrn.*, m.member_name FROM `member_read_node` mrn INNER JOIN `member` m ON m.member_id=mrn.member_id WHERE mrn.member_id=? AND mrn.group_id=? ORDER BY mrn.member_id ASC';
        pool.query(sql, [memberId, groupId], function(err, results){
            if(err) throw err;
            let keyQuestionNumber=results[0].read_key_question_node.split(',').length-1;
            let ideaNumber=results[0].read_idea_node.split(',').length-1;
            let directiveObservationNumber=results[0].read_directive_observation_node.split(',').length-1;
            let operationalObservationNumber=results[0].read_operational_observation_node.split(',').length-1;
            let experimentNumber=results[0].read_experiment_node.split(',').length-1;
            let experimentRecordNumber=results[0].read_experiment_record_node.split(',').length-1;
            let attachmentNumber=results[0].read_attachment_node.split(',').length-1;
            let count=[];
            count.push({number: keyQuestionNumber, node_type: "key_question"});
            count.push({number: ideaNumber, node_type: "idea"});
            count.push({number: directiveObservationNumber, node_type: "directive_observation"});
            count.push({number: operationalObservationNumber, node_type: "operational_observation"});
            count.push({number: experimentNumber, node_type: "experiment"});
            count.push({number: experimentRecordNumber, node_type: "experiment_record"});
            count.push({number: attachmentNumber, node_type: "attachment"});
            let data={memberId: memberId, memberName: results[0].member_name, count: count}
            resolve(data);
        });
    });
}
function getGroupMemberList(groupId){
    return new Promise(function(resolve){
        let sql="SELECT member_id, read_node_list FROM `member_read_node` WHERE group_id=?";
        pool.query(sql, groupId, function(err, results){
            if(err) throw err;
            resolve(results);
        });        
    });    
}
function countMemberAddType(memberId, groupId){
    return new Promise(function(resolve){
        let sql= 'SELECT COUNT(node_id) AS number, node_type FROM `node` WHERE member_id=? AND group_id=? GROUP BY node_type';
        pool.query(sql, [memberId, groupId], function(err, results){
            if(err) throw err;
            let sql2='SELECT member_name FROM `member` WHERE member_id=?';
            pool.query(sql2, memberId, function(err, results2){
                if(err) throw err;
                let data= {memberId: memberId, memberName: results2[0].member_name, count: results}
                // console.log(data);
                resolve(data);
            });
        });
    });
}
function countMemberReviseType(memberId, groupId){
    return new Promise(function(resolve){
        let sql= 'SELECT SUM(node_revised_count) AS number, node_type FROM `node` WHERE member_id=? AND group_id=? GROUP BY node_type';
        pool.query(sql, [memberId, groupId], function(err, results){
            if(err) throw err;
            let sql2='SELECT member_name FROM `member` WHERE member_id=?';
            pool.query(sql2, memberId, function(err, results2){
                if(err) throw err;
                let data= {memberId: memberId, memberName: results2[0].member_name, count: results}
                // console.log(data);
                resolve(data);
            });
        });
    });
}
function countMemberBuildOnType(memberId, groupId){
    return new Promise(function(resolve){
        let sql= 'SELECT COUNT(n.node_id) AS number, node_type FROM `node` n INNER JOIN `edge` e ON n.node_id=e.edge_to WHERE n.member_id=? AND n.group_id=? GROUP BY n.node_type';
        pool.query(sql, [memberId, groupId], function(err, results){
            if(err) throw err;
            let sql2='SELECT member_name FROM `member` WHERE member_id=?';
            pool.query(sql2, memberId, function(err, results2){
                if(err) throw err;
                let data= {memberId: memberId, memberName: results2[0].member_name, count: results}
                // console.log(data);
                resolve(data);
            });
        });
    });
}
function countSaffoldType(memberId, groupId){
    return new Promise(function(resolve){
        let sql='SELECT i.idea_scaffold FROM `node` n INNER JOIN `idea` i ON n.node_id=i.node_id WHERE n.member_id=? AND n.group_id=? AND i.idea_scaffold IS NOT NULL';
        pool.query(sql, [memberId, groupId], function(err, results){
            if(err) throw err;
            let sql2='SELECT member_name FROM `member` WHERE member_id=?';
            pool.query(sql2, memberId, function(err, results2){
                if(err) throw err;
                let data= {memberId: memberId, memberName: results2[0].member_name, count: results}
                // console.log(data);
                resolve(data);
            });
        });
    });
}
function getGroupSharedFile(groupId){
    return new Promise(function(resolve){
        let sql='SELECT a.*, m.member_name, n.node_type, n.node_title FROM `attachment` a INNER JOIN `member` m ON a.member_id=m.member_id LEFT JOIN `node` n ON n.node_id=a.node_id WHERE a.group_id=? AND a.share=1';
        pool.query(sql, groupId, function(err, results){
            if(err) throw err;
            resolve(results);
        });
    });    
}
function getGroupPersonalFile(groupId, memberId){
    return new Promise(function(resolve){
        let sql='SELECT * FROM `attachment` WHERE group_id=? AND member_id=? AND share=0';
        pool.query(sql, [groupId, memberId], function(err, results){
            if(err) throw err;
            resolve(results);
        });
    }); 
}
function getAttachmentByNodeId(nodeId){
    return new Promise(function(resolve){
        let sql='SELECT * FROM `attachment` a INNER JOIN `member` m ON a.member_id=m.member_id WHERE a.node_id=?';
        pool.query(sql, nodeId, function(err, results){
            if(err) throw err;
            resolve(results);
        });
    });
}
function shareAttachment(attachmentId){
    return new Promise(function(resolve){
        let sql='UPDATE `attachment` SET share=1 WHERE attachment_id=?';
        pool.query(sql, attachmentId, function(err, results){
            if(err) throw err;
            let sql2= 'SELECT * FROM `attachment` a INNER JOIN `member` m ON a.member_id=m.member_id WHERE a.attachment_id=?';
            pool.query(sql2, attachmentId, function(err, results){
                if(err) throw err;
                resolve(results);
            });
        });
    });
}
module.exports = {
    checkTeacherGroupIdentity: function(memberId, groupId, activityId, cb){
        console.log("checkTeacherGroupIdentity: "+memberId+" "+groupId);
        let sql="SELECT * FROM `activity_group` WHERE member_id=? AND group_id=? AND activity_id=?";
        pool.query(sql, [memberId, groupId, activityId], function(err, results){
            if(err) throw err;
            console.log(results);
            if(results.length>0) return cb({checked: true});
            else return cb({checked: false});
        });
    },
    checkStudentGroupIdentity: function(memberId, groupId, activityId, cb){
        console.log("checkStudentGroupIdentity: "+memberId+" "+groupId);
        let sql="SELECT * FROM `activity_group` ag INNER JOIN `group_member` gm"
        +" ON ag.group_id=gm.group_id WHERE gm.member_id=? AND ag.group_id=? AND ag.activity_id=?";
        pool.query(sql, [memberId, groupId, activityId], function(err, results){
            if(err) throw err;
            console.log(results);
            if(results.length>0) return cb({checked: true});
            else return cb({checked: false});
        });
    },
    getGroupNode: function(groupId, cb){
        let sql="SELECT n.*, DATE_FORMAT(n.node_create_time, '%m-%d %T') AS create_time, COUNT(a.attachment_id) AS attachment_count FROM `node` n LEFT JOIN `attachment` a ON n.node_id=a.node_id WHERE n.group_id=? GROUP BY n.node_id";
        pool.query(sql, groupId, function(err, results){
            if(err) throw err;
            cb(results);
        });
    },
    getGroupEdge: function(groupId, cb){
        let sql="SELECT * FROM `edge`  WHERE group_id=?";
        pool.query(sql, groupId, function(err, results){
            if(err) throw err;
            cb(results);
        });
    },
    updateNodePosition: function(memberInfo, data, cb){
        // console.log(memberInfo);
        let dataString=JSON.stringify(data);
        dataString=dataString.replace(/{/g, "(");
        dataString=dataString.replace(/}/g, ")");  
        dataString=dataString.replace(/"node_id":/g,'');
        dataString=dataString.replace(/"x":/g,'');
        dataString=dataString.replace(/"y":/g,'');
        dataString=dataString.substring(1, dataString.length-1);
        // console.log(dataString);
        let sql="INSERT into `node` (node_id, x, y) VALUES "
        +dataString
        +" ON DUPLICATE KEY UPDATE x=VALUES(x),y=VALUES(y)";
        // console.log('sql = '+sql);
        pool.query(sql, function(err, results){
            if(err) throw err;
            cb('位置更新完成!');
        });
    },
    addIdeaNode: function(memberId, memberName, groupId, nodeTitle, ideaContent, countScaffold, fromNodeId, cb){
        var nodeId;
        newNode("idea", memberId, memberName, nodeTitle, groupId)
        .then(function(newNodeId){
            nodeId=newNodeId;
            return newIdea(nodeId, ideaContent, countScaffold);
        })
        .then(function(nodeId){       
            // console.log('data.fromNodeId: '+data.fromNodeId); 
            if(fromNodeId.length > 0){
                console.log('has fromId');
                let fromNode=fromNodeId.split(',');
                let promises = fromNode.map(function(nodeFrom){
                    return newEdge(nodeFrom, nodeId, groupId);
                })
                Promise.all(promises).then(function(data){
                   Promise.all([getNodeInfo(nodeId),getEdgeByEdgeTo(nodeId)])
                    .then(function(data){
                        cb({nodeData: data[0], edgeData: data[1]});
                    });
                });
            }else{
                getNodeInfo(nodeId).then(function(data){
                    cb({nodeData: data});
                });
            }            
        });
    },
    getIdeaNode: function(nodeId, memberId, groupId, cb){
        let check, attachmentData;
        addReadCount(nodeId, memberId, groupId, "idea")
        .then(function(){
            return checkFavorite(nodeId, memberId);
        })
        .then(function(data){
            check=data;
            return getNodeAttachment(nodeId);            
        }).then(function(data){
            attachmentData= data;
            // console.log(attachmentData);
            let sql="SELECT n.*,i.*, DATE_FORMAT(n.node_create_time, '%Y-%m-%d %T') AS create_time FROM `node` n INNER JOIN `idea` i ON n.node_id=i.node_id WHERE n.node_id=?";
            pool.query(sql, nodeId, function(err, results){
                if(err) throw err;
                cb({ideaData: results, checkFavorite: check.checked, attachmentData: attachmentData});
            });
        });        
    },
    editIdeaNode: function(nodeId, nodeTitle, ideaContent, countScaffold, cb){
        editNodeTitle(nodeId, nodeTitle)
        .then(function(){            
            return editIdea(nodeId, ideaContent, countScaffold);
        })
        .then(function(){
            return addRevisedCount(nodeId);
        })
        .then(function(){
            return getNodeInfo(nodeId);
        })
        .then(function(data){
            cb(data);
        });
    },
    addKeyQuestionNode: function(memberId,memberName, groupId, 
        nodeTitle, keyQuestionInfo, fromNodeId, cb){
        let nodeId;
        newNode("key_question", memberId, memberName, nodeTitle, groupId)
        .then(function(newNodeId){
            nodeId=newNodeId;
            return newKeyQuestion(nodeId, keyQuestionInfo);
        })
        .then(function(newNodeId){       
            // console.log('data.fromNodeId: '+data.fromNodeId); 
            if(fromNodeId.length > 0){
                console.log('has fromId');
                let fromNode=fromNodeId.split(',');
                let promises = fromNode.map(function(nodeFrom){
                    return newEdge(nodeFrom, nodeId, groupId);
                })
                Promise.all(promises).then(function(data){
                   Promise.all([getNodeInfo(nodeId),getEdgeByEdgeTo(nodeId)])
                    .then(function(data){
                        cb({nodeData: data[0], edgeData: data[1]});
                    });
                });
            }else{
                getNodeInfo(nodeId).then(function(data){
                    cb({nodeData: data});
                });
            }            
        });
    },
    getKeyQuestionNode: function(nodeId, memberId, groupId, cb){
        
        addReadCount(nodeId, memberId, groupId, "key_question").then(function(data){
            check=data;
            return getNodeAttachment(nodeId);            
        }).then(function(data){
            attachmentData= data;
            // console.log(attachmentData);
            let sql="SELECT n.*, kq.*, DATE_FORMAT(n.node_create_time, '%Y-%m-%d %T') AS create_time FROM `node` n INNER JOIN `key_question` kq ON n.node_id=kq.node_id WHERE n.node_id=?";
            pool.query(sql, nodeId, function(err, results){
                if(err) throw err;
                cb({keyQuestionData: results, attachmentData: attachmentData});
            });
        });  ;        
    },
    editKeyQuestionNode: function(nodeId, nodeTitle , keyQuestionInfo, cb){
        editNodeTitle(nodeId, nodeTitle)
        .then(function(){            
            return editKeyQuestion(nodeId, keyQuestionInfo);
        })
        .then(function(){
            return addRevisedCount(nodeId);
        })
        .then(function(){
            return getNodeInfo(nodeId);
        })
        .then(function(data){
            cb(data);
        });
    },
    addDirectiveObservationNode: function(memberInfo, data, cb){
        var nodeId;
        newNode("directive_observation", memberInfo.memberId, memberInfo.memberName, data.nodeTitle, memberInfo.groupId)
        .then(function(newNodeId){
            nodeId=newNodeId;
            return newDirectiveObservation(nodeId, data.directiveObservationInfo);
        })
        .then(function(nodeId){       
            if(data.fromNodeId.length > 0){
                console.log('has fromId');
                let fromNodeId=data.fromNodeId;
                let promises = fromNodeId.map(function(nodeFrom){
                    return newEdge(nodeFrom, nodeId, memberInfo.groupId);
                })
                Promise.all(promises).then(function(data){
                   Promise.all([getNodeInfo(nodeId),getEdgeByEdgeTo(nodeId)])
                    .then(function(data){
                        cb({nodeData: data[0], edgeData: data[1]});
                    });
                });
            }else{
                getNodeInfo(nodeId).then(function(data){
                    cb({nodeData: data});
                });
            }            
        });
    },
    getDirectiveObservationNode: function(nodeId, memberId, groupId, cb){
        addReadCount(nodeId, memberId, groupId, "directive_observation").then(function(){
            let sql="SELECT n.*, dov.*, DATE_FORMAT(n.node_create_time, '%Y-%m-%d %T') AS create_time FROM `node` n INNER JOIN `directive_observation` dov ON n.node_id=dov.node_id WHERE n.node_id=?";
            pool.query(sql, nodeId, function(err, results){
                if(err) throw err;
                cb(results);
            });
        });        
    },
    editDirectiveObservationNode: function(nodeId, nodeTitle , directiveObservationInfo, cb){
        editNodeTitle(nodeId, nodeTitle)
        .then(function(){            
            return editDirectiveObservation(nodeId, directiveObservationInfo);
        })
        .then(function(){
            return addRevisedCount(nodeId);
        })
        .then(function(){
            return getNodeInfo(nodeId);
        })
        .then(function(data){
            cb(data);
        });
    },
    addDirectiveObservationRecord: function(nodeId, memberId, directiveObservationRecord, cb){
        let sql='SELECT `directive_observation_id` FROM `directive_observation` WHERE node_id=?';
        pool.query(sql, nodeId, function(err, results){
            if(err) throw err;
            newDirectiveObservationRecord(memberId, results[0].directive_observation_id, directiveObservationRecord)
            .then(function(data){
                console.log(data);
                cb(data[0]);
            });
        });
    },
    getDirectiveObservationRecord: function(nodeId, cb){
        let sql="SELECT dovr.*, m.member_name FROM `node` n"
        +" INNER JOIN `directive_observation` dov ON n.node_id=dov.node_id"
        +" LEFT JOIN `directive_observation_record` dovr ON dov.directive_observation_id=dovr.directive_observation_id"
        +" INNER JOIN `member` m ON m.member_id=dovr.member_id"
        +" WHERE n.node_id=?";
        pool.query(sql, nodeId, function(err, results){
            if(err) throw err;
            cb(results);
        });
    },
    addOperationalObservationNode: function(memberInfo, data, cb){
        let nodeId;
        newNode("operational_observation", memberInfo.memberId, memberInfo.memberName, data.nodeTitle, memberInfo.groupId)
        .then(function(newNodeId){
            nodeId=newNodeId;
            return newOperationalObservation(nodeId, data.operationalObservationInfo, data.steps, data.materials);
        })
        .then(function(nodeId){       
            if(data.fromNodeId.length > 0){
                console.log('has fromId');
                let fromNodeId=data.fromNodeId;
                let promises = fromNodeId.map(function(nodeFrom){
                    return newEdge(nodeFrom, nodeId, memberInfo.groupId);
                })
                Promise.all(promises).then(function(data){
                   Promise.all([getNodeInfo(nodeId),getEdgeByEdgeTo(nodeId)])
                    .then(function(data){
                        cb({nodeData: data[0], edgeData: data[1]});
                    });
                });
            }else{
                getNodeInfo(nodeId).then(function(data){
                    cb({nodeData: data});
                });
            }            
        });
    },    
    editOperationalObservationNode: function(nodeId, nodeTitle , operationalObservationInfo, steps, materials, cb){
        editNodeTitle(nodeId, nodeTitle)
        .then(function(){            
            return editOperationalObservation(nodeId, operationalObservationInfo, steps, materials);
        })
        .then(function(){
            return addRevisedCount(nodeId);
        })
        .then(function(){
            return getNodeInfo(nodeId);
        })
        .then(function(data){
            cb(data);
        });
    },
    getOperationalObservationNode: function(nodeId, memberId, groupId, cb){
        addReadCount(nodeId, memberId, groupId, "operational_observation").then(function(){
            let sql="SELECT n.*, oov.*, DATE_FORMAT(n.node_create_time, '%Y-%m-%d %T') AS create_time FROM `node` n INNER JOIN `operational_observation` oov ON n.node_id=oov.node_id WHERE n.node_id=?";
            pool.query(sql, nodeId, function(err, results){
                if(err) throw err;
                cb(results);
            });
        });        
    },
    addOperationalObservationRecord: function(nodeId, memberId, operationalObservationRecord, cb){
        let sql='SELECT `operational_observation_id` FROM `operational_observation` WHERE node_id=?';
        pool.query(sql, nodeId, function(err, results){
            if(err) throw err;
            newOperationalObservationRecord(memberId, results[0].operational_observation_id, operationalObservationRecord)
            .then(function(data){
                console.log(data);
                cb(data[0]);
            });
        });
    },
    getOperationalObservationRecord: function(nodeId, cb){
        let sql="SELECT oovr.*, m.member_name FROM `node` n"
        +" INNER JOIN `operational_observation` oov ON n.node_id=oov.node_id"
        +" LEFT JOIN `operational_observation_record` oovr ON oov.operational_observation_id=oovr.operational_observation_id"
        +" INNER JOIN `member` m ON m.member_id=oovr.member_id"
        +" WHERE n.node_id=?";
        pool.query(sql, nodeId, function(err, results){
            if(err) throw err;
            cb(results);
        });
    },
    addExperimentNode: function(memberInfo, data, cb){
        var nodeId;
        newNode("experiment", memberInfo.memberId, memberInfo.memberName, data.nodeTitle, memberInfo.groupId)
        .then(function(newNodeId){
            nodeId=newNodeId;
            return newExperiment(nodeId, data.researchHypothesis, data.researchMotivation, memberInfo.memberName);
        })
        .then(function(nodeId){       
            // console.log('data.fromNodeId: '+data.fromNodeId); 
            if(data.fromNodeId.length > 0){
                console.log('has fromId');
                let fromNodeId=data.fromNodeId;
                let promises = fromNodeId.map(function(nodeFrom){
                    return newEdge(nodeFrom, nodeId, memberInfo.groupId);
                })
                Promise.all(promises).then(function(data){
                   Promise.all([getNodeInfo(nodeId),getEdgeByEdgeTo(nodeId)])
                    .then(function(data){
                        cb({nodeData: data[0], edgeData: data[1]});
                    });
                });
            }else{
                getNodeInfo(nodeId).then(function(data){
                    cb({nodeData: data});
                });
            }            
        });
    },
    getExperimentNode: function(nodeId, memberId, groupId, cb){
        addReadCount(nodeId, memberId, groupId, "experiment").then(function(){
            let sql="SELECT n.*, e.*, DATE_FORMAT(n.node_create_time, '%Y-%m-%d %T') AS create_time FROM `node` n INNER JOIN `experiment` e ON n.node_id=e.node_id WHERE n.node_id=?";
            pool.query(sql, nodeId, function(err, results){
                if(err) throw err;
                cb(results);
            });
        });
    },
    editExperimentNode: function(nodeId, nodeTitle , researchHypothesis, researchMotivation, cb){
        editNodeTitle(nodeId, nodeTitle)
        .then(function(){            
            return editExperiment(nodeId, researchHypothesis, researchMotivation);
        })
        .then(function(){
            return addRevisedCount(nodeId);
        })
        .then(function(){
            return getNodeInfo(nodeId);
        })
        .then(function(data){
            cb(data);
        });
    },
    saveExperimentDesign: function(memberName, nodeId, steps, materials, cb){
        console.log(memberName+' '+nodeId+' '+steps+' '+materials);
        let sql= "UPDATE `experiment` SET last_editor=?, steps=?, materials=? WHERE node_id=?";
        pool.query(sql, [memberName, steps, materials, nodeId], function(err, results){
            cb(memberName);
        });
    },
    addExperimentRecordNode: function(memberInfo, data, cb){
        var nodeId;
        newNode("experiment_record", memberInfo.memberId, memberInfo.memberName, data.nodeTitle, memberInfo.groupId)
        .then(function(newNodeId){
            nodeId= newNodeId;
            return updateExperimentRecordNodeId(nodeId, data.fromNodeId[0]);
        }).then(function(){       
            console.log('has fromId');
            let fromNodeId=data.fromNodeId[0];
            return newEdge(fromNodeId, nodeId, memberInfo.groupId);
        }).then(function(){
            Promise.all([getNodeInfo(nodeId),getEdgeByEdgeTo(nodeId)])
            .then(function(data){
                cb({nodeData: data[0], edgeData: data[1]});
            });
        });
    },
    getExperimentRecordNode: function(nodeId, memberId, groupId, cb){
        let sql='SELECT node_id FROM `experiment` WHERE experiment_record_node_id=?';
        pool.query(sql, nodeId, function(err, results){
            if(err) throw err;
            let experimentNodeId= results[0].node_id;
            console.log(experimentNodeId);
            addReadCount(experimentNodeId, memberId, groupId, "experiment_record").then(function(){
                let sql="SELECT m.member_name, e.*, er.*, n.node_title, n.node_author, n.node_create_time, n.node_read_count, DATE_FORMAT(n.node_create_time, '%Y-%m-%d %T') AS create_time FROM `experiment` e INNER JOIN `node` n ON n.node_id=e.node_id LEFT JOIN `experiment_record` er ON e.experiment_record_node_id=er.node_id LEFT JOIN `member` m ON m.member_id=er.member_id WHERE e.node_id=?";
                pool.query(sql, experimentNodeId, function(err, results){
                    if(err) throw err;
                    cb(results);
                });
            });
        });   
    },
    addExperimentRecord: function(nodeId, memberId, experimentRecord, cb){
        let sql='SELECT `experiment_id` FROM `experiment` WHERE experiment_record_node_id=?';
        pool.query(sql, nodeId, function(err, results){
            if(err) throw err;
            newExperimentRecord(memberId, nodeId, results[0].experiment_id, experimentRecord)
            .then(function(data){
                console.log(data);
                cb(data[0]);
            });
        });
    },
    addRiseAboveNode: function(memberInfo, data, cb){
        var nodeId;
        newNode("rise_above", memberInfo.memberId, memberInfo.memberName, data.nodeTitle, memberInfo.groupId)
        .then(function(newNodeId){
            nodeId=newNodeId;
            return newIdea(nodeId, data.riseAboveContent, data.countScaffold);
        })
        .then(function(nodeId){       
            // console.log('data.fromNodeId: '+data.fromNodeId); 
            if(data.fromNodeId.length > 0){
                console.log('has fromId');
                let fromNodeId=data.fromNodeId;
                let promises = fromNodeId.map(function(nodeFrom){
                    return newEdge(nodeFrom, nodeId, memberInfo.groupId);
                })
                Promise.all(promises).then(function(data){
                   Promise.all([getNodeInfo(nodeId),getEdgeByEdgeTo(nodeId)])
                    .then(function(data){
                        cb({nodeData: data[0], edgeData: data[1]});
                    });
                });
            }else{
                getNodeInfo(nodeId).then(function(data){
                    cb({nodeData: data});
                });
            }            
        });
    },
    addAttachmentNode: function(memberId, memberName, groupId, attachmentName, attachmentType, cb){
        let newNodeId, nodeData;
        newNode("attachment", memberId, memberName, attachmentName, groupId).then(function(nodeId){
            newNodeId= nodeId;
            return newAttachment(nodeId, attachmentName, attachmentType, 1, memberId, groupId);
        }).then(function(attachmentId){       
            return getNodeInfo(newNodeId);          
        }).then(function(data){
            console.log('==getNodeInfo==');
            console.log(data);
            nodeData= data;
            return getAttachmentByNodeId(newNodeId);
        }).then(function(data){
            console.log('==after getAttachmentByNodeId==');
            console.log(nodeData);
            cb({nodeData: nodeData, attachmentData: data})
        });
    },    
    getAttachmentNode: function(nodeId, memberId, groupId, cb){
        addReadCount(nodeId, memberId, groupId, "attachment").then(function(){
            let sql="SELECT * FROM `node` n INNER JOIN `attachment` a ON n.node_id=a.node_id WHERE n.node_id=?";
            pool.query(sql, nodeId, function(err, results){
                if(err) throw err;
                cb(results);
            });
        }); 
    },    
    addFavorite: function(nodeId, memberId, groupId, cb){
        let sql="INSERT INTO `favorite_idea` SET?";
        let sqlValue={
            node_id: nodeId,
            member_id :memberId,
            group_id: groupId
        }
        pool.query(sql, sqlValue, function(err){
            if(err) throw err;
            cb({finished: true});
        });
    },
    removeFavorite: function(nodeId, memberId, cb){
        let sql="DELETE FROM `favorite_idea` WHERE node_id=? AND member_id=?";
        pool.query(sql, [nodeId, memberId], function(err){
            if(err) throw err;
            cb({finished: true});
        });

    },
    getGroupPractice: function(groupId, cb){
        let directiveObservationData, operationalObservationData, experimentData;
        let sql="SELECT n.*,dov.*, DATE_FORMAT(n.node_create_time, '%Y-%m-%d %T') AS create_time FROM `node` n INNER JOIN `directive_observation` dov"
        +" ON n.node_id=dov.node_id WHERE n.group_id=?"
        let sql2="SELECT n.*,oov.*, DATE_FORMAT(n.node_create_time, '%Y-%m-%d %T') AS create_time FROM `node` n INNER JOIN `operational_observation` oov"
        +" ON n.node_id=oov.node_id WHERE n.group_id=?";
        let sql3="SELECT n.*, e.*, DATE_FORMAT(n.node_create_time, '%Y-%m-%d %T') AS create_time FROM `node` n INNER JOIN `experiment` e"
        +" ON n.node_id=e.node_id WHERE n.group_id=?";
        pool.query(sql, groupId, function(err, results1){
            if(err) throw err;
            pool.query(sql2, groupId, function(err, results2){
                if(err) throw err;
                pool.query(sql3, groupId, function(err, results3){
                    if(err) throw err;
                    getGroupDirectiveObservation(groupId).then(function(data){
                        directiveObservationData= data;
                        return getGroupOperationalObservation(groupId);                        
                    }).then(function(data){
                        operationalObservationData= data;
                        return getGroupExperiment(groupId);                        
                    }).then(function(data){
                        experimentData= data;
                        cb({
                            directiveObservationList: results1,
                            operationalObservationList: results2,
                            experimentList: results3,
                            directiveObservationData: directiveObservationData,
                            operationalObservationData: operationalObservationData,
                            experimentData: experimentData
                        });
                    });
                })
            })
        })
        // let sql="SELECT node_id, node_title, node_type FROM `node` WHERE group_id=? AND node_type IN ('directive_observation', 'operational_observation', 'experiment')ORDER BY node_type, node_id ASC";
        // pool.query(sql, groupId, function(err, results){
        //     if(err) throw err;
        //     getGroupDirectiveObservation(groupId).then(function(directiveObservationData){
        //         cb({practiceData: results, directiveObservationData: directiveObservationData});
        //     });
        // });
    },
    getGroupIdeaAction: function(groupId, cb){
        let groupMemberListData;
        let addNodeData, buildOnNodeData, reviseNodeData, viewNodeData;
        // let addNodeDataList=[], buildOnNodeDataList=[], reviseNodeDataList=[], viewNodeDataList=[]; 
        getGroupMemberList(groupId).then(function(memberList){
            groupMemberListData= memberList;
            let temp= groupMemberListData;
            let viewNodeDataList= temp.map(function(value){
                return countMemberViewType(value.member_id, groupId); 
            });
            return Promise.all(viewNodeDataList);
        }).then(function(data){
            viewNodeData= data;
            // console.log(viewNodeData);
            let temp= groupMemberListData;
            let addNodeDataList= temp.map(function(value){
                return countMemberAddType(value.member_id, groupId); 
            });
            return Promise.all(addNodeDataList);
        }).then(function(data){
            addNodeData= data;
            // console.log(addNodeData);
            let temp= groupMemberListData;
            let reviseNodeDataList= temp.map(function(value){
                return countMemberReviseType(value.member_id, groupId); 
            });
            return Promise.all(reviseNodeDataList);
        }).then(function(data){
            reviseNodeData= data;
            // console.log(reviseNodeData);
            let temp= groupMemberListData;
            let buildOnNodeDataList= temp.map(function(value){
                return countMemberBuildOnType(value.member_id, groupId); 
            });
            return Promise.all(buildOnNodeDataList);
        }).then(function(data){
            buildOnNodeData= data;
            // console.log(buildOnNodeData);
            cb({addNodeData: addNodeData, viewNodeData, viewNodeData, reviseNodeData: reviseNodeData, buildOnNodeData: buildOnNodeData});
        });
    },
    getGroupIdeaScaffold: function(groupId, cb){
        getGroupMemberList(groupId).then(function(memberList){
             let scaffolfDataList= memberList.map(function(value){
                return countSaffoldType(value.member_id, groupId); 
            });
            return Promise.all(scaffolfDataList);
        }).then(function(data){
            cb(data);
        });
    },
    getGroupIdeaIncrease: function(groupId, cb){
        let sql= 'SELECT DATE_FORMAT(n.node_create_time, "%Y-%m-%d") AS day, n.member_id, n.node_author, count(*) AS node_count'
        +' FROM `node` n INNER JOIN `member` m ON n.member_id=m.member_id'
        +' WHERE n.group_id=? AND (n.node_type= "idea" || n.node_type= "rise_above") AND m.member_identity="學生"'
        +' GROUP BY n.member_id, DATE_FORMAT(n.node_create_time, "%Y-%m-%d")';
        pool.query(sql, groupId, function(err, results){
            if(err) throw err;
            cb(results);
        });
    },
    getPersonalFavoriteIdea: function(groupId, memberId, cb){
        let sql= 'SELECT fi.*, n.node_title, n.node_author, n.node_create_time, i.idea_content'
        +' FROM `favorite_idea` fi INNER JOIN `node` n ON n.node_id=fi.node_id'
        +' INNER JOIN `idea` i ON n.node_id=i.node_id'
        +' WHERE fi.member_id=? AND fi.group_id=?';
        pool.query(sql, [memberId,groupId], function(err, results){
            if(err) throw err;
            cb(results);
        });
    },
    getPersonalNote: function(groupId, memberId, cb){
        let sql='SELECT * FROM `personal_note` WHERE group_id=? AND member_id=?';
        pool.query(sql, [groupId, memberId], function(err, results){
            if(err) throw err;
            cb(results[0]);
        });
    },
    savePersonalNote: function(groupId, memberId, noteContent, cb){
        let sql='UPDATE `personal_note` SET note_content=? WHERE group_id=? AND member_id=?';
        pool.query(sql, [noteContent, groupId, memberId], function(err, results){
            if(err) throw err;
            cb({finished: true});
        });
    },
    getFileByGroup: function(groupId, memberId, cb){
        let groupSharedFile, personalFile;
        getGroupSharedFile(groupId).then(function(data){
            groupSharedFile= data;
            console.log(groupSharedFile);
            return getGroupPersonalFile(groupId, memberId);
        }).then(function(data){
            personalFile= data;
            console.log(personalFile);
            cb({groupSharedFileData: groupSharedFile, personalFileData: personalFile});
        });
    },
    addAttachment: function(nodeId, share, memberId, groupId, attachmentName, attachmentType, cb){
        newAttachment(nodeId, attachmentName, attachmentType, share, memberId, groupId)
        .then(function(attachmentId){
            let sql='SELECT * FROM `attachment` a INNER JOIN `member` m ON a.member_id=m.member_id WHERE a.attachment_id=?';
            pool.query(sql, attachmentId, function(err, results){
                if(err) throw err;
                cb(results);
            });
        });
    },
    removePersonalAttachment: function(attachmentId, cb){
        console.log(attachmentId);
        let sql='DELETE FROM `attachment` WHERE attachment_id=?';
        pool.query(sql, attachmentId, function(err){
            if(err) throw err;
            cb({finished: true});
        });
    },
    sharePersonalAttachmentToGroup: function(attachmentId, cb){
        shareAttachment(attachmentId).then(function(data){
            cb(data);
        });
    },
    checkAttachmentExist: function(attachmentName, groupId, cb){
        let sql= 'SELECT * FROM `attachment` WHERE attachment_name=? AND group_id=?';
        pool.query(sql, [attachmentName, groupId], function(err, results){
            if(err) throw err;
            console.log(results);
            let exists=(results.length>0?true:false);
            cb(exists);
        });
    },
    addGroupKeyQuestionNode: function(memberId,memberName, groupId, 
        nodeTitle, keyQuestionInfo){
            return new Promise(function(resolve){
                let nodeId;
                newNode("key_question", memberId, memberName, nodeTitle, groupId)
                .then(function(newNodeId){
                    nodeId=newNodeId;
                    return newKeyQuestion(nodeId, keyQuestionInfo);
                })
                .then(function(newNodeId){
                    getNodeInfo(nodeId).then(function(data){
                        resolve(data[0]);
                    });
                });
            });        
    },
    addGroupIdeaNode: function(memberId,memberName, groupId, 
        nodeTitle, ideaContent){
            return new Promise(function(resolve){
                let nodeId;
                newNode("idea", memberId, memberName, nodeTitle, groupId)
                .then(function(newNodeId){
                    nodeId=newNodeId;
                    return newIdea(nodeId, ideaContent);
                })
                .then(function(newNodeId){
                    getNodeInfo(nodeId).then(function(data){
                        resolve(data[0]);
                    });
                });
            });        
    },
    addGroupDirectiveObservationNode: function(memberId,memberName, groupId, 
        nodeTitle, directiveObservationInfo){
            return new Promise(function(resolve){
                let nodeId;
                newNode("directive_observation", memberId, memberName, nodeTitle, groupId)
                .then(function(newNodeId){
                    nodeId=newNodeId;
                    return newDirectiveObservation(nodeId, directiveObservationInfo);
                })
                .then(function(newNodeId){
                    getNodeInfo(nodeId).then(function(data){
                        resolve(data[0]);
                    });
                });
            });        
    },
    addGroupOperationalObservationNode: function(memberId,memberName, groupId, 
        nodeTitle, operatioanlObservationInfo, steps, materials){
            return new Promise(function(resolve){
                let nodeId;
                newNode("operational_observation", memberId, memberName, nodeTitle, groupId)
                .then(function(newNodeId){
                    nodeId=newNodeId;
                    return newOperationalObservation(nodeId, operatioanlObservationInfo, steps, materials);
                })
                .then(function(newNodeId){
                    getNodeInfo(nodeId).then(function(data){
                        resolve(data[0]);
                    });
                });
            });        
    },
    addGroupExperimentNode: function(memberId,memberName, groupId, 
        nodeTitle, researchHypothesis, researchMotivation){
            return new Promise(function(resolve){
                let nodeId;
                newNode("experiment", memberId, memberName, nodeTitle, groupId)
                .then(function(newNodeId){
                    nodeId=newNodeId;
                    return newExperiment(nodeId, researchHypothesis, researchMotivation, memberName);
                })
                .then(function(newNodeId){
                    getNodeInfo(nodeId).then(function(data){
                        resolve(data[0]);
                    });
                });
            });        
    },
    getGroupNameById: function(groupId){
        return new Promise(function(resolve){
            let sql= 'SELECT group_name FROM `activity_group` WHERE group_id=?';
            pool.query(sql, groupId, function(err, results){
                if(err) throw err;
                resolve(results[0].group_name);
            });
        });
    },
    getBroadcastByGroup: function(groupId){
        return new Promise(function(resolve){
            let sql= 'SELECT *, DATE_FORMAT(broadcast_time, "%Y-%m-%d %T") AS time  FROM `broadcast` WHERE broadcast_group_id=? ORDER BY broadcast_time DESC LIMIT 5';
            pool.query(sql, groupId, function(err, results){
                if(err) throw err;
                console.log(results);
                resolve(results);
            });
        });        
    },
    editRecord: function(recordType, recordId, recordContent){
        return new Promise(function(resolve){
            let sql= 'UPDATE `'+recordType+'_record` SET '+recordType+'_record=? WHERE '+recordType+'_record_id=?';
            console.log(sql);
            pool.query(sql, [recordContent, recordId], function(err, results){
                if(err) throw err;
                let sql2= 'SELECT *, '+recordType+'_record AS record, '+recordType+'_record_id AS record_id, DATE_FORMAT('+recordType+'_record_create_time, "%Y-%m-%d %T") AS record_create_time  FROM `'+recordType+'_record` WHERE '+recordType+'_record_id=?';
                console.log(sql2);
                pool.query(sql2, recordId, function(err, results){
                    if(err) throw err;
                    resolve(results[0]);
                });
            });
        });
    },
    removeRecord: function(recordType, recordId){
        return new Promise(function(resolve){
            let type= recordType+'_record';
            let sql= 'DELETE FROM `'+type+'` WHERE '+type+'_id=?';
            console.log(sql);
            pool.query(sql, recordId, function(err, results){
                if(err) throw err;
                resolve(recordId);
            });
        });
    }
}