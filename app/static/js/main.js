$(document).ready(function () {
    $('#loading-bar').fadeOut()
});


$('#search_form').submit(function (e) {
    e.preventDefault();
    let search_val = $('#search-dropdown').val();
    let type = $('#current_type').attr('data');
    console.log(search_val, type)
    $('#loading-bar').show();

    $.ajax({
        type: "POST",
        url: "/search",
        data: JSON.stringify({ search: search_val, type: type }),
        contentType: 'application/json',
        success: function (response) {
            $('#loading-bar').fadeOut()
            if (response === undefined || response.length == 0) {
                console.error("Found Nothing")
                $('#error').show();
                $('#myerror').html("Nothing Found");
            } else {
                console.log(response)
                $('#success').show();
                $('#mysuccess').html(`Songs Found`)
            }
        },
    });
});

