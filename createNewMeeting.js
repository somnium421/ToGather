import {participans_transfer} from './participants_transfer.js'
//This is for new meeting creation page

console.log("hello world")

$("#Txt_Date").datepicker({
    format: 'd-M-yyyy',
    inline: false,
    lang: 'en',
    step: 10,
    multidate: true,
    closeOnDateSelect: true,
    todayHighlight: false
}).on("changeDate", function(e) {
    console.log(e.dates);
    console.log($("#start-time").val(), e.dates[e.dates.length-1])
});;


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

var db_period

//일, 시간, 분 input 고르기
$('.timefield').removeAttr('disabled');
   
$('.timefield').change(function(){
   
    var day = $('#day').val();
    var hour = $('#hour').val();
    var min = $('#min').val();
   
    var textForDays = `<small id="periodHelp" class="form-text text-muted">${Number(day)-1}박 ${Number(day)}일 동안 모임을 진행합니다.</small>`
    var textForADay = `<small id="periodHelp" class="form-text text-muted">하루종일 모임을 진행합니다.</small>`
    var text;

    if((day) > 0){
        $('#hour').attr('disabled','disabled');
        $('#min').attr('disabled','disabled');
        if (day === "1") {
            text = textForADay;
        }else {
            text = textForDays;
        }
        
        if ($("#periodHelp").length === 0) $("#period-select").append(text);
        else $("#periodHelp").replaceWith(text);
        $('#available-time').hide();
    }
    else if((hour) > 0){
        if ($("#periodHelp").length !== 0) $("#periodHelp").hide();
        $('#day').attr('disabled','disabled');
        $('#available-time').show();
    }
    else if((min) > 0){
        if ($("#periodHelp").length !== 0) $("#periodHelp").hide();
        $('#day').attr('disabled','disabled');
        $('#available-time').show();
    }
    else{
        if ($("#periodHelp").length !== 0) $("#periodHelp").hide();
        $('#day').removeAttr('disabled');
        $('#hour').removeAttr('disabled');
        $('#min').removeAttr('disabled');
        $('#available-time').show();
    }
    db_period = {day: Number(day), hr: Number(hour), min: Number(min)};
});

var db_log_newMeeting={};

var arrPlace = [];
var arrActivity = [];

//$('#surveyPeriod').val();
$('#meetingPrivacy').click(function(){
    console.log($('#meetingPrivacy').prop('checked'));
});



$("#add-place").click (function(e){
    e.preventDefault();
    if ($('#place').val() !== ""){
        console.log($('#place').val());
        var inputText = $('#place').val();
        arrPlace.push(inputText);
        $(this).parent().parent().parent().append(`<button type="tag" class="tag-place btn btn-primary btn-sm mt-2 mx-1 rounded-pill"><span class= '${inputText}' >${inputText}</span><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x remove-tag" viewBox="0 0 16 16"><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg></button>`)
        $('#place').val("");
    }
})

$("#add-activity").click (function(e){
    e.preventDefault();
    if ($('#activity').val() !== ""){
        console.log($('#activity').val());
        var inputText = $('#activity').val();
        arrActivity.push(inputText);
        $(this).parent().parent().parent().append(`<button type="tag" class="tag-activity btn btn-primary btn-sm mt-2 mx-1 rounded-pill"><span class = '${inputText}'>${inputText}</span><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x remove-tag" viewBox="0 0 16 16"><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg></button>`)
        $('#activity').val("");
    }
    
})

$(document).on('click', '.remove-tag', function(e){
    e.preventDefault();
    if ($(e.target)[0].outerHTML.slice(1,5)==="path") {
        if ($(e.target).parent().parent().hasClass('tag-place')) arrPlace = arrPlace.filter((el) => el !== $(e.target).parent().prev().attr('class'));
        else arrActivity = arrActivity.filter((el) => el !== $(e.target).parent().prev().attr('class'));
        $(e.target).parent().parent().remove();
    }
    else {
        if ($(e.target).parent().hasClass('tag-place')) arrPlace = arrPlace.filter((el) => el !== $(e.target).prev().attr('class'));
        else arrActivity = arrActivity.filter((el) => el !== $(e.target).prev().attr('class'));
        $(e.target).parent().remove();
    }
})


