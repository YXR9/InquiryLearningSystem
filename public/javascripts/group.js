var nodes = new vis.DataSet();
var edges = new vis.DataSet();
let editorLengthLimit = 4294960000;
let knowledgeBuildScaffold=["我的想法","我覺得更好的想法","我想知道","這個想法不能解釋","舉例和參考來源","我的總結"];
let directiveObservationRecordTableData = [];
let $directiveObservationRecordTable = $("#directiveObservationRecordTable");
let operationalObservationRecordTableData = [];
let $operationalObservationRecordTable = $("#operationalObservationRecordTable");
let experimentRecordTableData = [];
let $experimentRecordTable = $("#experimentRecordTable");
let currentNodeId=[];
function operateFormatter(value, row, index) {
    return '<button class="btn btn-outline-primary edit"><i class="fas fa-edit"></i></button>'
}
window.operateEvents = {    
    'click .edit': function (e, value, row, index){
        console.log(JSON.stringify(row));
        console.log(index);
        // alert("type: "+row.recordType+";  memberId: "+row.memberId+";  recordId: "+row.recordId+"; record: "+row.record);
        // $('#editRecord .recordContent').setAttribute('recordType',row.recordType);
        $('#editRecord .recordType').text(row.recordType);
        $('#editRecord .recordId').text(row.recordId);
        $('#editRecord .recordIndex').text(index);
        $('#editRecord .recordContent').summernote('code', row.record);
        $('#editRecord').modal('show');
    },
    'click .delete': function (e, value, row, index){
        // alert("type: "+row.recordType+";  memberId: "+row.memberId+";  recordId: "+row.recordId);
        $('#checkRemoveRecord .recordType').text(row.recordType);
        $('#checkRemoveRecord .recordId').text(row.recordId);
        $('#checkRemoveRecord .recordIndex').text(index);
        $('#checkRemoveRecord').modal('show');
    }
}
var container = document.getElementById("mynetwork");
var networkData = {
    nodes: nodes,
    edges: edges
};
var options = {
    nodes: {
        shapeProperties: {
            useBorderWithImage: false
        },
        size: 16
    },
    groups: {
        key_question: {
            color: { background: "rgb(255,255,255)", border: "rgba(0,0,0,0)" },
            shape: "image",
            image: "/images/icons/question-yellow.png"
        },
        idea: {
            color: { background: "rgb(255,255,255)", border: "rgba(0,0,0,0)" },
            shape: "image",
            image: "/images/icons/idea-yellow.svg"
        },
        rise_above: {
            color: { background: "rgb(255,255,255)", border: "rgba(0,0,0,0)" },
            shape: "image",
            image: "/images/icons/rise-above2.svg"
        },
        directive_observation: {
            color: { background: "rgb(255,255,255)", border: "rgba(0,0,0,0)" },
            shape: "image",
            image: "/images/icons/visibility-blue.svg"
        },
        operational_observation: {
            color: { background: "rgb(255,255,255)", border: "rgba(0,0,0,0)" },
            shape: "image",
            image: "/images/icons/operational-observation-blue.svg"
        },
        experiment: {
            color: { background: "rgb(255,255,255)", border: "rgba(0,0,0,0)" },
            shape: "image",
            image: "/images/icons/experiment-blue.svg"
        },
        experiment_record: {
            color: { background: "rgb(255,255,255)", border: "rgba(0,0,0,0)" },
            shape: "image",
            image: "/images/icons/experiment-record-blue.svg"
        },                   
        attachment: {
            color: { background: "rgb(255,255,255)", border: "rgba(0,0,0,0)" },
            shape: "image",
            image: "/images/icons/attachment-grey.svg"
        }
    },
    edges: {
        color: {
            color: "rgba(0,0,0,0.2)",
            highlight: "rgba(0,0,0,0.4)"
        },
        arrows: {           
            to: {
                enabled: true
            }          
        },
        smooth: {
            enabled: false
        }
    },
    interaction: {
        multiselect: true
    },
    physics: {
        enabled: false
    }
}
function updateNodeData(data){
    console.log(data);
    $.each(data, function(index, value){                    
        nodes.update({
            id: value.node_id,
            x: value.x,
            y: value.y
        });
        if(value.create_time){
            nodes.update({
                id: value.node_id,
                create_time: value.create_time
            });
        }
        if(value.node_author){
            nodes.update({
                id: value.node_id,
                author: value.node_author
            });
        }
        if(value.node_title){
            nodes.update({
                id: value.node_id,
                node_title: value.node_title
            });
        }
        if(value.node_type){
            nodes.update({
                id: value.node_id,
                group: value.node_type
            });
        }       
        if(value.attachment_count){
            nodes.update({
                id: value.node_id,
                attachment_count: value.attachment_count
            });
        }             
    }); 
}
function updateEdgeData(data){
    console.log(data);
    $.each(data, function(index, value){
        edges.update({
            id: value.edge_id,
            from: value.edge_from,
            to: value.edge_to
        });
    }); 
}
function ajaxGetNodeData(url, nodeId, groupId){
    var responseData;
    $.ajax({
        url: url,
        type: "GET",
        async: false,//取消同步，等ajax結束後再進行後續動作
        data: {
            nodeId: nodeId,
            groupId: groupId
        },
        success: function(results){
            responseData=results;
        },
        error: function(){
            alert(url+"  取得資料失敗");
        }
    });
    return responseData;
};
function getCountScaffold(textContent){
    let countScaffold=[];
    let newObj= new Object();
    knowledgeBuildScaffold.forEach(function(value){
        let re= new RegExp(value, 'g');
        let match= (textContent.match(re));
        if(match){
            let count= match.length;
            newObj[value]= count;
        }
    });
    countScaffold= JSON.stringify(newObj);
    return countScaffold;
}
function setFileNameWithTime(originalName){
    let d = new Date();
    let attachmentNameArray= originalName.split(".");   
    let fileFormat=attachmentNameArray.pop();
    let fileName= attachmentNameArray.join(".")
    +"_"+(d.getMonth()+1)+d.getDate()+d.getHours()
    +"."+fileFormat;
    return fileName;
}
$(document).ready(function(){
    var nodeData = JSON.parse($("#nodeData").text());
    var edgeData = JSON.parse($("#edgeData").text());
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
    $('#func-nav .navbar-nav .nav-item:eq(0)').addClass('active');
    let isTeacher= ($('#memberIdentity').text()=='老師');
    console.log("isTeacher: "+$('#memberIdentity').text());
    updateNodeData(nodeData);
    updateEdgeData(edgeData);
    var network = new vis.Network(container, networkData, options); 
    socket.on('update node position', function(data){
        console.log('<update node position>');
        updateNodeData(data);
    }); 
    socket.on('update node data', function(data){
        console.log('<update node data>');
        console.log(data);
        updateNodeData(data);
    });
    socket.on('update edge data', function(data){
        console.log('<update edge data>');
        console.log(data);
        updateEdgeData(data);
    });
    // socket.on('receive broadcast message', function(data){
    //     console.log(data);
    // });
    $('.tool').on('click', function(){
        currentNodeId.length=0;
    });
    $('#addKeyQuestion_btn').on('click', function(){
        let $modal= $(this).closest('.modal');
        let nodeTitle= $('.inputModal .keyQuestionTitle').val().trim();
        let newText=$(this).closest('.modal-content').find('.editor');
        let newTextContent = newText.summernote('code').trim()?newText.summernote('code').trim():newText.val();
        if(newTextContent.length > editorLengthLimit){
            alert('說明內容過多，請做刪減');
        }else if(nodeTitle.length <= 0){
            alert('請輸入關鍵提問標題！');
        }else{
            let formData=new FormData();
            formData.append('groupId', memberInfo.groupId);
            formData.append('nodeTitle', nodeTitle);
            formData.append('keyQuestionInfo', newTextContent);
            formData.append('fromNodeId', currentNodeId.toString());
            let files= $('#keyQuestionFiles')[0].files;
            console.log(files.length);
            if(files.length> 0){
                for(let i=0;i<files.length;i++){
                    formData.append('file', files[i]);
                }
            }
            $.ajax({
                url: '/group/add_key_question',
                type: 'POST',
                data: formData,
                enctype: "multipart/form-data",
                cache: false,
                contentType: false,
                processData: false,
                success: function(data){
                    console.log(data);
                    if(!data.nodeData){
                        alert('小組中已有一樣的檔案，請重新命名檔案再上傳！');
                        $('#keyQuestionFiles').val('');
                        $('.fileList').html('');
                    }else{
                        $('#addKeyQuestion').modal('hide');
                        socket.emit('add node', {memberInfo: memberInfo, nodeData: data.nodeData});
                        socket.emit('add edge', {memberInfo: memberInfo, edgeData: data.edgeData});
                        $modal.modal('hide');
                    }
                },
                error: function(){
                    alert("檔案上傳失敗");
                }
            });
        }
    });
    $('#editKeyQuestion_btn').on('click', function(){
        console.log('<edit keyQuestion>');
        // console.log($('.editModal .keyQuestionTitle').val()+' '+$('.editModal .keyQuestionInfo').val());
        let newText=$(this).closest('.modal-content').find('.editor');
        let newTextContent = newText.summernote('code').trim()?newText.summernote('code').trim():newText.val();
        let formData={
            nodeId: currentNodeId,
            nodeTitle: $('.editModal .keyQuestionTitle').val(),
            keyQuestionInfo: newTextContent
        }
        socket.emit('edit keyQuestion', {memberInfo: memberInfo, formData: formData});
    });
    $('#addIdea_btn').on('click', function(){
        console.log('<add idea>');
        let nodeTitle= $('.inputModal .ideaTitle').val().trim();
        let newText=$(this).closest('.modal-content').find('.editor');
        let newTextContent = newText.summernote('code').trim()?newText.summernote('code').trim():newText.val();
        if(newTextContent.length > editorLengthLimit){
            alert('想法內容過多，請做刪減');
        }else if(nodeTitle.length <= 0){
            alert('請輸入想法標題！');
        }else{
            let countScaffold= getCountScaffold(newTextContent);
            let formData=new FormData();
            formData.append('groupId', memberInfo.groupId);
            formData.append('nodeTitle', nodeTitle);
            formData.append('ideaContent', newTextContent);
            formData.append('countScaffold', countScaffold);
            formData.append('fromNodeId', currentNodeId.toString());
            let files= $('#ideaFiles')[0].files;
            console.log(files.length);
            if(files.length> 0){
                for(let i=0;i<files.length;i++){
                    formData.append('file', files[i]);
                }
            }
            $.ajax({
                url: '/group/add_idea',
                type: 'POST',
                data: formData,
                enctype: "multipart/form-data",
                cache: false,
                contentType: false,
                processData: false,
                success: function(data){
                    if(!data.nodeData){
                        alert('小組中已有一樣的檔案，請重新命名檔案再上傳！');
                        $('#ideaFiles').val('');
                        $('.fileList').html('');
                    }else{
                        $('#addIdea').modal('hide');
                        socket.emit('add node', {memberInfo: memberInfo, nodeData: data.nodeData});
                        socket.emit('add edge', {memberInfo: memberInfo, edgeData: data.edgeData});
                    }
                    // socket.emit('add attachment', {memberInfo: memberInfo, nodeData: data.nodeData});
                },
                error: function(){
                    alert("想法新增失敗");
                }
            });
        }
        // socket.emit('add idea', {memberInfo: memberInfo, formData: formData});
    });
    $('#editIdea_btn').on('click', function(){
        console.log('<edit idea>');
        let nodeTitle= $('.editModal .ideaTitle').val().trim();
        let newText=$(this).closest('.modal-content').find('.editor');
        let newTextContent = newText.summernote('code').trim()?newText.summernote('code').trim():newText.val();
        let countScaffold= getCountScaffold(newTextContent);
        if(newTextContent.length > editorLengthLimit){
            alert('想法內容過多，請做刪減');
        }else if(nodeTitle.length <= 0){
            alert('請輸入想法標題！');
        }else{
            let formData={
                nodeId: currentNodeId,
                nodeTitle: nodeTitle,
                ideaContent: newTextContent,
                countScaffold: countScaffold
            }
            socket.emit('edit idea', {memberInfo: memberInfo, formData: formData});
            $(this).closest('.modal').modal('hide');
        }        
    });
    $('#addDirectiveObservation_btn').on('click', function(){
        console.log('<add directiveObservation>');
        let $modal= $(this).closest('.inputModal');
        // console.log($('.inputModal .directiveObservationTitle').val()+' '+$('.inputModal .directiveObservationInfo').val());
        let nodeTitle= $('.inputModal .directiveObservationTitle').val().trim();
        let newText=$(this).closest('.modal-content').find('.editor');
        let newTextContent = newText.summernote('code').trim()?newText.summernote('code').trim():newText.val();
        if(nodeTitle.length <= 0){
            alert('請輸入直接觀察標題！');
        }else{
            let formData={
                nodeTitle: nodeTitle,
                directiveObservationInfo: newTextContent,
                fromNodeId: currentNodeId
            }    
            socket.emit('add directiveObservation', {memberInfo: memberInfo, formData: formData});
            $modal.modal('hide');
        }
        
    });
    $('#editDirectiveObservation_btn').on('click', function(){
        console.log('<edit directiveObservation>');
        // console.log($('.editModal .directiveObservationTitle').val()+' '+$('.editModal .directiveObservationInfo').val());
        let newText=$(this).closest('.modal-content').find('.editor');
        let newTextContent = newText.summernote('code').trim()?newText.summernote('code').trim():newText.val();
        let formData={
            nodeId: currentNodeId,
            nodeTitle: $('.editModal .directiveObservationTitle').val(),
            directiveObservationInfo: newTextContent
        }
        socket.emit('edit directiveObservation', {memberInfo: memberInfo, formData: formData});
    });    
    $("#addOperationalObservation_btn").on('click', function(){
        let $modal= $(this).closest('.inputModal');
        let nodeTitle= $('.inputModal .operationalObservationTitle').val().trim();
        let newText=$(this).closest('.modal-content').find('.editor');
        let newTextContent = newText.summernote('code').trim()?newText.summernote('code').trim():newText.val();
        let steps=$(this).closest(".modal-content").find("input.step").map(function(){
            return $(this).val();
        }).get();
        let materials=$(this).closest(".modal-content").find(".materials .card").map(function(){
            let newMatarial=new Object;
            newMatarial['name']=($(this).find('.materialName').text()).slice(0,-1);
            newMatarial['number']=$(this).find('.materialNumber').text();
            return newMatarial;
        }).get();
        if(nodeTitle.length <= 0){
            alert('請輸入操作觀察標題！');
        }else{
            if(steps.length < 1){
                alert('至少要有一個實驗步驟！');
            }else{
                if(steps[0].trim().length < 1){
                    alert('步驟1的內容不能空白！');
                }else{
                    let formData={
                        nodeTitle: nodeTitle,
                        operationalObservationInfo: newTextContent,
                        steps: steps.toString(),
                        materials: JSON.stringify(materials),
                        fromNodeId: currentNodeId
                    }
                    socket.emit('add operationalObservation', {memberInfo: memberInfo, formData: formData});
                    $modal.modal('hide');
                }               
            }
        }
    });
    $("#editOperationalObservation_btn").on('click', function(){
        let newText=$(this).closest('.modal-content').find('.editor');
        let newTextContent = newText.summernote('code').trim()?newText.summernote('code').trim():newText.val();
        let steps=$(this).closest(".modal-content").find("input.step").map(function(){
            return $(this).val();
        }).get();
        let materials=$(this).closest(".modal-content").find(".materials .card").map(function(){
            let newMatarial=new Object;
            newMatarial['name']=($(this).find('.materialName').text()).slice(0,-1);
            newMatarial['number']=$(this).find('.materialNumber').text();
            return newMatarial;
        }).get();
        let formData={
            nodeId: currentNodeId,
            nodeTitle: $('.editModal .operationalObservationTitle').val(),
            operationalObservationInfo: newTextContent,
            steps: steps.toString(),
            materials: JSON.stringify(materials)
        }
        socket.emit('edit operationalObservation', {memberInfo: memberInfo, formData: formData});
    });
    $('#addExperiment_btn').on('click', function(){
        console.log('<add experiment>');
        let $modal= $(this).closest('.inputModal');
        // console.log($('.inputModal #ideaTitle').val()+' '+$('.inputModal #ideaContent').val());
        let nodeTitle= $('.inputModal .researchProblem').val().trim();
        let researchHypothesis= $('.inputModal .researchHypothesis').val().trim();
        let newText=$(this).closest('.modal-content').find('.editor');
        let newTextContent = newText.summernote('code').trim()?newText.summernote('code').trim():newText.val();
        if(nodeTitle.length <= 0 || researchHypothesis.length <= 0){
            alert('請輸入研究問題和研究假設！');
        }else{
            let formData={
                nodeTitle: nodeTitle,
                researchHypothesis: researchHypothesis,
                researchMotivation: newTextContent,
                fromNodeId: currentNodeId
            }    
            socket.emit('add experiment', {memberInfo: memberInfo, formData: formData});
            $modal.modal('hide');
        }
    });
    $('#editExperiment_btn').on('click', function(){
        console.log('<edit experiment>');
        // console.log($('.inputModal #ideaTitle').val()+' '+$('.inputModal #ideaContent').val());
        let newText=$(this).closest('.modal-content').find('.editor');
        let newTextContent = newText.summernote('code').trim()?newText.summernote('code').trim():newText.val();
        let formData={
            nodeId: currentNodeId,
            nodeTitle: $('.editModal .researchProblem').val(),
            researchHypothesis: $('.editModal .researchHypothesis').val(),
            researchMotivation: newTextContent
        }    
        socket.emit('edit experiment', {memberInfo: memberInfo, formData: formData});
    });
    $("#addRiseAbove_btn").on('click', function(){
        console.log('<add rise-above>');
        $modal= $(this).closest('.modal');
        // console.log($('.inputModal #ideaTitle').val()+' '+$('.inputModal #ideaContent').val());
        let nodeTitle= $('.inputModal #riseAboveTitle').val().trim();
        let newText=$(this).closest('.modal-content').find('.editor');
        let newTextContent = newText.summernote('code').trim()?newText.summernote('code').trim():newText.val();
        let countScaffold= getCountScaffold(newTextContent);
        if(nodeTitle.length <= 0){
            alert('請輸入想法標題！');
        }else{
            let formData={
                nodeTitle: nodeTitle,
                riseAboveContent: newTextContent,
                fromNodeId: currentNodeId,
                countScaffold: countScaffold
            }    
            socket.emit('add rise-above', {memberInfo: memberInfo, formData: formData});
            $modal.modal('hide');
        }
        
    });
    $('.addRecord').on('click', function(){
        let newRecord=$(this).closest('.form-group').find('.editor');
        let newRecordContent = newRecord.summernote('code').trim()?newRecord.summernote('code').trim():newRecord.val();
        if(newRecordContent.length > editorLengthLimit){
            alert('紀錄內容過多，請做刪減');
        }else if(newRecord.attr('id')=='newDirectiveObservationRecord'){
            $.ajax({
                url: "/group/add_directive_observation_record",
                type: 'POST',
                data: {
                    directiveObservationRecord: newRecordContent,
                    nodeId: currentNodeId[0]
                },
                success: function(data){
                    console.log(data);
                    newRecord.summernote('code', '');
                    directiveObservationRecordTableData.push({
                        'recordType': 'directive_observation',
                        'recordId': data.directive_observation_record_id,
                        'memberId': data.member_id,
                        'recordAuthor': data.member_name,
                        'record': data.directive_observation_record,
                        'operate': '<a class="delete text-danger" href="javascript:void(0)" title="刪除"><i class="fas fa-trash-alt"></i></a>'
                        +'&nbsp;<a class="edit text-info" href="javascript:void(0)" title="修改"><i class="fas fa-edit"></i></a>'
                    });
                    $directiveObservationRecordTable.bootstrapTable('load', directiveObservationRecordTableData);
                },
                error: function(){
                    alert("新增直接觀察紀錄失敗");
                }
            });
        }else if(newRecord.attr('id')=='newOperationalObservationRecord'){
            $.ajax({
                url: "/group/add_operational_observation_record",
                type: 'POST',
                data: {
                    operationalObservationRecord: newRecordContent,
                    nodeId: currentNodeId[0]
                },
                success: function(data){
                    console.log(data);
                    newRecord.summernote('code', '');
                    operationalObservationRecordTableData.push({
                        'recordType': 'operational_observation',
                        'recordId': data.operational_observation_record_id,
                        'memberId': data.member_id,
                        'recordAuthor': data.member_name,
                        'record': data.operational_observation_record,
                        'operate': '<a class="delete text-danger" href="javascript:void(0)" title="刪除"><i class="fas fa-trash-alt"></i></a>'
                        +'&nbsp;<a class="edit text-info" href="javascript:void(0)" title="修改"><i class="fas fa-edit"></i></a>'
                    });
                    $operationalObservationRecordTable.bootstrapTable('load', operationalObservationRecordTableData);
                },
                error: function(){
                    alert("新增操作觀察紀錄失敗");
                }
            });
        }else if(newRecord.attr('id')=='newExperimentRecord'){
            $.ajax({
                url: "/group/add_experiment_record",
                type: 'POST',
                data: {
                    experimentRecord: newRecordContent,
                    nodeId: currentNodeId[0]
                },
                success: function(data){
                    console.log(data);
                    newRecord.summernote('code', '');
                    experimentRecordTableData.push({
                        'recordType': 'experiment',
                        'recordId': data.experiment_record_id,
                        'memberId': data.member_id,
                        'recordAuthor': data.member_name,
                        'record': data.experiment_record,
                        'operate': '<a class="delete text-danger" href="javascript:void(0)" title="刪除"><i class="fas fa-trash-alt"></i></a>'
                        +'&nbsp;<a class="edit text-info" href="javascript:void(0)" title="修改"><i class="fas fa-edit"></i></a>'
                    });
                    $experimentRecordTable.bootstrapTable('load', experimentRecordTableData);
                },
                error: function(){
                    alert("新增實驗紀錄失敗");
                }
            });
        }
    });
    $("#addAttachment_btn").on('click', function(){
        var formData=new FormData();
        formData.append('file', $("#attachmentFile")[0].files[0]);
        formData.append('nodeTitle', $("#attachmentFile")[0].files[0].name);
        formData.append('groupId', memberInfo.groupId);
        formData.append('share', 1);
        if(formData.has('file')){
            console.log("file!!!!!!!");
            $.ajax({
                url: '/group/add_attachment',
                type: 'POST',
                data: formData,
                enctype: "multipart/form-data",
                cache: false,
                contentType: false,
                processData: false,
                success: function(data){
                    console.log(data);
                    socket.emit('add attachment', {memberInfo: memberInfo, nodeData: data.nodeData});
                },
                error: function(){
                    alert("檔案上傳失敗");
                }
            });
        }
    });
    $('#saveExperimentDesign').on('click', function(){
        let steps=$(this).closest(".modal-content").find("input.step").map(function(){
            return $(this).val();
        }).get();
        let materials=$(this).closest(".modal-content").find(".materials .card").map(function(){
            let newMatarial=new Object;
            newMatarial['name']=($(this).find('.materialName').text()).slice(0,-1);
            newMatarial['number']=$(this).find('.materialNumber').text();
            return newMatarial;
        }).get();
        let formData={
            nodeId: currentNodeId[0],
            steps: steps.toString(),
            materials: JSON.stringify(materials)
        }
        console.log(formData);
        $.ajax({
            url: "/group/save_experiment_design",
            type: 'POST',
            data:  formData,
            success: function(data){
                console.log(data);
                $("#viewExperiment .lastEditor").text('最後編輯者：'+data);
            },
            error: function(){
                alert('儲存實驗設計失敗');
            }
        })
    });
    $('#createExperimentRecordNode').on('click', function(){
        console.log('<create experimentRecord>');
        let nodeTitle= $(this).closest('.modal-content').find('.modal-header .modal-title').text();
        nodeTitle= nodeTitle.substring(7);
        let formData={
            nodeTitle: nodeTitle,
            fromNodeId: currentNodeId
        }    
        socket.emit('create experimentRecord', {memberInfo: memberInfo, formData: formData});
    });
    $('.btn-addFavorite').on('click', function(){
        $.ajax({
            url:'/group/add_favorite',
            type: 'POST',
            data: {
                nodeId: currentNodeId[0],
                groupId: memberInfo.groupId
            },
            success: function(data){
                if(data.finished){
                    $('#viewIdea .btn-addFavorite').hide();
                    $('#viewIdea .btn-removeFavorite').show();
                }else{
                    console.log(data);
                }
            },
            error: function(){
                console.log('/group/add_favorite error');
            }
        });
    });
    $('.btn-removeFavorite').on('click', function(){
        $.ajax({
            url:'/group/remove_favorite',
            type: 'POST',
            data: {
                nodeId: currentNodeId[0]
            },
            success: function(data){
                if(data.finished){
                    $('#viewIdea .btn-removeFavorite').hide();
                    $('#viewIdea .btn-addFavorite').show();
                }else{
                    console.log(data);
                }
            },
            error: function(){
                console.log('/group/remove_favorite error');
            }
        });
    });
    $(".addStep").on('click', function(){
        let stepCount=$(this).closest('.modal-body').find('table tbody .step').length;
        stepCount++;
        var newRow = "<tr>";
        newRow += '<td>'+stepCount+'</td>';
        newRow += '<td><input type="text" class="form-control step" name="step' + stepCount + '" placeholder="實驗步驟" required /></td>';
        newRow += '<td><input type="button" class="btn btn-md btn-danger delStep" value="X"></td></tr>';
        $(this).closest('.modal-body').find('table.stepTable tbody').append(newRow);
    });
    $("table.stepTable tbody").sortable({
        distance: 5, delay: 100, opacity: 0.6,
        cursor: 'move', items: 'tr:not(.tr-first)',
        update: function(){
            $("table.stepTable tbody tr:has(td)").each(function (i) {
                $(this).find("td:eq(0)").html(i+1);
            });
        }
    })
    $("table.stepTable").on("click", ".delStep", function () {
        $(this).closest("tr").remove();
        $("table.stepTable tbody tr:has(td)").each(function (i) {
            $(this).find("td:eq(0)").html(i+1);
        });
    });
    $(".addMaterial").on('click', function(){
        let newMaterialName=$(this).closest(".row.newMaterial").find('.newMaterialName').val();
        let newMaterialNumber=$(this).closest(".row.newMaterial").find('.newMaterialNumber').val();
        if(newMaterialName && newMaterialNumber){
            let newMaterial = '<div class="col-sm-3"><div class="card"><div class="card-header materialName">';
            newMaterial += newMaterialName;
            newMaterial += '<button type="button" class=" close delMaterial"><span>&times;</span></button></div><div class="card-body"><p class="card-text materialNumber">';
            newMaterial += newMaterialNumber;
            newMaterial += '</p></div></div></div>';
            $(this).closest(".modal-body").find('.materials').append(newMaterial);
            $(this).closest(".row.newMaterial").find('.newMaterialName').val('');
            $(this).closest(".row.newMaterial").find('.newMaterialNumber').val('');
        }
    });
    $(".materials").on("click", ".delMaterial",function(e){
        e.preventDefault();
        $(this).closest('.col-sm-3').remove();
    });
    $('.practiceDesign').on('hidden.bs.modal', function(e){
        $('.practiceDesign table.stepTable tbody').html('');
        $('.practiceDesign .materials').html('');
    });
    $('#editRecord_btn').on('click', function(){
        let $modal= $('#editRecord');
        let recordType= $modal.find('.recordType').text();
        let recordId= parseInt($modal.find('.recordId').text());
        let recordIndex= parseInt($modal.find('.recordIndex').text());
        let record= $modal.find('.editor').summernote('code').trim()?$modal.find('.editor').summernote('code').trim():$modal.find('.editor').val();
        $.ajax({
            url: '/group/edit_record',
            type: 'POST',
            data: {
                recordType: recordType,
                recordId: recordId,
                record: record
            },
            success: function(data){
                // console.log(data);
                let tableId= '#'+((recordType=='directive_observation')?'directiveObservation':((recordType=='operational_observation')?'operationalObservation':'experiment'))+'RecordTable';
                let $recordTable=$(tableId);
                $recordTable.bootstrapTable('updateCell', {
                    index: recordIndex,
                    field: 'record',
                    value: data.record
                });
                $modal.modal('hide');
            },
            error: function(){
                alert('儲存記錄失敗');
            }
        })
    });
    $('#checkRemoveRecord_btn').on('click', function(){
        let $modal= $(this).closest('.modal');
        let recordType= $modal.find('.recordType').text();
        let recordId= parseInt($modal.find('.recordId').text());
        let recordIndex= parseInt($modal.find('.recordIndex').text());
        $.ajax({
            url: '/group/remove_record',
            type: 'POST',
            data: {
                recordType: recordType,
                recordId: recordId
            },
            success: function(data){
                let tableId= '#'+((recordType=='directive_observation')?'directiveObservation':((recordType=='operational_observation')?'operationalObservation':'experiment'))+'RecordTable';
                let $recordTable=$(tableId);
                $recordTable.bootstrapTable('remove', {
                    field: 'recordId',
                    values: data
                });
            },
            error: function(){
                alert('刪除記錄失敗');
            }
        })
    });
    network.on("beforeDrawing", function(ctx){
        let nodeIds=[], nodeTitles=[], nodeAuthors=[], nodeCreateTime=[];
        nodes.forEach(function(data){
            console.log(data);
            nodeIds.push(data.id);
            nodeTitles.push(data.node_title);
            nodeAuthors.push(data.author);
            nodeCreateTime.push(data.create_time);
        })
        let nodePosition = network.getPositions(nodeIds);
        nodeIds.forEach(function(value, index){
            if(currentNodeId.includes(value)){
                ctx.beginPath();
                ctx.arc(nodePosition[value].x, nodePosition[value].y, 30, 0, 2 * Math.PI);
                ctx.fillStyle= 'rgba(0,0,0, 0.1)';
                ctx.fill();
                ctx.strokeStyle= '#fff';
                ctx.stroke();
            }            
            // ctx.font = 'bold 20px "Microsoft JhengHei"';
            // ctx.fillStyle = '#bbb';
            // let width = ctx.measureText(nodeTitles[index]).width; /// width in pixels
            // ctx.fillRect(nodePosition[value].x+30, nodePosition[value].y-30, width, 20);
            ctx.fillStyle = '#555';
            ctx.font = 'bold 20px "Microsoft JhengHei"';
            ctx.fillText(nodeTitles[index], nodePosition[value].x+30, nodePosition[value].y-10);
            let nodeAttachment=nodes.get(value);
            if(nodeAttachment.attachment_count> 0){
                ctx.fillStyle = '#aaa';
                ctx.font = '16px "FontAwesome"';
                ctx.fillText('\uf0c6', nodePosition[value].x+30, nodePosition[value].y+10);                
                ctx.fillStyle = '#555';
                ctx.font = 'normal 16px "Microsoft JhengHei"';
                ctx.fillText(nodeAuthors[index], nodePosition[value].x+45, nodePosition[value].y+10);
                ctx.font = 'normal 12px "Microsoft JhengHei"';
                ctx.fillText(nodeCreateTime[index], nodePosition[value].x+45, nodePosition[value].y+30);
            }else{
                ctx.font = 'normal 16px "Microsoft JhengHei"';
                ctx.fillText(nodeAuthors[index], nodePosition[value].x+30, nodePosition[value].y+10);
                ctx.font = 'normal 12px "Microsoft JhengHei"';
                ctx.fillText(nodeCreateTime[index], nodePosition[value].x+30, nodePosition[value].y+30);
            }                
        });
    });
    network.on('click', function(params){
        params.event = "[click]";
        console.log(params.nodes);
        let nodeInfo = JSON.parse(JSON.stringify(params, null, 4));
        if(nodeInfo.nodes){
            let clickedNode=nodes.get({
                filter: function(item){
                    return (nodeInfo.nodes.includes(item.id));
                }
            });
            var clickedNodeId=[];
            clickedNode.forEach(element => {
                clickedNodeId.push(element.id);
            });
            currentNodeId=clickedNodeId;
        }else{
            currentNodeId.length=0;
        }
        // console.log('currentNodeId: '+currentNodeId);
    });
    network.on("doubleClick", function(params) {
        params.event = "[doubleClick]";
        let nodeInfo = JSON.parse(JSON.stringify(params, null, 4));
        currentNodeId.length=0;
        if(nodeInfo.nodes[0]){
            var clickedNode=nodes.get({
                filter: function(item){
                    return (item.id==nodeInfo.nodes[0]);
                }
            });
            currentNodeId.push(clickedNode[0].id);
            let type= clickedNode[0].group;
            console.log('currentNodeId: '+currentNodeId+' '+type);
            if(type=='idea'||type=='rise_above'){
                let ajaxResults=ajaxGetNodeData("/data_get/idea_node", clickedNode[0].id, memberInfo.groupId);
                console.log(ajaxResults);
                console.log('ajaxResults[0].member_id='+ajaxResults.ideaData[0].member_id+' memberInfo.memberId='+memberInfo.memberId);
                $("#viewIdea .modal-title").text(ajaxResults.ideaData[0].node_title);
                $("#viewIdea .modal-body .nodeCountInfo").html('<i class="far fa-eye"></i>  '+ajaxResults.ideaData[0].node_read_count);
                $("#viewIdea .modal-body .nodeContent").html(ajaxResults.ideaData[0].idea_content);
                let attachmentData= ajaxResults.attachmentData;
                let downloadMsg='';
                attachmentData.forEach(function(value){
                    let path='/files/group'+attachmentData[0].group_id+'/'+attachmentData[0].attachment_name;
                    downloadMsg+= '<a href='+path+' download='+value.attachment_name+'><i class="fas fa-download"></i> '+value.attachment_name+'</a><br>';
                });
                $('#viewIdea .modal-body .nodeAttachment').html(downloadMsg);
                $("#viewIdea .modal-footer .nodeInfo").html('<h6><span class="badge badge-light">'+ajaxResults.ideaData[0].node_author+'</span> '+ajaxResults.ideaData[0].create_time+'</h6>');
                if(ajaxResults.ideaData[0].member_id == memberInfo.memberId){
                    $("#viewIdea .editNode").show();
                    $('.editModal .ideaTitle').val(ajaxResults.ideaData[0].node_title);
                    $('.editModal .ideaContent').summernote('code', ajaxResults.ideaData[0].idea_content);
                }else{
                    $("#viewIdea .editNode").hide();
                }
                if(ajaxResults.checkFavorite){
                    $('#viewIdea .btn-addFavorite').hide();
                    $('#viewIdea .btn-removeFavorite').show();
                }else{
                    $('#viewIdea .btn-addFavorite').show();
                    $('#viewIdea .btn-removeFavorite').hide();
                }
                $("#viewIdea").modal();
            }else if(type=='key_question'){
                let ajaxResults=ajaxGetNodeData("/data_get/key_question_node", clickedNode[0].id, memberInfo.groupId);
                console.log(ajaxResults);
                let keyQuestionData= ajaxResults.keyQuestionData[0];
                $("#viewKeyQuestion .modal-title").text(keyQuestionData.node_title);
                $("#viewKeyQuestion .modal-body .nodeCountInfo").html('<i class="far fa-eye"></i>  '+keyQuestionData.node_read_count);
                $("#viewKeyQuestion .modal-body .nodeContent").html(keyQuestionData.key_question_info);
                let attachmentData= ajaxResults.attachmentData;
                let downloadMsg='';
                attachmentData.forEach(function(value){
                    let path='/files/group'+attachmentData[0].group_id+'/'+attachmentData[0].attachment_name;
                    downloadMsg+= '<a href='+path+' download='+value.attachment_name+'><i class="fas fa-download"></i> '+value.attachment_name+'</a><br>';
                });
                $('#viewKeyQuestion .modal-body .nodeAttachment').html(downloadMsg);
                $("#viewKeyQuestion .modal-footer .nodeInfo").html('<h6><span class="badge badge-light">'+keyQuestionData.node_author+'</span> '+keyQuestionData.create_time+'</h6>');
                if(keyQuestionData.member_id == memberInfo.memberId){
                    $("#viewKeyQuestion .editNode").show();
                    $('.editModal .keyQuestionTitle').val(keyQuestionData.node_title);
                    // $('.editModal .keyQuestionInfo').val(keyQuestionData.key_question_info);
                    $('.editModal .keyQuestionInfo').summernote('code', keyQuestionData.key_question_info);
                }else{
                    $("#viewKeyQuestion .editNode").hide();
                }
                $("#viewKeyQuestion").modal();
            }else if(type=='directive_observation'){
                let ajaxResults=ajaxGetNodeData("/data_get/directive_observation_node", clickedNode[0].id, memberInfo.groupId);
                console.log(ajaxResults);
                $("#viewDirectiveObservation .modal-title").text(ajaxResults[0].node_title);
                $("#viewDirectiveObservation .modal-body .practiceInfo").html(ajaxResults[0].directive_observation_info);
                $("#viewDirectiveObservation .modal-body .nodeCountInfo").html('<i class="far fa-eye"></i>  '+ajaxResults[0].node_read_count);
                $("#viewDirectiveObservation .modal-footer .nodeInfo").html('<h6><span class="badge badge-light">'+ajaxResults[0].node_author+'</span> '+ajaxResults[0].create_time+'</h6>');
                if(ajaxResults[0].member_id == memberInfo.memberId){
                    $("#viewDirectiveObservation .editNode").show();
                    $('.editModal .directiveObservationTitle').val(ajaxResults[0].node_title);
                    // $('.editModal .directiveObservationInfo').val(ajaxResults[0].directive_observation_info);
                    $('.editModal .directiveObservationInfo').summernote('code', ajaxResults[0].directive_observation_info);
                }else{
                    $("#viewDirectiveObservation .editNode").hide();
                }
                //取得該直接觀察的紀錄
                ajaxResults=ajaxGetNodeData("/data_get/directive_observation_record", clickedNode[0].id);
                console.log(ajaxResults);
                directiveObservationRecordTableData.length=0;
                $.each(ajaxResults, function(index, value){
                    let dataObj= new Object();
                    dataObj.recordType='directive_observation';
                    dataObj.recordId= value.directive_observation_record_id;
                    dataObj.memberId= value.member_id;
                    dataObj.recordAuthor= value.member_name;
                    dataObj.record= value.directive_observation_record;
                    if(value.member_id == memberInfo.memberId){
                        dataObj.operate= '<a class="delete text-danger" href="javascript:void(0)" title="刪除"><i class="fas fa-trash-alt"></i></a>'
                        +'&nbsp;<a class="edit text-info" href="javascript:void(0)" title="修改"><i class="fas fa-edit"></i></a>';
                    }else{
                        dataObj.operate= '';
                    }
                    directiveObservationRecordTableData.push(dataObj);
                    delete dataObj;
                    // directiveObservationRecordTableData.push({
                    //     'id': index+1,
                    //     'directiveObservationRecordId': value.directive_observation_record_id,
                    //     'memberId': value.member_id,
                    //     'directiveObservationRecordAuthor': value.member_name,
                    //     'directiveObservationRecord': value.directive_observation_record,
                    //     'operate': '<button class="btn btn-outline-primary edit"><i class="fas fa-edit"></i></button>'
                    // });
                });
                $directiveObservationRecordTable.bootstrapTable('load', directiveObservationRecordTableData);
                
                $("#viewDirectiveObservation").modal();
            }else if(type=='operational_observation'){
                var ajaxResults=ajaxGetNodeData("/data_get/operational_observation_node", clickedNode[0].id, memberInfo.groupId);
                console.log(ajaxResults);
                let $viewModal= $("#viewOperationalObservation");
                let $editModal= $("#editOperationalObservation");
                $viewModal.find(".modal-title").text(ajaxResults[0].node_title);
                $viewModal.find('.modal-body .nodeCountInfo').html('<i class="far fa-eye"></i>  '+ajaxResults[0].node_read_count);
                $viewModal.find(".modal-body .practiceInfo").append(ajaxResults[0].operational_observation_info);
                let materials=JSON.parse(ajaxResults[0].materials);
                let steps=ajaxResults[0].steps.split(',');
                let newText= '<hr><span class="border border-secondary">材料</span><br><br>';
                materials.forEach(function(value){
                    newText += '<p>'+value.name+': '+value.number+'</p>';
                });
                newText += '<hr><span class="border border-secondary">步驟</span><br><br>';
                steps.forEach(function(value, index){
                    newText += '<p>'+(index+1)+'. '+value+'</p>';
                });
                $viewModal.find(".modal-body .practiceInfo").append(newText);
                $viewModal.find(".modal-footer .nodeInfo").html('<h6><span class="badge badge-light">'+ajaxResults[0].node_author+'</span> '+ajaxResults[0].create_time+'</h6>');
                if(ajaxResults[0].member_id == memberInfo.memberId){
                    $viewModal.find(".editNode").show();
                    $editModal.find('.operationalObservationTitle').val(ajaxResults[0].node_title);
                    $editModal.find('.operationalObservationInfo').summernote('code', ajaxResults[0].operational_observation_info);
                    let newRow= '';
                    steps.forEach(function(value, index){
                        newRow+= '<tr><td>'+(index+1)+'</td>';
                        newRow += '<td><input type="text" class="form-control step" name="step' + (index+1) + '" value="'+value+'" /></td>';
                        newRow += '<td><input type="button" class="btn btn-md btn-danger delStep" value="X"></td></tr>';
                    });
                    $editModal.find('.modal-body').find('table.stepTable tbody').append(newRow);
                    let newMaterial= '';
                    materials.forEach(function(value){
                        newMaterial+= '<div class="col-sm-3"><div class="card"><div class="card-header materialName">';
                        newMaterial+= value.name;
                        newMaterial+= '<button type="button" class=" close delMaterial"><span>&times;</span></button></div><div class="card-body"><p class="card-text materialNumber">';
                        newMaterial+= value.number;
                        newMaterial+= '</p></div></div></div>';
                    });                        
                    $editModal.find(".modal-body").find('.materials').append(newMaterial);
                }else{
                    $viewModal.find(".editNode").hide();
                }
                //取得該操作觀察的紀錄
                ajaxResults=ajaxGetNodeData("/data_get/operational_observation_record", clickedNode[0].id);
                console.log(ajaxResults);
                operationalObservationRecordTableData.length=0;
                $.each(ajaxResults, function(index, value){
                    let dataObj= new Object();
                    dataObj.recordType='operational_observation';
                    dataObj.recordId= value.operational_observation_record_id;
                    dataObj.memberId= value.member_id;
                    dataObj.recordAuthor= value.member_name;
                    dataObj.record= value.operational_observation_record;
                    if(value.member_id == memberInfo.memberId){
                        dataObj.operate= '<a class="delete text-danger" href="javascript:void(0)" title="刪除"><i class="fas fa-trash-alt"></i></a>'
                        +'&nbsp;<a class="edit text-info" href="javascript:void(0)" title="修改"><i class="fas fa-edit"></i></a>';
                    }else{
                        dataObj.operate= '';
                    }
                    operationalObservationRecordTableData.push(dataObj);
                    delete dataObj;
                });
                $operationalObservationRecordTable.bootstrapTable('load', operationalObservationRecordTableData);
                $viewModal.modal(); 
            }else if(type=='experiment'){
                let ajaxResults=ajaxGetNodeData("/data_get/experiment_node", clickedNode[0].id, memberInfo.groupId);
                console.log(ajaxResults);
                let $viewModal= $("#viewExperiment");
                let $editModal= $("#editExperiment");
                $viewModal.find(".modal-title").text('[研究問題] '+ajaxResults[0].node_title);
                $viewModal.find('.modal-body .nodeCountInfo').html('<i class="far fa-eye"></i>  '+ajaxResults[0].node_read_count);
                let practiceInfoContent= '<span class="border border-secondary">研究假設</span><br><br>'
                +ajaxResults[0].research_hypothesis
                +'<hr><span class="border border-secondary">研究動機</span><br><br>'
                +ajaxResults[0].research_motivation;
                $viewModal.find(".modal-body .practiceInfo").append(practiceInfoContent);
                $viewModal.find(".modal-body .lastEditor").text('最後編輯者：'+ajaxResults[0].last_editor);
                if(ajaxResults[0].materials){
                    let materials= JSON.parse(ajaxResults[0].materials);
                    console.log(materials);
                    let newMaterial= '';
                    materials.forEach(function(value){
                        newMaterial+= '<div class="col-sm-3"><div class="card"><div class="card-header materialName">';
                        newMaterial+= value.name;
                        newMaterial+= '<button type="button" class=" close delMaterial"><span>&times;</span></button></div><div class="card-body"><p class="card-text materialNumber">';
                        newMaterial+= value.number;
                        newMaterial+= '</p></div></div></div>';
                    });                        
                    $viewModal.find(".modal-body").find('.materials').append(newMaterial);
                } 
                if(ajaxResults[0].steps){
                    let steps=ajaxResults[0].steps.split(',');
                    console.log(steps);
                    let newRow= '';
                    steps.forEach(function(value, index){
                        newRow+= '<tr><td>'+(index+1)+'</td>';
                        newRow += '<td><input type="text" class="form-control step" name="step' + (index+1) + '" value="'+value+'" /></td>';
                        newRow += '<td><input type="button" class="btn btn-md btn-danger delStep" value="X"></td></tr>';
                    });
                    $viewModal.find('.modal-body').find('table.stepTable tbody').append(newRow);
                }
                if(ajaxResults[0].member_id == memberInfo.memberId){
                    $viewModal.find(".editNode").show();
                    $editModal.find('.researchProblem').val(ajaxResults[0].node_title);
                    $editModal.find('.researchHypothesis').val(ajaxResults[0].research_hypothesis);
                    $editModal.find('.researchMotivation').summernote('code', ajaxResults[0].research_motivation);
                }else{
                    $viewModal.find(".editNode").hide();
                }
                if(ajaxResults[0].experiment_record_node_id>= 0){
                    // $('#viewExperimentRecordNode').show();
                    $('#createExperimentRecordNode').hide();
                }else if(ajaxResults[0].materials && ajaxResults[0].steps){
                    // $('#viewExperimentRecordNode').hide();
                    $('#createExperimentRecordNode').show();
                }else{
                    // $('#viewExperimentRecordNode').hide();
                    $('#createExperimentRecordNode').hide();
                }
                $viewModal.find(".modal-footer .nodeInfo").html('<h6><span class="badge badge-light">'+ajaxResults[0].node_author+'</span> '+ajaxResults[0].create_time+'</h6>');
                $viewModal.modal();
            }else if(type=='experiment_record'){
                let ajaxResults=ajaxGetNodeData("/data_get/experiment_record_node", clickedNode[0].id, memberInfo.groupId);
                console.log(ajaxResults);
                let $viewModal= $("#viewExperimentRecord");
                $viewModal.find(".modal-title").text('[研究紀錄] '+ajaxResults[0].node_title);
                $viewModal.find('.modal-body .nodeCountInfo').html('<i class="far fa-eye"></i>  '+ajaxResults[0].node_read_count);
                let practiceInfoContent= '<span class="border border-secondary">研究假設</span><br><br>'
                    +ajaxResults[0].research_hypothesis
                    +'<hr><span class="border border-secondary">研究動機</span><br><br>'
                    +ajaxResults[0].research_motivation;
                $viewModal.find(".modal-body .practiceInfo").append(practiceInfoContent);
                if(ajaxResults[0].materials){
                    let materials= JSON.parse(ajaxResults[0].materials);
                    let newText= '<hr><span class="border border-secondary">材料</span><br><br>';
                    materials.forEach(function(value){
                        newText += '<p>'+value.name+': '+value.number+'</p>';
                    });
                    $viewModal.find(".modal-body .practiceInfo").append(newText);
                } 
                if(ajaxResults[0].steps){
                    let steps=ajaxResults[0].steps.split(',');
                    let newText= '<hr><span class="border border-secondary">步驟</span><br><br>';
                    steps.forEach(function(value, index){
                        newText += '<p>'+(index+1)+'. '+value+'</p>';
                    });
                    $viewModal.find(".modal-body .practiceInfo").append(newText);
                }
                $viewModal.find(".modal-footer .nodeInfo").html('<h6><span class="badge badge-light">'+ajaxResults[0].node_author+'</span> '+ajaxResults[0].create_time+'</h6>');
                experimentRecordTableData.length=0;
                if(ajaxResults[0].experiment_record_id){                    
                    $.each(ajaxResults, function(index, value){
                        let dataObj= new Object();
                        dataObj.recordType='experiment';
                        dataObj.recordId= value.experiment_record_id;
                        dataObj.memberId= value.member_id;
                        dataObj.recordAuthor= value.member_name;
                        dataObj.record= value.experiment_record;
                        if(value.member_id == memberInfo.memberId){
                            dataObj.operate= '<a class="delete text-danger" href="javascript:void(0)" title="刪除"><i class="fas fa-trash-alt"></i></a>'
                            +'&nbsp;<a class="edit text-info" href="javascript:void(0)" title="修改"><i class="fas fa-edit"></i></a>';
                        }else{
                            dataObj.operate= '';
                        }
                        experimentRecordTableData.push(dataObj);
                        delete dataObj;
                    });                   
                }
                $experimentRecordTable.bootstrapTable('load', experimentRecordTableData);
                $viewModal.modal();
            }else if(type=='attachment'){
                var ajaxResults=ajaxGetNodeData("/data_get/attachment", clickedNode[0].id, memberInfo.groupId);
                console.log(ajaxResults);
                var path='/files/group'+ajaxResults[0].group_id+'/'+ajaxResults[0].attachment_name;
                var msg='<a href='+path+' download='+ajaxResults[0].attachment_name+'>下載</a><br>';
                let attachmentNameArray= ajaxResults[0].attachment_name.split(".");
                var format = attachmentNameArray[attachmentNameArray.length-1];
                format = format.toLowerCase();
                console.log(format);
                if(format == "png" || format =="jpg" || format =="jpeg"){
                    msg += '<img class="img-fluid" height="100%" src="'+path+'" alt='+ajaxResults[0].attachment_name+'>';
                }else if(format == "pdf"){
                    msg += '<iframe src="'+ path +'" height="500px" width="100%"></iframe>';
                }else if(format == "mp4"){
                    msg += '<video width="100%" height="500px" controls><source src="'+path+'" type="video/mp4"></video>';
                }
                $(".viewModal.viewAttachment .modal-title").text(ajaxResults[0].node_title);
                $(".viewModal.viewAttachment .modal-body .nodeCountInfo").html('<i class="far fa-eye"></i>  '+ajaxResults[0].node_read_count);
                $(".viewModal.viewAttachment .modal-body .nodeContent").html(msg);
                $(".viewModal.viewAttachment .modal-footer .nodeInfo").text(ajaxResults[0].node_author+"  "+ajaxResults[0].node_create_time);                              
                $(".viewModal.viewAttachment").modal();
            }else{
                alert("沒有符合的type");
            }
        }
    }); 
    network.on('oncontext', function(params){
        //若是右鍵在node上，就將那個node加入被選的清單
        console.log(this.getNodeAt(params.pointer.DOM));
        if(this.getNodeAt(params.pointer.DOM)!==undefined && !currentNodeId.includes(this.getNodeAt(params.pointer.DOM))){
            currentNodeId.push(this.getNodeAt(params.pointer.DOM));
            console.log(currentNodeId);
        }else{
            currentNodeId.length=0;
        }
        //若被選清單是空的，就不能使用右鍵的清單
        let $trigger = $('#mynetwork');
        if(currentNodeId.length == 0) $trigger.contextMenu(false);
        else $trigger.contextMenu(true);
        this.redraw();//這行很重要
    });
    network.on('dragEnd', function(params){
        params.event.preventDefault();
        params.event = "[dragEnd]";
        let eventData = JSON.parse(JSON.stringify(params, null, 4));
        let clickedNodeId=eventData.nodes;
        if(clickedNodeId.length > 0){
            let position= network.getPositions(clickedNodeId);
            let updateNodeData=[];
            for(node in position){
                let singleNodeData={
                    node_id: parseInt(node),
                    x: parseInt(position[node].x),
                    y: parseInt(position[node].y)
                };
                updateNodeData.push(singleNodeData);          
            }
            socket.emit('update node position', {memberInfo: memberInfo, updateNodeData: updateNodeData});
        }        
    });
    $('.modal').on('hidden.bs.modal', function (e) {
        $(this).find("input:not(.btn),textarea,select")
        .val('')
        .end()
        .find("input[type=checkbox], input[type=radio]")
        .prop("checked", "")
        .end()
        .find('.build-on').remove().end();
        $(this).find('.editor').summernote('code', '');
        $(this).find('.modal-body .practiceInfo').html('');
        $(this).find('#ideaFiles').val('');
        $(this).find('.modal-body .fileList').html('');
        if($(this).find('video').length >0)
            $(this).find('video')[0].pause();//關掉modal時，將影片暫停
    });
    $('.modal').on('shown.bs.modal', function (e) {
        $(this).find('table').bootstrapTable('resetView');        
    });
    $('.editor').summernote({
        dialogsInBody: true,
        height: 200,
        disableDragAndDrop: true,
        toolbar: [
            ['style', ['bold', 'italic', 'underline', 'clear']],
            ['font', ['strikethrough', 'superscript', 'subscript']],
            ['fontname', ['fontname']],
            ['fontsize', ['fontsize']],
            ['color', ['color']],
            ['para', ['ul', 'ol', 'paragraph']],
            ['insert', ['table', 'link', 'picture', 'video']],
            ['view', ['codeview']]
        ],
        callbacks: {
            onImageUpload: function(image){
                editor = $(this);
                console.log(image.length);
                console.log(image);
                let groupId=memberInfo.groupId;  
                for(let i=0;i<image.length;i++){
                    let data=new FormData();
                    data.append('image', image[i]);
                    data.append('groupId', groupId);
                    $.ajax({
                        url: '/group/upload_textarea_image',
                        cache: false,
                        contentType: false,
                        processData: false,
                        data: data,
                        type: 'POST',
                        success: function(url){
                            editor.summernote('insertImage', url.imageUrl, 'test.jpg');
                        },
                        error: function(data){
                            console.log(data);
                        }
                    });
                }                         
            }
        }
    });
    $.contextMenu({
        selector: '#mynetwork', 
        callback: function(key, options) {
            var m = "clicked: " + key;
            window.console && console.log(m) || alert(m); 
        },
        items: {
            "addKeyQuestion": {
                name: "回覆關鍵提問",
                callback: function(itemKey, opt, e){
                    $('#addKeyQuestion').modal('show');
                },
                visible: function(key, opt){
                    return !!isTeacher;
                }
            },
            "addIdea": {
                name: "回覆想法",
                callback: function(itemKey, opt, e){
                    $('#addIdea').modal('show');
                }
            },
            "addRiseAbove": {
                name: "提出昇華的想法",
                callback: function(itemKey, opt, e){
                    $('#addRiseAbove').modal('show');
                }
            },
            "sep1": "---------",
            "addPractice": {
                name: "建立實作",
                "items": {
                    "addDirectiveObservation": {
                        name: "直接觀察",
                        callback: function(itemKey, opt, e){
                            $('#addDirectiveObservation').modal('show');
                        }
                    },
                    "addOperationalObservation": {
                        name: "進行操作",
                        callback: function(itemKey, opt, e){
                            $('#addOperationalObservation').modal('show');
                        }
                    },
                    "addExperiment": {
                        name: "進行實驗",
                        callback: function(itemKey, opt, e){
                            $('#addExperiment').modal('show');
                        }
                    }
                }
            }
        }
    });
    knowledgeBuildScaffold.forEach(function(value){
        let newBtn= '<button type="button" class="btn btn-outline-warning scaffold">'+value+'</button>';
        $('.inputModal .scaffoldList .btn-group-vertical').append(newBtn);
        $('.editModal .scaffoldList .btn-group-vertical').append(newBtn);
    });
    $('.scaffold').on('click', function(){
        let newContent='<span style="background-color: rgb(255, 255, 0);"><b>'+$(this).text()+'</b></span>';
        $(this).closest('.modal-body').find('.editor').summernote('pasteHTML', newContent);
    });
    $('.uploadFile').change(function(e){
        let fileList= $(this).closest('.form-group').find('.fileList');
        let fileNames='';
        let files= e.target.files;
        files.forEach(element => {   
            fileNames+= '<li>'+element.name+'</li>';
        });
        fileList.html('<ul>'+fileNames+'</ul>');
    });
    //顯示兩個modal
    $(document).on({
        'show.bs.modal': function() {
          var zIndex = 1040 + (10 * $('.modal:visible').length);
          $(this).css('z-index', zIndex);
          setTimeout(function() {
            $('.modal-backdrop').not('.modal-stack').css('z-index', zIndex - 1).addClass('modal-stack');
          }, 0);
        },
        'hidden.bs.modal': function() {
          if ($('.modal:visible').length > 0) {
            // restore the modal-open class to the body element, so that scrolling works
            // properly after de-stacking a modal.
            setTimeout(function() {
              $(document.body).addClass('modal-open');
            }, 0);
          }
        }
      }, '.modal');
});