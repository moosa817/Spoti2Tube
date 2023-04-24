let yt_urls = [];
let yt_titles = [];
$('#progress-bar').hide()


function downloadBase64AsMp3(base64, filename) {
    var byteCharacters = atob(base64);
    var byteNumbers = new Array(byteCharacters.length);
    for (var i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    var byteArray = new Uint8Array(byteNumbers);
    var blob = new Blob([byteArray], { type: 'audio/mp3' });
    var url = URL.createObjectURL(blob);

    var link = document.createElement('a');
    link.href = url;
    link.download = filename + '.mp3';
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
}




function YouTubeGetID(url) {
    var ID = '';
    url = url.replace(/(>|<)/gi, '').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
    if (url[2] !== undefined) {
        ID = url[2].split(/[^0-9a-z_\-]/i);
        ID = ID[0];
    }
    else {
        ID = url;
    }
    return ID;
}


// single file download
$('body').on('click', '.download', function () {


    let download_link = $(this).data('url');
    let download_title = $(this).data('title')

    console.log(JSON.stringify({ url: download_link }))
    $('#loader').show()
    $('#loader-txt').text("Downloading .. " + download_title)
    $.ajax({
        type: "POST",
        url: `/download`,
        data: JSON.stringify({ name: download_title, url: download_link }),
        contentType: 'application/json',
        xhrFields: {
            responseType: 'arraybuffer'
        },
        success: function (response) {
            var blob = new Blob([response], { type: 'application/octet-stream' });
            var link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = download_title + '.mp3';
            link.click();
            $('#loader').fadeOut();
            window.URL.revokeObjectURL(link.href); // revoke blob object

        }
    });
})


//when download button clicked 
$('#download-all').click(function () {
    yt_urls = []
    yt_titles = []
    let yt_title;
    $('.yt-link').each(function () {
        yt_urls.push($(this).attr('href'))
        let yt_title = $(this).text()
        yt_title = yt_title.replaceAll('\n', '')
        yt_title = yt_title.replaceAll('  ', '')

        yt_titles.push(yt_title)

    });

})

//inside the modal zip btn
$('#download-zip').click(function () {
    if (yt_urls.length < 1) {
        $('#error').show()
        $('#myerror').text("Nothing To Download ! ")
    }
    else {
        console.log("Download all as zip")
    }
})

//inside the modal mp3 butn
$('#download-all-mp3').click(function () {
    $('#success').show()
    $('#mysuccess').text("Starting Download")


    if (yt_urls.length < 1) {
        $('#error').show()
        $('#myerror').text("Nothing To Download ! ")
    } else {
        $('#progress-bar').show()
        $('#progress').css('width', '0' + '%');
        $('#progress-txt').text('0')
        $('#downloading-current').text(yt_titles[0])


        // split youtube url to get id javascript?
        let yt_ids = []
        yt_urls.forEach(url => {
            yt_ids.push(YouTubeGetID(url))
        });

        const url = "/download_all?urls_id=" + yt_ids.map(u => encodeURIComponent(u)).join(",");

        const source = new EventSource(url);

        source.onmessage = function (event) {
            if (event.data === 'done') {
                source.close();
                $('#progress-bar').hide()
                $('#success').show()
                $('#mysuccess').text("Downloaded All mp3 files")

            }
            else {
                let data = JSON.parse(event.data)
                console.log(data)
                let title = yt_titles[data.index_no]

                $('#progress-bar').show()
                $('#progress').css('width', data.percent + '%');
                $('#progress-txt').text(data.percent)
                $('#downloading-current').text(yt_titles[data.index_no + 1])
                downloadBase64AsMp3(data.audio_data, title);


            }
        };

        source.addEventListener('error', function (event) {
            console.error('EventSource error:', event);
        });



        console.log("download all mp3 file")
    }
})

