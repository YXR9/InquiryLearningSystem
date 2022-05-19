var socket = io();
$(document).ready(function(){
    let memberInfo={
        memberId: parseInt($("#memberId").text()),
        memberName: $("#memberName").text(),
        groupId: parseInt($("#groupId").text()),
        activityId: parseInt($("#activityId").text())
    } 
    //傳送會員資訊以加入socket-room
    socket.emit('join room', memberInfo); 
    //不同狀態顯示
    socket.on('disconnect', function () {
        console.log('您已經中斷連線');
    });
    socket.on('reconnect', function () {
        console.log('您已經重新連線');
        socket.emit('join room', memberInfo);
    });
    socket.on('reconnect_error', function () {
        console.log('重新連線失敗...');
    });
});