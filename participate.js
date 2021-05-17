var navListItems = $('div.setup-panel div a'),
    allWells = $('.setup-content'),
    allNextBtn = $('.nextBtn'),
    allPrevBtn = $('.prevBtn');
    allWells.hide();

navListItems.click(function (e) {
    e.preventDefault();
    var $target = $($(this).attr('href')),
        $item = $(this);

    if (!$item.hasClass('disabled')) {
        navListItems.removeClass('btn-light').addClass('btn-primary');
        $item.addClass('btn-light');
        allWells.hide();
        $target.show();
        $target.find('input:eq(0)').focus();
    }
});

allPrevBtn.click(function(){
    var curStep = $(this).closest(".setup-content"),
        curStepBtn = curStep.attr("id"),
        prevStepSteps = $('div.setup-panel div a[href="#' + curStepBtn + '"]').parent().prev().children("a");

        prevStepSteps.removeAttr('disabled').trigger('click');
});

allNextBtn.click(function(){
    var curStep = $(this).closest(".setup-content"),
        curStepBtn = curStep.attr("id"),
        nextStepWizard = $('div.setup-panel div a[href="#' + curStepBtn + '"]').parent().next().children("a"),
        curInputs = curStep.find("input[type='text'],input[type='url']"),
        isValid = true;

    $(".form-group").removeClass("has-error");
    for(var i=0; i< curInputs.length; i++){
        if (!curInputs[i].validity.valid){
            isValid = false;
            $(curInputs[i]).closest(".form-group").addClass("has-error");
        }
    }

    if (isValid)
        nextStepWizard.removeAttr('disabled').trigger('click');
});

$('div.setup-panel div a.btn-light').trigger('click');

function toggle(target) {
    if (target.data('selected')) {
        target.removeClass('btn-primary');      
        target.addClass('btn-outline-primary');  
    }
    else {
        target.removeClass('btn-outline-primary');
        target.addClass('btn-primary');
    }
    target.data('selected', !target.data('selected'));
    return !target.data('selected');
}

$('#location-add').click(function(event) {
    console.log('hello');
    if (toggle($(event.target))) $('#location-input').addClass('d-none');
    else $('#location-input').removeClass('d-none');
});

$('#location-add-tag').click(function() {
    if ($('#location-input-text').val() != '') {
        $('#location-add').before(`<button type="button" class="btn btn-primary rounded-pill me-2 selectable" data-selected=true>${$('#location-input-text').val()}</button>`);
        $('#location-input-text').val('');
    }
});

$('#activity-add').click(function(event) {
    console.log('hello');
    if (toggle($(event.target))) $('#activity-input').addClass('d-none');
    else $('#activity-input').removeClass('d-none');
});

$('#activity-add-tag').click(function() {
    if ($('#activity-input-text').val() != '') {
        $('#activity-add').before(`<button type="button" class="btn btn-primary rounded-pill me-2 selectable" data-selected=true>${$('#activity-input-text').val()}</button>`);
        $('#activity-input-text').val('');
    }
});

$('.selectable').click(function(event) {
    toggle($(event.target));
});

