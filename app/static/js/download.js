let yt_urls = []; //list of songs to download
let yt_titles = []; //title ofc
let yt_ids = [];
$('#progress-bar').hide()

let crop_yt_urls = [];
let crop_yt_titles = [];
let crop_yt_ids = [];

let total_index; //how many songs to download
let current_index; //which song being downloaded
let current_percent;


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

    $('#success').show()
    $('#mysuccess').text("Starting Download..")

    let download_link = $(this).data('url');
    let download_title = $(this).data('title')

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
    $('.yt-link').each(function () {
        yt_urls.push($(this).attr('href'))
        let yt_title = $(this).text()
        yt_title = yt_title.replaceAll('\n', '')
        yt_title = yt_title.replaceAll('  ', '')

        yt_titles.push(yt_title)

    });

    yt_ids = []
    yt_urls.forEach(url => {
        yt_ids.push(YouTubeGetID(url))
    });


})

//inside the modal zip btn
$('#download-zip').click(function () {
    $('#success').show()
    $('#mysuccess').text("Starting Download")


    if (yt_urls.length < 1) {
        $('#success').hide()
        $('#error').show()
        $('#myerror').text("Nothing To Download ! ")
    } else {
        $('#progress-bar').show()
        $('#progress').css('width', '0' + '%');
        $('#progress-txt').text('0')
        $('#downloading-current').text(yt_titles[0])



        const url = "/download_all?urls_id=" + yt_ids.map(u => encodeURIComponent(u)).join(",");

        let source = new EventSource(url);

        //zip object
        const zip = new JSZip();


        // source.onmessage = function (event) {
        const handleMessage1 = (event) => {

            if (event.data === 'done') {
                source.close();

                zip.generateAsync({ type: "blob" })
                    .then(function (content) {
                        // Download the zip file
                        saveAs(content, "mp3_files.zip");
                        $('#progress-bar').hide()
                        $('#success').show()
                        $('#mysuccess').text("Downloaded Zip File")
                    });

            }
            else if (JSON.parse(event.data).timeout === true) {
                let current_id = JSON.parse(event.data).url_id
                current_index = yt_ids.indexOf(current_id)

                source.close()
                console.error("SSE connection timed out, reconnecting");

                crop_yt_urls = yt_urls.slice(current_index)
                crop_yt_titles = yt_titles.slice(current_index)
                crop_yt_ids = []
                crop_yt_urls.forEach(url => {
                    crop_yt_ids.push(YouTubeGetID(url))
                });

                let url = "/download_all?urls_id=" + crop_yt_ids.map(u => encodeURIComponent(u)).join(",");

                setTimeout(() => {
                    // Create a new connection with the same event listener
                    const newSource = new EventSource(url);
                    newSource.onmessage = handleMessage1;
                    newSource.onerror = source.onerror;
                    source = newSource;
                }, 1000);

            }
            else {

                let current_id3 = JSON.parse(event.data).url_id
                current_index = yt_ids.indexOf(current_id3)

                let data = JSON.parse(event.data)
                let title = yt_titles[current_index]

                current_percent = Math.round(((current_index + 1) / yt_ids.length) * 100)


                $('#progress-bar').show()
                $('#progress').css('width', current_percent + '%');
                $('#progress-txt').text(current_percent)
                $('#downloading-current').text(yt_titles[current_index + 1])

                // Add the downloaded MP3 file to the zip file
                zip.file(title + ".mp3", atob(data.audio_data), { binary: true });


            }

        };
        source.onmessage = handleMessage1


        source.addEventListener('error', function (event) {
            source.close();

            zip.generateAsync({ type: "blob" })
                .then(function (content) {
                    // Download the zip file
                    saveAs(content, "mp3_files.zip");
                    $('#progress-bar').hide()
                    $('#success').hide()

                    $('#error').show()
                    $('#myerror').text("Something Went Wrong Some files were'nt downloaded")

                });

        });



    }
})

//inside the modal mp3 butn
$('#download-all-mp3').click(function () {
    $('#success').show()
    $('#mysuccess').text("Starting Download")


    if (yt_urls.length < 1) {
        $('#success').hide()

        $('#error').show()
        $('#myerror').text("Nothing To Download ! ")
    } else {
        $('#progress-bar').show()
        $('#progress').css('width', '0' + '%');
        $('#progress-txt').text('0')
        $('#downloading-current').text(yt_titles[0])

        let url = "/download_all?urls_id=" + yt_ids.map(u => encodeURIComponent(u)).join(",");

        let source = new EventSource(url);


        const handleMessage = (event) => {
            if (event.data === 'done') {
                source.close();
                $('#progress-bar').hide()
                $('#success').show()
                $('#mysuccess').text("Downloaded All mp3 files")

            }
            else if (JSON.parse(event.data).timeout === true) {

                let current_id = JSON.parse(event.data).url_id
                current_index = yt_ids.indexOf(current_id)

                source.close()
                console.error("SSE connection timed out,reconnecting");

                crop_yt_urls = yt_urls.slice(current_index)
                crop_yt_titles = yt_titles.slice(current_index)
                crop_yt_ids = []
                crop_yt_urls.forEach(url => {
                    crop_yt_ids.push(YouTubeGetID(url))
                });

                let url = "/download_all?urls_id=" + crop_yt_ids.map(u => encodeURIComponent(u)).join(",");

                setTimeout(() => {
                    // Create a new connection with the same event listener
                    const newSource = new EventSource(url);
                    newSource.onmessage = handleMessage;
                    newSource.onerror = source.onerror;
                    source = newSource;
                }, 1000);



            }
            else {
                let current_id2 = JSON.parse(event.data).url_id
                current_index = yt_ids.indexOf(current_id2)

                let data = JSON.parse(event.data)
                let title = yt_titles[current_index]

                current_percent = Math.round(((current_index + 1) / yt_ids.length) * 100)

                $('#progress-bar').show()
                $('#progress').css('width', current_percent + '%');
                $('#progress-txt').text(current_percent)
                $('#downloading-current').text(yt_titles[current_index + 1])
                downloadBase64AsMp3(data.audio_data, title);


            }
        };
        source.onmessage = handleMessage


        source.onmessage = handleMessage
        source.addEventListener('error', function (event) {
            source.close();
            console.error("event source ran into error", event)
        });



    }
})

