const familyCode = "00AB8", meetingNumber = 0, userID = 0;
var meetings, members, chats, docID, answerID;

const placeData = [], activityData = [];

let placeOptions = {
    container: {
    },
    tag: {
        minFontSize: 12,
        maxFontSize: 20,
        format: '{tag.name}'
    },
    data: placeData
}

let activityOptions = {
    container: {
    },
    tag: {
        minFontSize: 12,
        maxFontSize: 20,
        format: '{tag.name}'
    },
    data: activityData
}

function resize() {
    placeOptions.container.width = $('#place-card').width();
    console.log(placeOptions);
    activityOptions.container.width = $('#activity-card').width();
    $('#placeCloud').tagCloud(placeOptions);
    $('#activityCloud').tagCloud(activityOptions);
}

var map = new naver.maps.Map("map", {
    center: new naver.maps.LatLng(35.8, 127.51),
    zoom: 1
});

const markers = [], infoWindows = [];
const latlngs = [
    new naver.maps.LatLng(37.3595704, 127.105399),
    new naver.maps.LatLng(35.3595704, 128.105399),
    new naver.maps.LatLng(37.3596704, 127.106399),
    new naver.maps.LatLng(37.4595704, 127.905399),
];

const people = [
    '나', '누나', '엄마', '할머니'
];

for (var i=0; i<latlngs.length; i++) {
    var marker = new naver.maps.Marker({
        position: latlngs[i],
        map: map
    });
    var infoWindow = new naver.maps.InfoWindow({
        content: `<p style="padding-top:10px;padding-left:10px;padding-right:10px;">${people[i]}</p>`
    });
    markers.push(marker);
    infoWindows.push(infoWindow);
    naver.maps.Event.addListener(markers[i], 'mouseover', getClickHandler(i));
}

function getClickHandler(seq) {
    return function (e) {
        var marker = markers[seq], infoWindow = infoWindows[seq];
        if (infoWindow.getMap()) {
            infoWindow.close();
        } else {
            infoWindow.open(map, marker);
        }
    }
}

