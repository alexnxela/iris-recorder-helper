let mediaRecorder;
let mediaRecorderStream = null;

$mic_on = $('.mic-on');
$mic_off = $('.mic-off');
$mic_enable = $('.mic-enable');

window.session_key = null;

function initRecord(cb) {
    navigator.mediaDevices.getUserMedia({audio: true})
        .then(function (stream) {
            mediaRecorderStream = stream;
            mediaRecorder = new MediaRecorder(stream);

            mediaRecorder.ondataavailable = function (e) {
                if (e.data.size > 0) {
                    saveAudio(e.data);
                }
            };

            mediaRecorder.onstart = function () {
                $mic_on.hide();
                $mic_off.removeClass('d-none').show();
            };

            mediaRecorder.onstop = function () {
                $mic_off.hide();
                $mic_on.show();

                stream.getTracks()
                    .forEach( track => track.stop() );
                mediaRecorder = null;
            };

            if (cb) {
                cb();
            }
        })
        .catch(function (error) {
            alert.error('Error :' + error.toString());
        });
}

$mic_enable.click(function (e) {
    $mic_enable.hide();
    $mic_on.removeClass('d-none');
    initRecord();
});

$mic_on.click(function (e) {
    e.preventDefault();
    if (mediaRecorder) {
        mediaRecorder.start(20000);
    } else {
        initRecord(() => {
            mediaRecorder.start(20000);
        });
    }
});

$mic_off.click(function (e) {
    e.preventDefault();
    mediaRecorder.stop();
});

if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    $('.alert-mic').addClass('d-none');
} else {
    $('.alert-mic').removeClass('d-none');
}

function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

const urlObject = new URL(window.location.href);
url_key = urlObject.searchParams.get('key');
if (url_key) {
    window.session_key = url_key;
}

if (!window.session_key) {
    if (!localStorage.getItem('key')) {
        localStorage.setItem('key', generateUUID());
    }
    window.session_key = localStorage.getItem('key');
}

$('.session-key').text(window.session_key).attr('href', '/?key='+window.session_key);

$records = $('.records-block');
$records_loader = $('.records-loader')

function saveAudio(data) {
    $records_loader.removeClass('d-none');
    console.log('save audio');
    const audioBlob = new Blob([data], {type: 'audio/wav'});

    const formData = new FormData();
    formData.append('content', audioBlob);
    formData.append('date_created', new Date().toISOString());
    formData.append('key', window.session_key);

    $.ajax({
        type: 'POST',
        url: '/save',
        data: formData,
        processData: false,
        contentType: false,
        success: function (response) {
            try {
                response.forEach((item) => {
                    insertMsg(item);
                });
            } catch (e) {

            }
        },
        error: function (error) {
            console.error('Error: ', error);
        },
        complete: function () {
        }
    }).always(function () {
        $records_loader.addClass('d-none');
    });
}

function insertMsg(item) {
    $records.find('.empty').hide();
    $record = $('<a class="list-group-item list-group-item-action">');
    $record_dt = $('<p class="mb-1">');
    $record_dt.html(item.date_created);
    $record_text = $('<small>');
    if (!item.text || item.text.length <= 0) {
        item.text = 'empty..';
    }
    $record_text.html(item.text);
    $record.append($record_dt)
    $record.append($record_text);
    $records.prepend($record);
}

$.ajax({
    url: '/get?key=' + window.session_key,
    method: 'GET',
    dataType: 'json',
    success: function (data) {
        console.log(data);
        data.forEach((item) => {
            insertMsg(item);
        })
    },
    error: function (err) {
        console.log(err)
    }
});

$btn_make_sense = $('.btn-make-sense');
$btn_make_sense_loader = $('.btn-make-sense-loader');

$btn_make_sense.click(function (e) {
    e.preventDefault();

    var o = $(this);
    o.attr('disabled', 'disabled');
    $btn_make_sense_loader.removeClass('d-none');


    const formData = new FormData();
    formData.append('prompt', $('#prompt').val());
    formData.append('key', window.session_key);

    $.ajax({
        type: 'POST',
        url: '/summary',
        data: formData,
        processData: false,
        contentType: false,
        success: function (response) {
            var results = $('.summary-results');
            results.empty();
            if (response && response.msg) {
                results.text(response.msg);
            }
        },
        error: function (error) {
            console.error('Error: ', error);
        },
        complete: function () {
            $btn_make_sense.removeAttr('disabled')
            $btn_make_sense_loader.addClass('d-none');
        }
    });

})