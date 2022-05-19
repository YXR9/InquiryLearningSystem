var pool = require('./db');
var fs = require('fs');

function getGroupData(group_id){
    return new Promise(function(resolve, reject){
        let sql="SELECT ag.*, GROUP_CONCAT(m.member_name) AS group_members FROM `activity_group` ag "
        +"LEFT JOIN `group_member` gm ON ag.group_id=gm.group_id "
        +"LEFT JOIN `member` m ON gm.member_id=m.member_id "
        +"WHERE ag.group_id=? GROUP BY ag.group_id";
        pool.query(sql, group_id, function(err, results){
            if(err) throw err;
            resolve(results[0]);
        });
    });
}
function makerandomkey(letter,number) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (var i=0; i<letter; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    possible = "0123456789";
    for(var i=0; i<number; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}
function newFolder(group_id){
    if(!fs.existsSync('./public/files/group'+group_id)){
        fs.mkdirSync('./public/files/group'+group_id, {recursive: true}, (err)=>{
            if(err) throw err;
        });
    }
}
function getGroupStudentData(group_id){
    return new Promise(function(resolve, reject){
        let sql="SELECT ag.group_id, ag.group_name, GROUP_CONCAT(m.member_name) AS group_members FROM `activity_group` ag "
        +"LEFT JOIN `group_member` gm ON ag.group_id=gm.group_id "
        +"LEFT JOIN `member` m ON gm.member_id=m.member_id "
        +"WHERE ag.group_id=? GROUP BY ag.group_id";
        pool.query(sql, group_id, function(err, results){
            if(err) throw err;
            resolve(results);
        });
    });
}
function getGroupTeacherData(group_id){
    return new Promise(function(resolve, reject){
        let sql="SELECT a.activity_id, a.activity_title, a.activity_info, DATE_FORMAT(create_time, '%Y-%m-%d %T') AS activity_create_time, ag.group_id, m.member_name AS teacher_name, m.member_id AS teacher_id "
        +"FROM `activity` a "
        +"LEFT JOIN `activity_group` ag ON ag.activity_id=a.activity_id "
        +"LEFT JOIN `member` m ON m.member_id=a.member_id "
        +"WHERE ag.group_id=?";
        pool.query(sql, group_id, function(err, results){
            if(err) throw err;
            resolve(results);
        });
    });
}
function teacherPersonalNoteInGroup(groupId, memberId){
    return new Promise(function(resolve){
        let sql='INSERT INTO `personal_note` SET group_id=?, member_id=?';
        pool.query(sql, [groupId, memberId], function(err, results){
            if(err) throw err;
            resolve({finished: true});
        });
    });
}
module.exports = {
    checkActivityIdentity: function(memberId, activityId, cb){
        console.log("checkActivityIdentity: "+memberId+" "+activityId);
        let sql="SELECT * FROM `activity` WHERE member_id=? AND activity_id=?";
        pool.query(sql, [memberId, activityId], function(err, results){
            if(err) throw err;
            console.log(results);
            if(results.length > 0) cb({checked: true});
            else cb({checked: false});
        });
    },
    getTeacherActivity: function(memberId, cb){
        let sql=["SELECT a.*, COUNT(DISTINCT(g.group_id)) AS group_count,",
        "COUNT(DISTINCT(gm.member_id)) AS member_count,",
        "DATE_FORMAT(a.create_time, '%Y-%m-%d %T') AS activity_create_time",
        "FROM `activity` a LEFT JOIN `activity_group` g ON a.activity_id = g.activity_id",
        "LEFT JOIN `group_member` gm ON g.group_id = gm.group_id",
        "WHERE a.member_id=? GROUP BY activity_id"].join(' ');
        pool.query(sql, memberId, function(err, results){
            if(err) throw err;
            cb(results);
        });
    },
    addActivity: function(memberId, activityTitle, activityInfo, activityGroupNumber, cb){
        let newActivityId;
        let sqlValue = {
            member_id: memberId,
            activity_title: activityTitle,
            activity_info: activityInfo,
        }
        let sql="INSERT INTO `activity` SET?";
        pool.query(sql, sqlValue, function(err, results){
            if(err) throw err;
            console.log("Inserted id= "+results.insertId);
            newActivityId = results.insertId;
            let sqlValue2 = [];
            let sql2 = "INSERT INTO `activity_group` (`activity_id`, `member_id`, `group_name`, `group_key`) VALUES ?";
            for(let i=0;i<activityGroupNumber;i++){
                let randomKey=makerandomkey(4,5);
                sqlValue2.push([
                    newActivityId,
                    memberId,
                    "第"+(i+1)+"組",
                    randomKey
                ]);            
            }
            pool.query(sql2, [sqlValue2], function(err, results2){
                if(err) throw err; 
                var sql3="SELECT a.*, COUNT(a.activity_id) AS group_count FROM `activity` a INNER JOIN `activity_group` g ON a.activity_id = g.activity_id WHERE a.member_id=? GROUP BY activity_id";
                pool.query(sql3, memberId, function(err, results3){
                    if(err) throw err;
                    console.log(results3);
                    var sql4="SELECT ag.group_id FROM `activity` a INNER JOIN `activity_group` ag ON a.activity_id=ag.activity_id WHERE a.activity_id=?";
                    pool.query(sql4, newActivityId , function(err, results4){
                        if(err) throw err;
                        console.log(results4);
                        results4.forEach(function(item){
                            newFolder(item.group_id);                            
                        });
                        let promises= results4.map(function(group){
                            return teacherPersonalNoteInGroup(group.group_id, memberId);
                        });
                        Promise.all(promises).then(function(data){
                            cb("建立活動成功");
                        });
                    });
                });
            });
            
        });
    },
    getActivityInfo: function(activityId, cb){
        let sql="SELECT * FROM `activity` a WHERE a.activity_id=?";
        pool.query(sql, activityId, function(err, results){
            if(err) throw err;
            cb(results);
        });
    },
    getActivityGroup: function(activityId, cb){
        let groupData=[];
        let sql="SELECT group_id FROM `activity_group` WHERE activity_id=?";
        pool.query(sql, activityId, function(err, results){  
            if(err) throw err;
            let groupPromises = results.map(function(group){
                return getGroupData(group.group_id)
                .then(function(data){
                    groupData.push(data);                
                });
            });
            Promise.all(groupPromises)
            .then(function(){
                groupData.sort(function(a,b){return a.group_id - b.group_id});//將groupData從小排到大
                cb(groupData);
            });
        });
    },
    addGroup: function(activityId, memberId, groupNumber, currentGroupNumber, cb){        
        let sql="INSERT INTO `activity_group` (`activity_id`, `member_id`, `group_name`, `group_key`) VALUES ?";
        let sqlValue=[];
        console.log(groupNumber+"  "+currentGroupNumber);
        for(let i=0;i<groupNumber;i++){
            sqlValue.push([
                activityId,
                memberId,
                "第"+(currentGroupNumber+i+1)+"組",
                makerandomkey(4,5)
            ]);
        }
        pool.query(sql, [sqlValue], function(err, results){
            if(err) throw err;
            let sql2="SELECT ag.group_id FROM `activity` a INNER JOIN `activity_group` ag ON a.activity_id=ag.activity_id WHERE a.activity_id=?";
            pool.query(sql2, activityId, function(err, results2){
                if(err) throw err;
                console.log(results2);
                results2.forEach(function(item, index){
                    newFolder(item.group_id);
                });
                let promises= results2.map(function(group){
                    return teacherPersonalNoteInGroup(group.group_id, memberId);
                });
                Promise.all(promises).then(function(data){
                    cb("新增小組成功");
                });
            });
        }); 
    },
    getGroup: function(groupId, cb){
        let sql="SELECT * FROM `activity_group` ag WHERE ag.group_id=?";
        pool.query(sql, groupId, function(err, results){
            if(err) throw err;
            cb(results);
        });
    },
    joinGroup: function(groupKey, memberId, cb){
        //確認該小組代碼是否存在
        let sql="SELECT group_id, activity_id FROM `activity_group` WHERE group_key=?";
        pool.query(sql, groupKey, function(err, results){
            if(err) throw err;
            if(results.length > 0){
                let groupId=results[0].group_id;     
                let activityId=results[0].activity_id;    
                //取得該活動下全部的小組
                let sql2="SELECT a.activity_title,ag.group_id FROM `activity_group` ag INNER JOIN `activity` a ON a.activity_id=ag.activity_id WHERE ag.activity_id=?";
                pool.query(sql2, activityId, function(err, results2){
                    if(err) throw err;
                    let activityTitle= results2[0].activity_title;
                    let groupFilter='(';
                    for(let i=0;i<results2.length;i++){
                        groupFilter += results2[i].group_id.toString();
                        if(i<results2.length-1) groupFilter += ',';
                    }
                    groupFilter.substring(0, groupFilter.length-1);
                    groupFilter+=')';
                    //確認該小組成員是否已加入活動
                    let sql3="SELECT * FROM `group_member` WHERE member_id=? AND group_id IN "+groupFilter;
                    pool.query(sql3, memberId, function(err, results3){
                        if(err) throw err;
                        //尚未加入活動任一小組
                        if(results3.length < 1){                            
                            let sql4="INSERT INTO `group_member` SET ?";
                            let sqlValue4={
                                group_id: groupId,
                                member_id: memberId
                            }
                            pool.query(sql4, sqlValue4, function(err){
                                if(err) throw err;
                                let sql5="INSERT INTO `member_read_node` SET ?";
                                let sqlValue5={
                                    group_id: groupId,
                                    member_id: memberId,
                                    read_node_list: "-1",
                                    read_idea_node: "-1",
                                    read_key_question_node: "-1",
                                    read_directive_observation_node: "-1",
                                    read_operational_observation_node: "-1",
                                    read_experiment_node: "-1",
                                    read_experiment_record_node: "-1",
                                    read_attachment_node: "-1"
                                }
                                pool.query(sql5, sqlValue5, function(err){
                                    if(err) throw err;
                                    let sql6='INSERT INTO `personal_note` SET group_id=?, member_id=?';
                                    pool.query(sql6, [groupId, memberId], function(err, results){
                                       if(err) throw err;
                                       cb({state: true, msg: "成功加入小組！"});
                                    });
                                });
                            });
                        }else{
                            cb({state: false, msg: "您已經加入這活動其中一小組囉！"});
                        }
                    });  
                });
                             
            }else{
                cb({state: false, msg: "小組代碼錯誤"});
            }
        });
    },
    getJoinedGroup: function(memberId, cb){
        let sql="SELECT group_id FROM `group_member` gm WHERE gm.member_id=? ORDER BY gm.group_id DESC";
        pool.query(sql, memberId, function(err, results){
            if(err) throw err;
            let groupStudentData=[];
            let groupTeacherData=[];
            var studentPromises = results.map(function(group){
                return getGroupStudentData(group.group_id)
                .then(function(data){
                    groupStudentData.push(data[0]);                
                });
            });
            var teacherPromises = results.map(function(group){
                return getGroupTeacherData(group.group_id)
                .then(function(data){
                    groupTeacherData.push(data[0]);
                });
            });        
            Promise.all(studentPromises, teacherPromises)
            .then(function(){
                groupStudentData.sort(function(a,b){return b.group_id-a.group_id});
                groupTeacherData.sort(function(a,b){return b.group_id-a.group_id});
                cb({studentData: groupStudentData, teacherData: groupTeacherData});
            });
        });
    },
    getBroadcastByActivity: function(activityId, memberId){
        return new Promise(function(resolve){
            let sql= 'SELECT *, DATE_FORMAT(broadcast_time, "%Y-%m-%d %T") AS create_time, GROUP_CONCAT(broadcast_group_name) AS group_name, GROUP_CONCAT(broadcast_group_id) AS group_id, GROUP_CONCAT(broadcast_node_id) AS node_id FROM `broadcast` WHERE broadcast_activity_id=? AND member_id=? GROUP BY broadcast_message, broadcast_type ORDER BY broadcast_time DESC';
            pool.query(sql, [activityId, memberId], function(err, results){
                if(err) throw err;
                resolve(results);
            });
        });
    },
    addBroadcast: function(message, type, activityId, groupId, groupName, nodeId, memberId){
        return new Promise(function(resolve){
            let sql= 'INSERT INTO `broadcast` SET ?';
            let sqlValue= {                
                broadcast_message: message,
                broadcast_type: type,
                broadcast_activity_id: activityId,
                broadcast_group_id: groupId,
                broadcast_group_name: groupName,
                broadcast_node_id: nodeId,
                member_id: memberId
            }
            pool.query(sql, sqlValue, function(err, results){
                if(err) throw err;
                let newBroadcastId= results.insertId;
                console.log('newBroadcastId: '+newBroadcastId);
                let sql2= 'SELECT * FROM `broadcast` WHERE broadcast_id=?';
                pool.query(sql2, newBroadcastId, function(err, results){
                    if(err) throw err;
                    console.log(results);
                    resolve(results[0]);
                });                
            });
        });
    }
}