var familyChart = [
    { id: 0, tags: ["blue"], partner: 1, name: "정창식", gender: "male", img: "https://cdn.balkan.app/shared/empty-img-white.svg"},
    { id: 1, pid: 0, tags: ["partner"], partner: 0, name: "김영구", gender: "female", img: "https://cdn.balkan.app/shared/empty-img-white.svg" },
    { id: 2, pid: 0, ppid: 1, tags: ["default"], partner: 3, name: "정경택", gender: "male", img: "https://cdn.balkan.app/shared/empty-img-white.svg" },
    { id: 3, pid: 2, tags: ["partner"], partner: 2, name: "김효인", gender: "female", img: "https://cdn.balkan.app/shared/empty-img-white.svg" },
    { id: 4, pid: 0, ppid: 1, tags: ["default"], partner: 5, name: "정미영", gender: "female", img: "https://cdn.balkan.app/shared/empty-img-white.svg" },
    { id: 5, pid: 4, tags: ["partner"], partner: 4, name: "김종욱", gender: "male", img: "https://cdn.balkan.app/shared/empty-img-white.svg" },
    { id: 6, pid: 0, ppid: 1, tags: ["default"], partner: 7, name: "정경남", gender: "female", img: "https://cdn.balkan.app/shared/empty-img-white.svg" },
    { id: 7, pid: 6, tags: ["partner"], partner: 6, name: "양창수", gender: "male", img: "https://cdn.balkan.app/shared/empty-img-white.svg" },
    { id: 8, pid: 0, ppid: 1, tags: ["default"], partner: 9, name: "정혜경", gender: "female", img: "https://cdn.balkan.app/shared/empty-img-white.svg" },
    { id: 9, pid: 8, tags: ["partner"], partner: 8, name: "박종두", gender: "male", img: "https://cdn.balkan.app/shared/empty-img-white.svg" },
    { id: 10, pid: 2, ppid: 3, tags: ["default"], name: "정지은", gender: "female", img: "https://cdn.balkan.app/shared/empty-img-white.svg" },
    { id: 11, pid: 2, ppid: 3, tags: ["default"], name: "정지우", gender: "female", img: "https://cdn.balkan.app/shared/empty-img-white.svg" },
    { id: 12, pid: 2, ppid: 3, tags: ["default"], name: "정우성", gender: "male", img: "https://cdn.balkan.app/shared/empty-img-white.svg" },
    { id: 13, pid: 4, ppid: 5, tags: ["default"], name: "김솔", gender: "female", img: "https://cdn.balkan.app/shared/empty-img-white.svg" },
    { id: 14, pid: 4, ppid: 5, tags: ["default"], name: "김민태", gender: "male", img: "https://cdn.balkan.app/shared/empty-img-white.svg" },
    { id: 15, pid: 6, ppid:7, tags: ["default"], name: "양선", gender: "female", img: "https://cdn.balkan.app/shared/empty-img-white.svg" },
    { id: 16, pid: 6, ppid:7, tags: ["default"], name: "양은혜", gender: "female", img: "https://cdn.balkan.app/shared/empty-img-white.svg" },
    { id: 17, pid: 6, ppid:7, tags: ["default"], name: "양한나", gender: "female", img: "https://cdn.balkan.app/shared/empty-img-white.svg" },
    { id: 18, pid: 8, ppid:9, tags: ["default"], name: "박준수", gender: "male", img: "https://cdn.balkan.app/shared/empty-img-white.svg" },
    { id: 19, pid: 8, ppid:9, tags: ["default"], name: "박승수", gender: "male", img: "https://cdn.balkan.app/shared/empty-img-white.svg" },
    { id: 20, pid: 8, ppid:9, tags: ["default"], name: "박혜수", gender: "female", img: "https://cdn.balkan.app/shared/empty-img-white.svg" },
];



// $('#step1-submit').click(function(){
//     db_log_newMeeting.name = $('#meeting-name').val();
//     db_log_newMeeting.description = $('#meeting-description').val();
// })

// $('#step2-submit').click(function(){
//     db_log_newMeeting.participants = participans_transfer.getSelectedItems();
// })

// $('#step3-submit').click(function(){
//     db_log_newMeeting.place = arrPlace;
//     db_log_newMeeting.noMorePlace = $('#place-recommend').is(':checked');
//     db_log_newMeeting.activity = arrActivity;
//     db_log_newMeeting.noMoreActivity = $('#activity-recommend').is(':checked');

// })

// $('#step4-submit').click(function(){
//     db_log_newMeeting.meetingPeriod = db_period;
//     db_log_newMeeting.availableDates = [];
//     db_log_newMeeting.availableTimes = [];
// })

$('#final-submit').click(function(){
    db_log_newMeeting.name = $('#meeting-name').val();
    db_log_newMeeting.description = $('#meeting-description').val();

    db_log_newMeeting.participants = participans_transfer.getSelectedItems();

    db_log_newMeeting.place = arrPlace;
    db_log_newMeeting.noMorePlace = $('#place-recommend').is(':checked');
    db_log_newMeeting.activity = arrActivity;
    db_log_newMeeting.noMoreActivity = $('#activity-recommend').is(':checked');

    db_log_newMeeting.meetingPeriod = db_period;
    db_log_newMeeting.availableDates = []; // I don't know well
    db_log_newMeeting.availableTimes = [];

    db_log_newMeeting.surveyPeriod = Number($('#surveyPeriod').val());
    db_log_newMeeting.isPrivate = $('#btnradio2').is(':checked');
    
    db_log_newMeeting.chat = {};

    db_log_newMeeting.isEnd = false;
    console.log(db_log_newMeeting);


    db.collection('families').doc().set({
        code: "00AB8",
        meetings: [db_log_newMeeting],
        members: familyChart,
    })
})

// for (let i=97; i<116; i ++){
//     db.collection('users').doc().set({
//         'id':   String.fromCharCode(i),
//         'pw': String(i-97),
//         'family-code': "00AB8",
//         'family-id': i-97
//     })
// }





mobiscroll.setOptions({
    locale: mobiscroll.localeEn,  // Specify language like: locale: mobiscroll.localePl or omit setting to use default
    theme: 'windows',            // More info about themeVariant: https://docs.mobiscroll.com/5-4-0/javascript/datetime#opt-themeVariant
});

console.log(mobiscroll);

$('#start-time').mobiscroll().datepicker({
    controls: ['time'],
    select: 'range',
    showRangeLabels: true,
    stepMinute: 60,
    timeFormat: "hh:00 A"
});