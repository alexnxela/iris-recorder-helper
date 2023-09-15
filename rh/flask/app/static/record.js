let mediaRecorder = null;
let mediaRecorderStream = null;
let mediaChunks = [];
let mediaChunkFirst = null;
let mediaChunkNum = 0;

$mic_start = $('.mic-on');
$mic_stop = $('.mic-off');
$mic_enable = $('.mic-enable');
$mic_disable = $('.mic-disable');

window.session_key = null;

function initMic() {
    navigator.mediaDevices.getUserMedia({audio: true})
        .then(function (stream) {
            mediaRecorderStream = stream;
            mediaRecorder = new MediaRecorder(stream);

            mediaRecorder.ondataavailable = function (e) {
                if (e.data.size > 0) {
                    if (mediaChunkFirst === null) {
                        mediaChunkFirst = e.data
                        return;
                    }

                    mediaChunks.push(e.data);
                    mediaChunkNum++;
                    console.log('iteration: ', mediaChunkNum);
                    if (mediaChunkNum > 10) {
                        saveAudio();
                    }
                }
            };

            mediaRecorder.onstart = function () {
                $mic_start.addClass('d-none');
                $mic_stop.removeClass('d-none');
            };

            mediaRecorder.onstop = function () {
                $mic_stop.addClass('d-none');
                $mic_start.removeClass('d-none');

                if (mediaChunkNum > 0) {
                    saveAudio();
                }
            }
        })
        .catch(function (error) {
            alert.error('Error :' + error.toString());
        });
}

$mic_disable.click(function (e) {
    e.preventDefault();
    $mic_disable.addClass('d-none');
    $mic_enable.removeClass('d-none');
    $mic_start.addClass('d-none');
    $mic_stop.addClass('d-none');

    if (mediaRecorderStream) {
        mediaRecorderStream.getTracks().forEach( track => track.stop() );
    }
});

$mic_enable.click(function (e) {
    console.log('mic enable');
    e.preventDefault();
    $mic_enable.addClass('d-none');
    $mic_disable.removeClass('d-none');
    $mic_start.removeClass('d-none');
    initMic();
});

$mic_start.click(function (e) {
    console.log('mic start record');
    e.preventDefault();
    if (mediaRecorder) {
        mediaRecorder.start(1000);
        return;
    }
    alert('Mic error');
});

$mic_stop.click(function (e) {
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

function saveAudio() {
    let data = [mediaChunkFirst];
    data = data.concat(mediaChunks);
    mediaChunks = [];
    mediaChunkNum = 0;

    $records_loader.removeClass('d-none');
    console.log('save audio', data);

    const audioBlob = new Blob(data, {type: 'audio/wav'});
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