var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var groupData = require('./models/group_data');
var activityData = require('./models/activity_data');

var app = express();
var server = require('http').Server(app);
server.listen(8000, function () {
  console.log('server listening on port 8000');
});
var io = require('socket.io')(server);

function isRoomExist (roomName, roomList) {
  return roomList[roomName] >= 0;
}
function isMemberInRoom(memberId, roomName, roomList){
  console.log(roomList[roomName].indexOf(memberId));
  return roomList[roomName].indexOf(memberId);
}
function logIoSocketsClients(clients){
  console.log('=io.sockets.clients()=');
  console.log(clients);
  console.log('========================');
}
function logIoRooms(rooms){
  console.log('=io.rooms=');
  console.log(rooms);
  console.log('========================');
}
function logSocketRooms(rooms){
  console.log('=Object.keys(socket.rooms)=');
  console.log(rooms);
  console.log('========================');
}
io.on('connection', function(socket){    
  socket.on('disconnect', function () {
    console.log('<disconnect>');
    // logSocketRooms(Object.keys(socket.rooms));
    // logIoRooms(io.rooms);
    // logIoSocketsClients(io.sockets.clients());
  });
  //將會員加入socket-room
  socket.on('join room', function (data) {
    console.log('<join room>');
    socket.memberId=data.memberId;
    let roomName='group'+data.groupId;
    socket.join(roomName, function(){
      // logSocketRooms(Object.keys(socket.rooms));
      // logIoRooms(io.rooms);
      // logIoSocketsClients(io.sockets.clients());      
      io.of('/').in(roomName).clients(function(error,clients){
        var numClients=clients.length;
        console.log(roomName+': '+numClients);
      });
    });
  });
  socket.on('broadcast message', function(data){
    console.log(data);
    let roomName= 'group'+data.groupId;
    socket.nsp.to(roomName).emit('receive broadcast message', data.broadcastMessage);
  });
  socket.on('add node', function(data){
    console.log(data);
    let roomName='group'+data.memberInfo.groupId;
    if(data.nodeData.length>0){
      socket.nsp.to(roomName).emit('update node data', data.nodeData);
    }
  });
  socket.on('add edge', function(data){
    console.log(data);
    let roomName='group'+data.memberInfo.groupId;
    if(data.edgeData.length>0){
      socket.nsp.to(roomName).emit('update edge data', data.edgeData);
    }
  });
  socket.on('add idea', function(data){
    console.log(data);
    let roomName='group'+data.memberInfo.groupId;
    if(data.nodeData.length>0){
      socket.nsp.to(roomName).emit('update node data', data.nodeData);
    }
    if(data.edgeData.length>0){
      socket.nsp.to(roomName).emit('update edge data', data.edgeData);
    }
    // groupData.addIdeaNode(data.memberInfo, data.formData, function(results){
    //   console.log(results);
    //   if(results.nodeData){
    //     socket.nsp.to(roomName).emit('update node data', results.nodeData);
    //   }
    //   if(results.edgeData){
    //     socket.nsp.to(roomName).emit('update edge data', results.edgeData);
    //   }
    // });    
  });
  socket.on('add keyQuestion', function(data){
    console.log(data);
    let roomName='group'+data.memberInfo.groupId;
    groupData.addKeyQuestionNode(data.memberInfo, data.formData, function(results){
      console.log(results);
      if(results.nodeData){
        socket.nsp.to(roomName).emit('update node data', results.nodeData);
      }
      if(results.edgeData){
        socket.nsp.to(roomName).emit('update edge data', results.edgeData);
      }
    });    
  });
  socket.on('add directiveObservation', function(data){
    console.log(data);
    let roomName='group'+data.memberInfo.groupId;
    groupData.addDirectiveObservationNode(data.memberInfo, data.formData, function(results){
      console.log(results);
      if(results.nodeData){
        socket.nsp.to(roomName).emit('update node data', results.nodeData);
      }
      if(results.edgeData){
        socket.nsp.to(roomName).emit('update edge data', results.edgeData);
      }
    });    
  });
  socket.on('add operationalObservation', function(data){
    console.log(data);
    let roomName='group'+data.memberInfo.groupId;
    groupData.addOperationalObservationNode(data.memberInfo, data.formData, function(results){
      console.log(results);
      if(results.nodeData){
        socket.nsp.to(roomName).emit('update node data', results.nodeData);
      }
      if(results.edgeData){
        socket.nsp.to(roomName).emit('update edge data', results.edgeData);
      }
    });    
  });
  socket.on('add experiment', function(data){
    console.log(data);
    let roomName='group'+data.memberInfo.groupId;
    groupData.addExperimentNode(data.memberInfo, data.formData, function(results){
      console.log(results);
      if(results.nodeData){
        socket.nsp.to(roomName).emit('update node data', results.nodeData);
      }
      if(results.edgeData){
        socket.nsp.to(roomName).emit('update edge data', results.edgeData);
      }
    });    
  });
  socket.on('create experimentRecord', function(data){
    let roomName='group'+data.memberInfo.groupId;
    groupData.addExperimentRecordNode(data.memberInfo, data.formData, function(results){
      if(results.nodeData){
        socket.nsp.to(roomName).emit('update node data', results.nodeData);
      }
      if(results.edgeData){
        socket.nsp.to(roomName).emit('update edge data', results.edgeData);
      }
    });
  });
  socket.on('add rise-above', function(data){
    console.log(data);
    let roomName='group'+data.memberInfo.groupId;
    groupData.addRiseAboveNode(data.memberInfo, data.formData, function(results){
      console.log(results);
      if(results.nodeData){
        socket.nsp.to(roomName).emit('update node data', results.nodeData);
      }
      if(results.edgeData){
        socket.nsp.to(roomName).emit('update edge data', results.edgeData);
      }
    });    
  });
  socket.on('add attachment', function(data){
    let roomName='group'+data.memberInfo.groupId;
    socket.nsp.to(roomName).emit('update node data', data.nodeData);    
  });
  socket.on('edit idea', function(data){
    console.log(data);
    let roomName='group'+data.memberInfo.groupId;
    groupData.editIdeaNode(data.formData.nodeId, data.formData.nodeTitle, data.formData.ideaContent, data.formData.countScaffold, function(results){
      console.log(results);
      socket.nsp.to(roomName).emit('update node data', results);
    });    
  });
  socket.on('edit keyQuestion', function(data){
    console.log(data);
    let roomName='group'+data.memberInfo.groupId;
    groupData.editKeyQuestionNode(data.formData.nodeId ,data.formData.nodeTitle , data.formData.keyQuestionInfo, function(results){
      console.log(results);
      socket.nsp.to(roomName).emit('update node data', results);
    });    
  });
  socket.on('edit directiveObservation', function(data){
    console.log(data);
    let roomName='group'+data.memberInfo.groupId;
    groupData.editDirectiveObservationNode(data.formData.nodeId ,data.formData.nodeTitle , data.formData.directiveObservationInfo, function(results){
      console.log(results);
      socket.nsp.to(roomName).emit('update node data', results);
    });    
  });
  socket.on('edit operationalObservation', function(data){
    console.log(data);
    let roomName='group'+data.memberInfo.groupId;
    groupData.editOperationalObservationNode(data.formData.nodeId ,data.formData.nodeTitle , data.formData.operationalObservationInfo, data.formData.steps, data.formData.materials, function(results){
      console.log(results);
      socket.nsp.to(roomName).emit('update node data', results);
    });    
  });
  socket.on('edit experiment', function(data){
    console.log(data);
    let roomName='group'+data.memberInfo.groupId;
    groupData.editExperimentNode(data.formData.nodeId ,data.formData.nodeTitle , data.formData.researchHypothesis, data.formData.researchMotivation, function(results){
      console.log(results);
      socket.nsp.to(roomName).emit('update node data', results);
    });    
  });
  socket.on('update node position', function(data){
    let roomName='group'+data.memberInfo.groupId;
    groupData.updateNodePosition(data.memberInfo, data.updateNodeData, function(results){
      console.log('update by '+data.memberInfo.memberName);
      console.log(results);
      socket.nsp.to(roomName).emit('update node position',data.updateNodeData);
    });
  });
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use("/static", express.static('public'));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,  //強制將未初始化的session存回 session store，未初始化的意思是它是新的而且未被修改。(預設：true)
  cookie: {
    maxAge: 1000*60*60*8,
  }
}));

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var teacherRouter = require('./routes/teacher');
var studentRouter = require('./routes/student');
var dataGetRouter = require('./routes/data_get');
var dataAddRouter = require('./routes/data_add');
var groupRouter = require('./routes/group');

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/teacher', teacherRouter);
app.use('/student', studentRouter);
app.use('/data_get', dataGetRouter);
app.use('/data_add', dataAddRouter);
app.use('/group', groupRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;