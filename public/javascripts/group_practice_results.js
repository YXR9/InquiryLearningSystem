$(document).ready(function(){
    var memberInfo={
        memberId: parseInt($("#memberId").text()),
        memberName: $("#memberName").text(),
        memberIdentity: $('#memberIdentity').text(),
        groupId: parseInt($("#groupId").text()),
        activityId: parseInt($("#activityId").text())
    }    
    $('.nav-link#goGroup').attr('href', '/group?activityId='+memberInfo.activityId+'&groupId='+memberInfo.groupId);
    $('.nav-link#goPracticeResult').attr('href', '/group/practice_results?activityId='+memberInfo.activityId+'&groupId='+memberInfo.groupId);
    $('.nav-link#goLearningProcess').attr('href', '/group/learning_process?activityId='+memberInfo.activityId+'&groupId='+memberInfo.groupId);
    $('.nav-link#goFileManager').attr('href', '/group/file_manager?activityId='+memberInfo.activityId+'&groupId='+memberInfo.groupId);
    $('.nav-link#goPersonalIdea').attr('href', '/group/personal_space?activityId='+memberInfo.activityId+'&groupId='+memberInfo.groupId);
    $('#func-nav .navbar-nav .nav-item').removeClass('active');
    $('#func-nav .navbar-nav .nav-item:eq(1)').addClass('active');
    let directiveObservationListData= JSON.parse($('#directiveObservationListData').text());
    let operationalObservationListData= JSON.parse($('#operationalObservationListData').text());
    let experimentListData= JSON.parse($('#experimentListData').text());
    let directiveObservationData= JSON.parse($('#directiveObservationData').text());
    let operationalObservationData= JSON.parse($('#operationalObservationData').text());
    let experimentData= JSON.parse($('#experimentData').text());
    directiveObservationListData.forEach(function(value, index){
        // let newList='<a type="button" class="practiceMission align-middle" href="#card'+value.node_id+'" id="'+value.node_id+'">'+value.node_title+'</a><br>';
        let newList='<a type="button" class="practiceMission" href="#card'+value.node_id+'"><div class="card-body d-flex align-items-center">'+value.node_title+'</div></a>'
        $('#directiveObservationMission').append(newList);
        let newTable='<div class="row practiceCard" id="card'+value.node_id+'"><div class="card">'
            +'<div class="card-header practiceTitle"><img src="/public/images/icons/visibility-white.svg" alt="????????????"> '+value.node_title+'</div>'
            +'<div class="card-header practiceInfo">'
            +'<table class="table"><tbody>'
            +'<tr><th scope="row">??????</th><td width="90%">'+value.directive_observation_info+'</td></tr>'
            +'<tr><th scope="row">????????????</th><td>'+value.create_time+'</td></tr>'
            +'<tr><th scope="row">?????????</th><td>'+value.node_author+'</td></tr></tbody></table></div>'
            +'<div class="card-body"><div class="practiceRecord">'
            +'<table id=table'+value.node_id+'"></table>'
            +'</div></div></div>';
        $("#practiceCardList").append(newTable);
        let $table=$("#practiceCardList .practiceCard:last-child .card-body table:last-child");
        let tableData= directiveObservationData.filter(function(data){
            return data.node_id == value.node_id;
        });
        $table.bootstrapTable({
            columns:[
                {field:'directive_observation_record_id', title:'??????ID', visible:false},
                {field:'member_name', title:'??????', sortable:true, width:'10'},
                {field:'directive_observation_record', title:'????????????', width:'800',sortable:true},
                {field:'record_create_time', title:'????????????',sortable:true}
            ],
            pagination : true, //???????????????
            pageSize: 5,
            pageList:[5, 10, 20]
        });
        $table.bootstrapTable('load', tableData);
        // console.log(JSON.stringify($table.bootstrapTable('getData')));
    });
    operationalObservationListData.forEach(function(value){
        // let newList='<a type="button" class="practiceMission align-middle" href="#card'+value.node_id+'" id="'+value.node_id+'">'+value.node_title+'</a><br>';
        let newList='<a type="button" class="practiceMission" href="#card'+value.node_id+'"><div class="card-body d-flex align-items-center">'+value.node_title+'</div></a>'
        $('#operationalObservationMission').append(newList);
        let newTable='<div class="row practiceCard" id="card'+value.node_id+'"><div class="card">'
            +'<div class="card-header practiceTitle"><img src="/public/images/icons/operational-observation-white.svg" alt="????????????"> '+value.node_title+'</div>'
            +'<div class="card-header practiceInfo">'
            +'<table class="table"><tbody>'
            +'<tr><th scope="row">??????</th><td width="90%">'+value.operational_observation_info+'</td></tr>';
        newTable+='<tr><th scope="row">??????/??????</th><td>';
        let materials=JSON.parse(value.materials);
        materials.forEach(function(value){
            newTable+= '<p>'+value.name+': '+value.number+'</p>';
        });
        newTable+= '</td></tr><tr><th scope="row">??????</th><td>';
        let steps= value.steps.split(',');
        steps.forEach(function(value, index){
            newTable+= '<p>'+(index+1)+'. '+value+'</p>';
        });
        newTable+= '</td></tr><tr><th scope="row">????????????</th><td>'+value.create_time+'</td></tr>'
            +'<tr><th scope="row">?????????</th><td>'+value.node_author+'</td></tr></tbody></table></div>'
            +'<div class="card-body"><div class="practiceRecord">'
            +'<table id=table'+value.node_id+'"></table>'
            +'</div></div></div>';
        $("#practiceCardList").append(newTable);
        let $table=$("#practiceCardList .practiceCard:last-child .card-body table:last-child");
        let tableData= operationalObservationData.filter(function(data){
            return data.node_id == value.node_id;
        });
        $table.bootstrapTable({
            columns:[
                {field:'operational_observation_record_id', title:'??????ID', visible:false},
                {field:'member_name', title:'??????', sortable:true, width:'10'},
                {field:'operational_observation_record', title:'????????????', width:'800',sortable:true},
                {field:'record_create_time', title:'????????????',sortable:true}
            ],
            pagination : true, //???????????????
            pageSize: 5,
            pageList:[5, 10, 20]
        });
        $table.bootstrapTable('load', tableData);
        // console.log(JSON.stringify($table.bootstrapTable('getData')));
    });
    experimentListData.forEach(function(value){
        // let newList='<a type="button" class="practiceMission align-middle" href="#card'+value.node_id+'" id="'+value.node_id+'">'+value.node_title+'</a><br>';
        let newList='<a type="button" class="practiceMission" href="#card'+value.node_id+'"><div class="card-body d-flex align-items-center">'+value.node_title+'</div></a>'
        $('#experimentMission').append(newList);
        let newTable='<div class="row practiceCard" id="card'+value.node_id+'"><div class="card">'
            +'<div class="card-header practiceTitle"><img src="/public/images/icons/experiment-white.svg" alt="??????"> '+value.node_title+'</div>'
            +'<div class="card-header practiceInfo">'
            +'<table class="table"><tbody>'
            +'<tr><th scope="row">????????????</th><td width="90%">'+value.research_hypothesis+'</td></tr>'
            +'<tr><th scope="row">????????????</th><td width="90%">'+value.research_motivation+'</td></tr>';
        if(value.materials){
            newTable+='<tr><th scope="row">??????/??????</th><td>';
            let materials=JSON.parse(value.materials);
            materials.forEach(function(value){
                newTable+= '<p>'+value.name+': '+value.number+'</p>';
            });
        }
        if(value.steps){
            newTable+= '</td></tr><tr><th scope="row">??????</th><td>';
            let steps= value.steps.split(',');
            steps.forEach(function(value, index){
                newTable+= '<p>'+(index+1)+'. '+value+'</p>';
            });
        }
        newTable+= '</td></tr><tr><th scope="row">????????????</th><td>'+value.create_time+'</td></tr>'
            +'<tr><th scope="row">?????????</th><td>'+value.node_author+'</td></tr></tbody></table></div>'
            +'<div class="card-body"><div class="practiceRecord">'
            +'<table id=table'+value.node_id+'"></table>'
            +'</div></div></div>';
        $("#practiceCardList").append(newTable);
        let $table=$("#practiceCardList .practiceCard:last-child .card-body table:last-child");
        let tableData= experimentData.filter(function(data){
            return data.node_id == value.node_id;
        });
        console.log(tableData);
        $table.bootstrapTable({
            columns:[
                {field:'experiment_record_id', title:'??????ID', visible:false},
                {field:'member_name', title:'??????', sortable:true, width:'10'},
                {field:'experiment_record', title:'????????????', width:'800',sortable:true},
                {field:'record_create_time', title:'????????????',sortable:true}
            ],
            pagination : true, //???????????????
            pageSize: 5,
            pageList:[5, 10, 20]
        });
        $table.bootstrapTable('load', tableData);
    });
    $('.practiceMission').on('click', function(){
        let nodeId=$(this).attr('id');
    });
});
//????????????????????????
$(document).on('click', 'a[href^="#"]:not(".practiceTypeBtn")', function (event) {
    event.preventDefault();
    $('html, body').animate({
        scrollTop: $($.attr(this, 'href')).offset().top + -80
    }, 500);
});