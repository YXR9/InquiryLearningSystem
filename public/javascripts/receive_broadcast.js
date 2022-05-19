var socket = io();
let notRead= 0;
function setNotReadCount(){
    if(notRead== 0){
        $('.notReadCount').hide();
    }else{
        $('.notReadCount').text(notRead);
        $('.notReadCount').show();
    }
}
$(document).ready(function(){     
    setNotReadCount();
    socket.on('receive broadcast message', function(data){
        notRead++;
        setNotReadCount();
        console.log(data);
    });
    $('[data-toggle="popover"]').popover({
        title: "最近五則廣播訊息",
        trigger: 'focus',
        placement: 'bottom',
        html: true,
        container: 'body'
    }).on('show.bs.popover', function(){
        $.ajax({
            url: '/group/get_broadcast',
            type: 'GET',
            data: {
                groupId: parseInt($("#groupId").text())
            },
            success: function(data){
                console.log(data);
                let html='';
                if(data.length<= 0){
                    html+= '<p>沒有訊息</p>';
                }else{
                    for(i in data){
                        html+= '<div class="broadcastContent';
                        if(notRead > 0){
                            html+= ' notReadMessage'
                            notRead--;
                        }
                        if(data[i].broadcast_type=='訊息'){ 
                            html+= '"><p>'+data[i].broadcast_message+'</p>';
                        }else{
                            let nodeType= (data[i].broadcast_type=='關鍵提問')? 'badge-danger': ((data[i].broadcast_type=='想法')? 'badge-warning':'badge-info');
                            html+= '"><p>老師發布了一則 <span class="badge '+nodeType+'">'+data[i].broadcast_type+'</span>'+data[i].broadcast_message+'</p>';
                        }
                        html+= '<small class="form-text text-muted">'+data[i].time+'</small></div>';
                    }
                }
                $('.popover-body').html(html);
                setNotReadCount();
            },
            error: function(){
                alert('取得廣播資訊錯誤');
            }
        });
    });
});