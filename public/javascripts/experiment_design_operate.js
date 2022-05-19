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
