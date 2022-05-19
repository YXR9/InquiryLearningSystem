var activityTableData = []
var $activityTable = $('#activityTable')
function getAjax(url, data){
    $.ajax({
        url: url,
        type: "GET",
        data: data,
        success: function(result){
            return result;
        },
        error: function(){
            console.log(url+" get error");
        }
    });
}

function activityTableFunction(value, row, index) {
    return '<button class="btn btn-primary" id="activityEdit">活動編輯</button>&nbsp;'
    +'<button class="btn btn-info" id="activityGroup">活動小組</button>&nbsp;'
    +'<button class="btn btn-danger" id="activityBroadcast">群組廣播</button><br><br>'
    +'<br><br><button class="btn btn-outline-warning" id="activityIdeaAnalysis">想法分析</button>&nbsp;'
    +'<button class="btn btn-outline-success" id="activityPracticeResult">實作結果</button>';
}
window.operateEvents = {                
    'click #activityEdit': function (e, value, row, index){
        console.log("row.id: "+row.id);
        window.event.returnValue=false;
    },
    'click #activityGroup': function (e, value, row, index){
        console.log("row.id: "+row.id);
        window.location.href="/activity_group?activity_id="+row.id;
        window.event.returnValue=false;
    }
}
function get_activity(){
    let ajaxResult = getAjax("/activity/teacher_activity", "");
    activityTableData.length = 0;
    $.each(ajaxResult, function(index, value){
        activityTableData.push({
            'id': value.activity_id,
            'activityTitle': value.activity_title,
            'groupCount': value.group_count,
            'memberCount': value.member_count,
            'createTime': value.create_time
        });
    });
    $activityTable.bootstrapTable('load', table_data);
}