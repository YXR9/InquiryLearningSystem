$(document).ready(function(){
    let checkSession= setInterval(sessionAjax, 5000);
    function sessionAjax(){
        $.ajax({
            url: '/check_session',
            type: 'GET',
            success: function(session){
                console.log('session: '+session);
                if(!session){
                    window.location.href="/";
                }
            },
            error: function(){
                alert('檢查session失敗');
                window.location.href="/";
            }
        });
    }
});