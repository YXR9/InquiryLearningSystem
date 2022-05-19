let editorSizeLimit = 600000;
let knowledgeBuildScaffold=["我的想法","我覺得更好的想法","我想知道","這個想法不能解釋","舉例和參考來源","我的總結"];
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
function countByteLength(str){
    let b= str.match(/[^\x00-\xff]/g);
    return (str.length+ (!b? 0: b.length));
}
$(document).ready(function(){
    // 在新增想法的modal內放入鷹架
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
});