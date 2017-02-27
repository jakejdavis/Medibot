$(document).foundation();

var domain = "http://192.168.43.105:5000/";
var cameraStream = $(".camera-stream");
var cameraStreamHeightAuto = $(cameraStream).height();
var cameraStreamOffset = $(cameraStream).offset();
var cameraOriginalWidth = $(cameraStream).width();
var servoPos = 90

/* RENDER INFO */
$.get('./templates/information.mst', function(template) {
    $.getJSON(domain + "get_info", function (data) {
        console.log(data);
        var rendered = Mustache.render(template, {emergencyContacts: data['contacts'],
                                                  name: data['information']['name'],
                                                  dob: data['information']['dob'],
                                                  illness: data['information']['illness'],
                                                  medication: data['information']['medication']});
        $('#information').html(rendered);
    });


});


/* CONTROLLING */
$.getJSON(domain + "servo?pos=90", function () {
    console.log("servo?pos=90")
})

$(document).keydown(function(event) {
        // CONTACT SERVER
        console.log("MOVE " + event.key);
        if (event.key == "s") {
            action = "move?drcn=backward"
        }
        if (event.key == "w") {
            action = "move?drcn=forward"
        }
        if (event.key == "d") {
            action = "move?drcn=right"
        }
        if (event.key == "a") {
            action = "move?drcn=left"
        }
        if (event.key == "ArrowLeft") {
            if (servoPos < 177) {
                servoPos += 3
            }
            action = "servo?pos=" + servoPos
        }
        if (event.key == "ArrowRight") {
            if (servoPos > 3) {
                servoPos -= 3
            }
            action = "servo?pos=" + servoPos
        }
        if (event.key == "ArrowUp") {
            servoPos = 90
            action = "servo?pos=90"
        }
        $.getJSON(domain + action, function () {
            console.log(action)
        })
});

$(document).keyup(function() {
    console.log("STOP");
    $.getJSON(domain + "stop", function () {
        console.log("STOPPED")
    });
});

/* STREAM */

function streamFullscreenToggle() {
    if(!$(cameraStream).is(':animated')) {
        if (!$(cameraStream).hasClass('fullscreen')) {
            $(cameraStream).addClass('fullscreen');
            $(cameraStream).animate({
                width: "100%",
                height: "100%",
                top: 0,
                left: 0
            }, 1000);
        } else {

            $(cameraStream).animate({
                width: cameraOriginalWidth,
                height: cameraStreamHeightAuto,
                top: cameraStreamOffset.top,
                left: cameraStreamOffset.left
            }, 1000, function () {
                $(cameraStream).removeClass('fullscreen');
                $(cameraStream).css('top', 'auto').css('left', 'auto');
            });
        }
    }
}

function reloadStream() {
    var d = new Date();
    $(cameraStream).attr("src", domain + "get_stream?" + d.getTime());
    return true;
}

window.setInterval(function(){
    //reloadStream();
}, 1000);
