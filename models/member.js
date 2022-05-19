var pool = require('./db');

module.exports = {
    login: function(account, password, identity, cb){
        let sql="SELECT * FROM `member` WHERE member_account=? AND member_password=? AND member_identity=?";
        pool.query(sql,[account, password, identity], function(err, results){
            if(err) throw err;
            cb(results);
        });
    },
    regist: function(account, password, name, identity, city, school, cb){
        console.log(password);
        let sql="SELECT * FROM `member` WHERE member_account=? AND member_identity=?";
        pool.query(sql, [account, identity], function(err, results){
            if(err) throw err;
            if(results.length > 0){
                cb({"existed": true})
            }else{
                let sql2="INSERT INTO `member` SET ?";
                let sqlValue2={
                    member_account: account,
                    member_password: password,
                    member_identity: identity,
                    member_name: name,
                    member_city: city,
                    member_school: school
                }
                pool.query(sql2, sqlValue2, function(err, results2){
                    if(err) throw err;
                    console.log(results2.insertId);
                    cb({"existed": false, "data": results2.insertId});
                })
            }
        });
    }
}