function tooltipSet() {
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

function bindEvents() {
    $('#chat-button').click(() => {
        var chat = {
            id: userID,
            text: $('#chat-input').val(),
            time: new Date(),
            like: []
        }
        chats.chat.push(chat);
        console.log(chats);
        $('#chat-input').val('')
        db.collection('families').doc(docID).collection('chats').doc(answerID).update({
            chat: chats.chat
        })
        .then((snapshot) => {
            drawChat(chats.chat.length-1);
        });
    });
    tooltipSet();
}

$(document).on('click', '.bi-heart-fill', function(e){
    e.preventDefault();
    if ($(e.target)[0].outerHTML.slice(1,5)==="path") {
        var idx = $(e.target).parent().data('idx');
        if ($(e.target).css('fill') != "rgb(255, 153, 153)") { // unclicked
            $(e.target).css({fill: 'rgb(255, 153, 153)'});
            chats.chat[idx].like.push(userID);
            $(e.target).parent().parent().attr('data-bs-original-title', chats.chat[idx].like.map((id) => members[id].name).join(', '));
        }
        else { // clicked
            $(e.target).css({fill: 'rgb(255, 192, 203)'});
            chats.chat[idx].like.splice(chats.chat[idx].like.indexOf(userID), 1);
            $(e.target).parent().parent().attr('data-bs-original-title', chats.chat[idx].like.map((id) => members[id].name).join(', '));
        }
    }
    db.collection('families').doc(docID).collection('chats').doc(answerID).update({
        chat: chats.chat
    })
})

$(document).on('click', '.fa-times-circle', function(e){
    chats.chat.splice($(e.target).data('idx'), 1);
    db.collection('families').doc(docID).collection('chats').doc(answerID).update({
        chat: chats.chat
    })
    $(e.target).parent().parent().remove();
});

function timeCalculate(time) {
    if (!(time instanceof Date)) time = time.toDate();
    return `${time.getMonth()+1}월 ${time.getDate()}일 ${time.getHours()}시 ${time.getMinutes()}분` 
}

function drawChat(idx) {
    var chat = chats.chat[idx];
    if (userID != chat.id) { // incoming msg
        $('#chat').append(
        `<div class="incoming_msg">
            <div class="incoming_msg_img">
                <a href="#" class="d-inline-block">
                    <img src="${members[chat.id].img}" style="width:30px;height:30px;border-radius:70%;"></img>
                </a>
                <p>${members[chat.id].name}</p>
            </div>
            <div class="received_msg">
                <div class="received_withd_msg">
                    <p style="float:left">${chat.text}</p>
                    <a style="float:right;" class="d-inline-block" data-bs-toggle="tooltip" data-bs-placement="right" title="" data-bs-original-title="${chat.like.map((id) => members[id].name).join(', ')}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="${chat.like.includes(userID)?'#ff9999':'#ffc0cb'}" class="bi bi-heart-fill" viewBox="0 0 16 16" data-idx="${idx}">
                            <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
                        </svg>
                    </a>
                    <span class="time_date">${timeCalculate(chat.time)}</span></div>
                </div>
            </div>
        </div>`)
    }
    else { // outgoing msg
        $('#chat').append(
        `<div class="outgoing_msg">
            <div class="sent_msg">
                <p style="float:left">${chat.text}</p>
                <i style="float:right;margin-top:5px;margin-left:3px;color:tomato" class="fas fa-times-circle" data-idx="${idx}"></i>
                <a style="float:right" class="d-inline-block" data-bs-toggle="tooltip" data-bs-placement="left" title="" data-bs-original-title="${chat.like.map((id) => members[id].name).join(', ')}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#ffc0cb" class="bi bi-heart-fill" viewBox="0 0 16 16" data-idx="${idx}">
                        <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
                    </svg>
                </a>
                <span class="time_date">${timeCalculate(chat.time)}</span> </div>
            </div>
        </div>`)
    }
    tooltipSet();
}

function processData() {
    db.collection('families').doc(docID).collection('answers').where('meetingNumber', '==', meetingNumber)
    .get()
    .then((snapshot) => {
        var placeDict = {}, activityDict = {};
        snapshot.forEach((doc) => {
            console.log(doc.data());
            for (var place of doc.data().place) {
                if (place in placeDict) placeDict[place].push(doc.data().userID);
                else placeDict[place] = [doc.data().userID];
            }
            for (var activity of doc.data().activity) {
                if (activity in activityDict) activityDict[plactivityace].push(doc.data().userID);
                else activityDict[activity] = [doc.data().userID];
            }
        });
        for (var place in placeDict) {
            var tooltipTitle = place
            placeData.push({
                name: `<a style="" data-bs-toggle="tooltip" data-bs-placement="bottom" title="" data-bs-original-title="${placeDict[place].map((id) => members[id].name).join(', ')}">${place}</a>`,
                weight: placeDict[place].length
            });
        }
        
        for (var activity in activityDict) {
            var tooltipTitle = place
            activityData.push({
                name: `<a data-bs-toggle="tooltip" data-bs-placement="bottom" title="" data-bs-original-title="${activityDict[activity].map((id) => members[id].name).join(', ')}">${activity}</a>`,
                weight: activityDict[activity].length
            });
        }
        resize();
        tooltipSet();
    })
}

$(document).ready(function() {
    db.collection('families').where('code', '==', familyCode)
    .get()
    .then((snapshot) => {
        snapshot.forEach((doc) => {
            docID = doc.id;
            meetings = doc.data().meetings;
            //console.log(meetings);
            members = doc.data().members;

            processData();

            // chat db
            db.collection('families').doc(docID).collection('chats').where('meetingNumber', '==', meetingNumber)
            .get().then((snapshot) =>{
                snapshot.forEach((doc) => {
                    answerID = doc.id;
                    chats = doc.data();
                    console.log(chats);
                })
                for (var i=0; i<chats.chat.length; i++) drawChat(i);
            })

            if (meetings[meetingNumber].isPrivate) $('#is-private').append('<span class="text-muted" style="font-size: smaller;"><i class="fas fa-lock me-1"></i> 비공개</span>')
            else $('#is-private').append('<span class="text-muted" style="font-size: smaller;"><i class="fas fa-globe-asia me-1"></i> 공개</span>')

            $('#meeting-name').text(meetings[meetingNumber].name);

            $('#meeting-description').text(meetings[meetingNumber].description);

            for (var participant of meetings[meetingNumber].participants) {
                $('#meeting-participants').append(` <a href="#" class="d-inline-block" data-bs-toggle="tooltip" data-bs-placement="bottom" title="" data-bs-original-title=${participant.name}>
                                                        <img src="${members[participant.id].img}" style="width:30px;height:30px;border-radius:70%;opacity:${(Math.random(1)<0.5)?0.5:1}"></img>
                                                    </a>`);
            }

            var meetingTags;
            if (meetings[meetingNumber].meetingPeriod.day == 0) meetingTags = `<span class="badge rounded-pill bg-light text-dark">${meetings[meetingNumber].meetingPeriod.hour}시간</span> <span style="font-size: smaller;">동안</span>`;
            else if (meetings[meetingNumber].meetingPeriod.day == 1) meetingTags = `<span class="badge rounded-pill bg-light text-dark">하루</span> <span style="font-size: smaller;">종일</span>`;
            else meetingTags = `<span class="badge rounded-pill bg-light text-dark">${meetings[meetingNumber].meetingPeriod.day-1}박 ${meetings[meetingNumber].meetingPeriod.day}일</span> <span style="font-size: smaller;">동안</span> `
            if (meetings[meetingNumber].noMorePlace) {
                var tmp = meetings[meetingNumber].place.map((x) => `<span class="badge rounded-pill bg-light text-dark">${x}</span>`).join('');
                meetingTags += tmp + '<span style="font-size: smaller;">에서</span>';
            }
            if (meetings[meetingNumber].noMoreActivity) {
                var tmp = meetings[meetingNumber].activity.map((x) => `<span class="badge rounded-pill bg-light text-dark">${x}</span>`).join('');
                meetingTags += tmp;
            }
            $('#meeting-tags').append(meetingTags);
        });
        bindEvents();
    });
});