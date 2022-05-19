var isChange= false;
$(document).ready(function(){
    let memberInfo={
        memberId: parseInt($("#memberId").text()),
        memberName: $("#memberName").text(),
        groupId: parseInt($("#groupId").text()),
        activityId: parseInt($("#activityId").text())
    }
    $('.nav-link#goGroup').attr('href', '/group?activityId='+memberInfo.activityId+'&groupId='+memberInfo.groupId);
    $('.nav-link#goPracticeResult').attr('href', '/group/practice_results?activityId='+memberInfo.activityId+'&groupId='+memberInfo.groupId);
    $('.nav-link#goLearningProcess').attr('href', '/group/learning_process?activityId='+memberInfo.activityId+'&groupId='+memberInfo.groupId);
    $('.nav-link#goFileManager').attr('href', '/group/file_manager?activityId='+memberInfo.activityId+'&groupId='+memberInfo.groupId);
    $('.nav-link#goPersonalIdea').attr('href', '/group/personal_space?activityId='+memberInfo.activityId+'&groupId='+memberInfo.groupId);
    $('#func-nav .navbar-nav .nav-item').removeClass('active');
    $('#func-nav .navbar-nav .nav-item:eq(4)').addClass('active');
    $('#noteText').summernote({
        codeviewFilter: false,
        codeviewIframeFilter: true,
        height: 300,
        lineHeights: '0.2',
        disableDragAndDrop: true,
        toolbar: [
            ['style', ['bold', 'italic', 'underline']],
            ['font', ['strikethrough', 'superscript', 'subscript']],
            ['fontname', ['fontname']],
            ['fontsize', ['fontsize']],
            ['color', ['color']],
            ['para', ['ul', 'ol', 'paragraph']],
            ['insert', ['table', 'link', 'picture', 'video']]
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
    let favoriteIdeaList= JSON.parse($('#favoriteIdea').text());
    console.log(favoriteIdeaList);
    favoriteIdeaList.forEach(function(value){
        let newList='<div class="card"><p class="card-header"><a class="collapsed d-block ideaTitle" data-toggle="collapse" href="#'+value.node_id+'" aria-expanded="true" aria-controls="'+value.node_id+'">'
                +'<b>'+value.node_title+'</b><i class="fa fa-chevron-down float-right chevron"></i></a></p>'
                +'<div id="'+value.node_id+'" class="collapse">'
                +'<div class="card-body mb-4">'+value.idea_content+'</div>'
                +'<div class="card-footer text-right"><small class="text-muted pr-2">建立者： '+value.node_author+'</small>'
                +'<button type="button" class="btn btn-removeFavorite btn-sm pr-2" data-toggle="modal" data-target="#checkRemoveFavorite">取消收藏</button>'
                +'&nbsp;<button type="button" class="btn btn-info btn-sm quoteNote">引用至個人筆記</button></div></div></div>';
        $('#personalIdeaList>.card-body').append(newList);
    });
    let personalNoteContent= JSON.parse($('#personalNoteContent').text());
    console.log(personalNoteContent);
    
    $('.btn-removeFavorite').on('click', function(){
        ideaNodeId= $(this).closest('.collapse').attr('id');
        $clickedBtn=$(this);
    })
    $('#checkRemoveFavorite_btn').on('click', function(){
        $.ajax({
            url:'/group/remove_favorite',
            type: 'POST',
            data: {
                nodeId: ideaNodeId
            },
            success: function(data){
                if(data.finished){
                    console.log(data);
                    $clickedBtn.closest('.card').remove();
                }else{
                    console.log(data);
                }
            },
            error: function(){
                console.log('/group/remove_favorite error');
            }
        });
    });
    $('.quoteNote').on('click', function(){
        let ideaTitle= '<p><span style="font-size: 14px; background-color: rgb(239, 198, 49);">'
        +'<font color="#fff">'+$(this).closest('.card').find('.card-header').text()+'</font></span></p>';
        // alert(ideaTitle);
        $('#noteText').summernote('pasteHTML', ideaTitle);
    });
    $('#savePersonalNote_btn').on('click', function(){
        let newText=$(this).closest('#personalNote').find('#noteText');
        let newTextContent = newText.summernote('code')?newText.summernote('code').trim():newText.val().trim();
        // alert(newTextContent);
        $.ajax({
            url: '/group/save_personal_note',
            type: 'POST',
            data: {
                groupId: memberInfo.groupId,
                noteContent: newTextContent
            },
            success: function(data){
                if(data.finished){
                    isChange= false;
                    alert('儲存成功！');
                }else{
                    alert('儲存失敗');
                }
            },
            error: function(){
                alert('儲存個人筆記失敗');
            }
        })
    });    
    $('#noteText').summernote('code',personalNoteContent.note_content);
    $('#noteText').on('summernote.change', function(we, contents, $editable) {
        isChange= true;
        console.log('isChange: '+isChange);
    });
    $(window).bind('beforeunload', function(e){
        if(isChange){
            return '筆記還沒有存檔，確定要離開嗎？';
        }
    });
});