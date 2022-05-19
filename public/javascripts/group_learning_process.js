let knowledgeBuildScaffold=["我想知道","我的想法","我的理論","新資訊或參考來源","另一個觀點是","我覺得更好的想法","有發展性的想法"];
function randomRgba(transparency) {
    let o = Math.round, r = Math.random, s = 255;
    let color_r=o(r()*s), color_g=o(r()*s), color_b=o(r()*s);
    return ['rgb('+color_r+','+color_g+','+color_b+')', 'rgba('+color_r+','+color_g+','+color_b+','+transparency+')'];
    // return 'rgba(' + o(r()*s) + ',' + o(r()*s) + ',' + o(r()*s) + ',' + r().toFixed(1) + ')';
}
function getOldestDate(data){
    return data.reduce(function(prev, curr){
        return (prev.day< curr.day)?prev:curr;
    });
}
function getLatestDate(data){
    return data.reduce(function(prev, curr){
        return (prev.day> curr.day)?prev:curr;
    });
}
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
    $('#func-nav .navbar-nav .nav-item:eq(2)').addClass('active');
    let ideaActionData= JSON.parse($('#ideaActionData').text());
    let ideaScaffoldData= JSON.parse($('#ideaScaffoldData').text());    
    let ideaIncreaseData= JSON.parse($('#ideaIncreaseData').text());
    console.log(ideaActionData);
    console.log(ideaScaffoldData);
    console.log(ideaIncreaseData);
    console.log(memberInfo.memberIdentity);
    let ideaActionMemberList= ideaActionData.viewNodeData.map(function(value,index){
        if(value.memberName == memberInfo.memberName || memberInfo.memberIdentity=="老師"){
            return value.memberName;
        }else{
            return (String.fromCharCode(65+index));
        }
    });
    let viewCountList=[], addCountList=[], reviseCountList=[], buildOnCountList=[];
    ideaActionData.viewNodeData.forEach(function(value){
        if(value.count.length== 0){
            viewCountList.push(0);
        }else{
            viewCountList.push(value.count.filter(function(item){return item.node_type=='idea'||item.node_type=='rise_above'})
            .map(function(item){return item.number})[0]);
        }        
    });
    ideaActionData.addNodeData.forEach(function(value){
        if(value.count.length== 0){
            addCountList.push(0);
        }else{
            addCountList.push(value.count.filter(function(item){return item.node_type=='idea'||item.node_type=='rise_above'})
            .map(function(item){return item.number})[0]);
        }
    });
    ideaActionData.reviseNodeData.forEach(function(value){
        if(value.count.length== 0){
            reviseCountList.push(0);
        }else{
            reviseCountList.push(value.count.filter(function(item){return item.node_type=='idea'||item.node_type=='rise_above'})
            .map(function(item){return item.number})[0]);
        }
    });
    ideaActionData.buildOnNodeData.forEach(function(value){
        if(value.count.length== 0){
            buildOnCountList.push(0);
        }else{
            buildOnCountList.push(value.count.filter(function(item){return item.node_type=='idea'||item.node_type=='rise_above'})
            .map(function(item){return item.number})[0]);
        }       
    });
    let ideaActionCTX=document.getElementById('ideaActionCanvas').getContext('2d');
    let ideaActionChart= new Chart(ideaActionCTX, {
        type: 'horizontalBar',
        data: {
            labels: ideaActionMemberList,
            datasets: [{
                label: '檢視',
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
                borderColor: 'rgba(255, 99, 132, 1)',
                data: viewCountList
            },{
                label: '新增',
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                data: addCountList
            },{
                label: '修改',
                backgroundColor: 'rgba(255, 206, 86, 0.6)',
                borderColor: 'rgba(255, 206, 86, 1)',
                data: reviseCountList
            },{
                label: '回覆',
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                data: buildOnCountList
            }]
            
        },
        options: {
            scales: {
                xAxes: [{
                    ticks: {
                        beginAtZero: true
                    },
                    scaleLabel: {
                        display: true,
                        labelString: '次數' 
                    }
                }]
            }
        }
    });
    let ideaScaffoldCTX=document.getElementById('ideaScaffoldCanvas').getContext('2d');
    let ideaScaffoldChart= new Chart(ideaScaffoldCTX, {
        type: 'radar',
        data: {
            labels: knowledgeBuildScaffold,
            datasets: []
        },
        options: {
            scale: {
                ticks:{
                    beginAtZero: true,
                    stepSize: 1
                }
            }
        }
    });
    let ideaScaffoldMemberList=[];
    ideaScaffoldData.forEach(function(value, index){
        let scaffoldCountList=[0,0,0,0,0,0,0];
        ideaScaffoldMemberList.push(value.memberName);
        value.count.forEach(function(value){
            let strToJson= JSON.parse(value.idea_scaffold);
            knowledgeBuildScaffold.forEach(function(value, index){
                if(strToJson[value]){
                    scaffoldCountList[index]+=strToJson[value];
                }
            });
        });
        // console.log(scaffoldCountList);
        let randomColor= randomRgba(0.7);        
        ideaScaffoldChart.data.datasets.push({
            label: value.memberName==memberInfo.memberName||memberInfo.memberIdentity=="老師"?value.memberName:String.fromCharCode(65+index),
            data: scaffoldCountList,
            backgroundColor: randomColor[1],
            borderColor: randomColor[0],
            borderWidth: 1
        });
        ideaScaffoldChart.update();
    });
    let container = document.getElementById("ideaIncreaseGraph");
    let names= {};
    var groups = new vis.DataSet();
    ideaScaffoldData.forEach(function(value, index){
        let dataId= (value.memberName == memberInfo.memberName || memberInfo.memberIdentity=="老師")?value.memberName:(String.fromCharCode(65+index));
        names[value.memberId]= dataId;
        console.log(names);
        groups.add({
            id: dataId,
            content: dataId,
            options: {
                drawPoints: {
                    style: "square", // square, circle
                },
                shaded: {
                    orientation: "bottom", // top, bottom
                },
            }
        });
    });
    console.log(names);
    let items= [];
    let sum= {};
    ideaIncreaseData.forEach(function(value, index){
        console.log(value);
        console.log(sum);
        let dataId= names[value.member_id];
        if(sum.hasOwnProperty(value.member_id)){
            sum[value.member_id]+= value.node_count;
        }else{
            sum[value.member_id]= value.node_count;
        }        
        items.push({ 
            x: value.day,
            y: sum[value.member_id], 
            group: dataId, 
            label: {
                content: sum[value.member_id],
                xyOffset: 5
            }});
    });
    let startDate= getOldestDate(ideaIncreaseData).day;
    console.log(startDate);
    let endtDate= getLatestDate(ideaIncreaseData).day;
    console.log(endtDate);
    var dataset = new vis.DataSet(items);
    var options = {
        defaultGroup: "ungrouped",
        legend: true,
        start: startDate,
        end: endtDate,
        timeAxis: {
            scale: 'day'
        }
    };
    var graph2d = new vis.Graph2d(container, dataset, groups, options);
});