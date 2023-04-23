let a;

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

