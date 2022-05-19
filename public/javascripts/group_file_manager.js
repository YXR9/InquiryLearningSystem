let attachmentId, attachmentName, attachmentType, nodeId;
function personalOperateFormatter(value, row, index){
    let buttons='<a class="delete text-danger mr-2" href="javascript:void(0)" title="刪除檔案"><i class="fas fa-trash-alt"></i></a>'
    +'<a class="share text-success mr-2" href="javascript:void(0)" title="分享至小組"><i class="fas fa-share"></i></a>';
    if(row.attachment_type != '連結'){
        buttons+= '<a class="view text-info" href="javascript:void(0)" title="檢視檔案"><i class="fa fa-download"></i></a>';
    }else{
        buttons+= '<a class="text-info" href="'+row.attachment_name.split(',')[1]+'" target="_blank" title="檢視連結"><i class="fas fa-link"></i></a>';        
    }
    return buttons;
}
function groupOperateFormatter(value, row, index){
    if(row.attachment_type != '連結'){
        return '<a class="view text-info" href="javascript:void(0)" title="檢視檔案"><i class="fa fa-download"></i></a>';
    }else{
        return '<a class="text-info" href="'+row.attachment_name.split(',')[1]+'" target="_blank" title="檢視連結"><i class="fas fa-link"></i></a>';        
    }
}
function viewNodeFormatter(value, row, index){
    if(row.node_type=='idea')
        return '<a class="viewNode" href="javascript:void(0)" title="檢視想法標題"><img height="20rem" src="/images/icons/idea-selected.svg" alt="想法"></a>';
    else if(row.node_type=='attachment')
        return '<a class="viewNode" href="javascript:void(0)" title="檢視檔案標題"><img height="16rem" src="/images/icons/attachment.svg" alt="檔案"></a>';
    else if(row.node_type=='directive_observation')
        return '<a class="viewNode" href="javascript:void(0)" title="檢視直接觀察標題"><img height="16rem" src="/images/icons/visibility-blue.svg" alt="直接觀察"></a>';
}
function attachmentNameFormatter(value, row, index){
    if(row.attachment_type=="連結"){
        let link= row.attachment_name.split(',');
        return link[0];
    }else{
        return row.attachment_name;
    }
        
}
function setAttachmentLink(attachmentData){
    let path='/files/group'+attachmentData.group_id+'/'+attachmentData.attachment_name;
    let msg='<a class="btn btn-info btn-sm" href='+path+' download='+attachmentData.attachment_name+'><i class="fa fa-download"></i> 下載</a><br><br>';
    let attachmentNameArray= attachmentData.attachment_name.split(".");
    let format = attachmentNameArray[attachmentNameArray.length-1];
    format = format.toLowerCase();
    if(format == "png" || format =="jpg" || format =="jpeg"){
        msg += '<img class="img-fluid" height="100%" src="'+path+'" alt='+attachmentData.attachment_name+'>';
    }else if(format == "pdf"){
        msg += '<iframe src="'+ path +'" height="500px" width="100%"></iframe>';
    }else if(format == "mp4"){
        msg += '<video width="100%" height="500px" controls><source src="'+path+'" type="video/mp4"></video>';
    }
    return msg;
}
window.operate = {
    'click .delete': function(e, value, row, index){
        // alert('確定刪除'+JSON.stringify(row)+'?');
        attachmentId= row.attachment_id;
        attachmentName= row.attachment_name;
        attachmentType= row.attachment_type;
        let newHTML='';
        if(attachmentType=='連結'){
            newHTML= '<h5>是否確定刪除連結( '+row.attachment_name[0]+' )？</h5>';
        }else{
            newHTML= '<h5>是否確定刪除檔案( '+row.attachment_name+' )？</h5>';
        }       
        $('#checkRemoveFile .modal-body').html(newHTML);
        $('#checkRemoveFile').modal();
    },
    'click .share': function(e, value, row, index){
        // alert('確定分享'+JSON.stringify(row)+'?');
        attachmentId= row.attachment_id;
        attachmentType= row.attachment_type;
        // attachmentName= row.attachment_name;
        attachmentName= row.attachment_type=="連結"?row.attachment_name.split(',')[0]:row.attachment_name;
        $('#checkShareFile .modal-body').html('<h5>是否確定分享資源( '+attachmentName+' )至小組？</h5>');
        $('#checkShareFile .modal-body').append('<p class="text-danger">注意：小組檔案無法回復個人檔案且無法刪除喔！</p>');
        $('#checkShareFile').modal();
    },
    'click .view': function(e, value, row, index){
        // alert(JSON.stringify(row));
        $('#viewAttachment .modal-header .modal-title').text(row.attachment_name);
        $('#viewAttachment .modal-body').html(setAttachmentLink(row));
        $('#viewAttachment').modal();
    },
    'click .viewNode': function(e, value, row, index){
        $('#viewAttachmentFromNode .modal-header .modal-title').text(row.attachment_name);
        let nodeType=(row.node_type=='idea')?'想法':
            ((row.node_type=='attachment')?'檔案':
            ((row.node_type=='directive_observation')?'直接觀察':
            ((row.node_type=='operational_observation')?'操作觀察':
            ((row.node_type=='experiment')?'實驗':'其他'))));
        $('#viewAttachmentFromNode .modal-body').html('檔案來自<b>['+nodeType+'] '+row.node_title+'</b>');
        $('#viewAttachmentFromNode').modal();
    }
}
let $personalFileTable= $('#personalFileTable');
$personalFileTable.bootstrapTable({
    columns: [
        {field: 'attachment_name', sortable: true, title: '資源名稱', formatter: attachmentNameFormatter},
        {field: 'attachment_type', sortable: true, width: 60, title: '類型'},
        {field: 'operate', width: 100, formatter: personalOperateFormatter, events: window.operate}
    ],
    pagination: true,
    pageSize: '5',
    pageList: '[5, 10, 20]',
    search: true
});
let $groupFileTable= $('#groupFileTable');
$groupFileTable.bootstrapTable({
    columns: [
        {field: 'attachment_name', sortable: true, width: 600, title: '資源名稱', formatter: attachmentNameFormatter},
        {field: 'member_name', sortable: true, width: 100, title: '上傳者'},
        {field: 'attachment_type', sortable: true, title: '類型', filterControl: "select"},
        {field: 'isIdea', formatter: viewNodeFormatter, events: window.operate},
        {field: 'operate', formatter: groupOperateFormatter, events: window.operate}
    ],
    pagination: true,
    pageSize: '5',
    pageList: '[5, 10, 20]',
    search: true
});
var socket = io();
$(document).ready(function(){
    let memberInfo={
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
    $('#func-nav .navbar-nav .nav-item:eq(3)').addClass('active');
    let groupSharedFileData= JSON.parse($('#groupSharedFileData').text());
    console.log(groupSharedFileData);
    let personalFileData= JSON.parse($('#personalFileData').text());
    console.log(personalFileData);    
    $personalFileTable.bootstrapTable('load', personalFileData);
    $groupFileTable.bootstrapTable('load', groupSharedFileData);
    $(".uploadAttachmentButton").on('click', function(){
        let $uploadModal= $(this).closest('.modal');
        let share= $(this).closest('.modal').attr('id')=='uploadPersonalFile'?0:1;
        let formData=new FormData(); 
        console.log('share= '+share);
        formData.append('nodeId', -1);
        formData.append('share', share);
        formData.append('groupId', memberInfo.groupId);
        let files=  $(this).closest('.modal').find(".attachmentFile")[0].files;
        if(files.length> 0){
            for(let i=0;i<files.length;i++){
                formData.append('file', files[i]);
            }
        }
        if(formData.has('file')){
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
                    if(data.existAttachment){
                        alert('小組中已有一樣的檔案，請重新命名檔案再上傳！');
                        $uploadModal.find('.attachmentFile').val('');
                        $uploadModal.find('.fileList').html('');
                    }else{
                        if(share==0){
                            data.forEach(function(value, index){
                                $personalFileTable.bootstrapTable('append', value);
                            });
                        }else{
                            data.forEach(function(value, index){
                                $groupFileTable.bootstrapTable('append', value);
                            });
                        }
                        $uploadModal.modal('hide');
                    }                    
                },
                error: function(){
                    alert("檔案上傳失敗");
                }
            });
        }else{
            alert('請先選擇檔案！');
        }
    });
    $('.uploadLinkButton').on('click', function(){
        let share= $(this).closest('.modal').attr('id')=='uploadPersonalLink'?0:1;
        if($(this).closest('.modal').find('.linkName').val().trim().length> 0 
            && $(this).closest('.modal').find('.link').val().trim().length> 0){
                let link= [$(this).closest('.modal').find('.linkName').val()
                ,$(this).closest('.modal').find('.link').val()];
                // console.log(link);
                $.ajax({
                    url: '/group/add_link',
                    type: 'POST',
                    data: {
                        nodeId: -1,
                        share: share,
                        link: link.toString(),
                        groupId: memberInfo.groupId
                    },
                    success: function(data){
                        console.log(data);
                        if(share==0){
                            data.forEach(function(value, index){
                                $personalFileTable.bootstrapTable('append', value);
                            });
                        }else{
                            data.forEach(function(value, index){
                                $groupFileTable.bootstrapTable('append', value);
                            });
                        }
                    },
                    error: function(){
                        alert("檔案上傳失敗");
                    }
                });
        }else{
            alert('連結內容不能空白！');
        }        
    });
    $('#checkRemoveFile_btn').on('click', function(){
        $.ajax({
            url: '/group/remove_personal_attachment',
            type: 'POST',
            data: {
                attachmentId: attachmentId,
                attachmentName: attachmentName,
                attachmentType: attachmentType,
                groupId: memberInfo.groupId
            },
            success: function(data){
                if(data){
                    $personalFileTable.bootstrapTable('remove', {field: 'attachment_id', values: [attachmentId]});
                }
            },
            error: function(){
                alert('刪除個人檔案失敗');
            }
        });
    });
    $('#checkShareFile_btn').on('click', function(){
        $.ajax({
            url: '/group/share_attachment_to_group',
            type: 'POST',
            data: {
                attachmentId: attachmentId
            },
            success: function(data){
                console.log(data);
                if(data){
                    $personalFileTable.bootstrapTable('remove', {field: 'attachment_id', values: [attachmentId]});
                    $groupFileTable.bootstrapTable('append', data);
                }
            },
            error: function(){
                alert('刪除個人檔案失敗');
            }
        });
    });
    $('.attachmentFile').change(function(e){
        let fileList= $(this).closest('.form-group').find('.fileList');
        let fileNames='';
        let files= e.target.files;
        files.forEach(element => {
            fileNames+= '<li>'+element.name+'</li>';
        });
        fileList.html('<ul>'+fileNames+'</ul>');
    });
    $('.modal').on('hidden.bs.modal', function (e) {
        $(this).find("input:not(.btn),textarea,select").val('');
        $(this).find('.modal-body .attachmentFile').val('');
        $(this).find('.modal-body .fileList').html('');
    });
});