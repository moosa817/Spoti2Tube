
let crop_track_lengths;
let track_lengths;
let tracks_sum;


let search_yt_items = [];

let tracks_name = [];
let all_artists = [];



// checks stuff and adds yt-card (not the card itself)
function addYTCard(type, search_for, url) {

    console.log("running addYTCard func")
    if (search_yt_items.includes(search_for)) {
        $('#error').show();
        $('#myerror').html("Already Added");
    }
    else {

        $('#loader').show()
        $('#loader-txt').text("Adding Your Tracks, this might take upto a minute")
        search_yt_items.push(search_for)
        if (type === 'Track') {
            let songs = [search_for]
            // search for yt url
            $.ajax({
                type: "POST",
                url: "/search_yt",
                data: JSON.stringify({ search: songs }),
                contentType: 'application/json',
                success: function (response) {
                    $('#loader').fadeOut()
                    if (response === undefined || response.length == 0) {
                        console.error("Found Nothing")
                        $('#error').show();
                        $('#myerror').html("Nothing Found");
                    }
                    else {
                        let track = response[0]
                        // console.log()

                        yt_card(track.link, track.title, track.by, track.thumbnail, track.type)
                    }
                }

            })


        }
        else {
            // playlist etc
            console.log(url)
            $.ajax({
                type: "POST",
                url: "/search",
                data: JSON.stringify({ search: url, type: 'link', 'no': 1 }),
                contentType: 'application/json',
                success: function (response) {
                    if (response === undefined || response.length == 0) {
                        console.error("Found Nothing")
                        $('#error').show();
                        $('#myerror').html("Nothing Found");
                    } else {
                        console.log(response)
                        let track_names = []
                        response.forEach(item => {
                            track_names.push(item.name + ' ' + item.by)
                        });
                        console.log("searching playlist ")
                        $.ajax({
                            type: "POST",
                            url: "/search_yt",
                            data: JSON.stringify({ search: track_names }),
                            contentType: 'application/json',
                            success: function (response) {




                                if (response === undefined || response.length == 0) {
                                    console.error("Found Nothing")
                                    $('#error').show();
                                    $('#myerror').html("Nothing Found");
                                }
                                else {
                                    $('#loader').fadeOut()
                                    console.log(response)
                                    response.forEach(element => {


                                        yt_card(element.link, element.title, element.by, element.thumbnail, element.type)
                                    });
                                }
                            }

                        })

                    }
                }
            })
        }
    }

}




// when search button clicked
$('#search_form').submit(function (e) {
    e.preventDefault();
    let search_val = $('#search-dropdown').val(); //main search button input
    let type = $('#current_type').attr('data');
    let no = $('#no').val()
    if (no === '#') {
        no = 1
    } else {
        no = parseInt(no);
    }

    console.log(search_val, tracks_name)
    $('#loading-bar').show();

    $.ajax({
        type: "POST",
        url: "/search",
        data: JSON.stringify({ search: search_val, type: type, no: no }),
        contentType: 'application/json',
        success: function (response) {
            $('#loading-bar').fadeOut()
            if (response === undefined || response.length == 0) {
                console.error("Found Nothing")
                $('#error').show();
                $('#myerror').html("Nothing Found");
            } else {

                response.reverse().forEach(element => {
                    if (tracks_name.includes(element.name)) {
                        $('#error').show();
                        $('#myerror').html("Already Added");
                    }
                    else {
                        $('#success').show();
                        $('#mysuccess').html(`Songs Found`)


                        tracks_name.push(element.name)
                        all_artists.push(element.by)

                        spotify_card(element.name, element.url, element.by, element.type, element.img, element.length)

                    }
                });

                $('#boxs').show()
                after_search()



            }
        },
    });
});

// function that runs if tracks were fetched
function after_search() {

    $('#removeAll').click(function () {
        $('.spoti-card').fadeOut()
    })


    $('.spoti-card .remove').click(function () {
        let spotiCard = $(this).closest('.spoti-card');
        spotiCard.fadeOut();
    })


    $('.spoti-card .add').click(function () {
        console.log($('.yt-card').length)

        let search_for = $(this).attr('data');
        let type = $(this).attr('data-type');
        let url = $(this).attr('data-url');
        let item_length = $(this).attr('data-length');

        addYTCard(type, search_for, url)

        console.log(search_for, item_length)

    })


    $('#add-all').click(function () {
        let names = []
        let lengths = []
        let a = 0
        $('#modal-html').html('')
        $('.spoti-card').each(function () {
            a += 1
            let dataLength = $(this).data('length');
            let name = $(this).data('name');

            AddModal(a, name, dataLength)

            names.push(name)
            lengths.push(dataLength)
        });
        $('#ending-index').val(lengths.length)
        track_lengths = lengths


        tracks_sum = lengths.reduce(function (a, b) {
            return a + b;
        }, 0);

        $('#tracks-sum').text(tracks_sum)
    })


    // when the index thingy changes from add all modal
    $('#starting-index, #ending-index').on('change', function () {
        var value = $(this).val();
        console.log('Input changed to: ' + value);

        let starting_index = $('#starting-index').val()
        let ending_index = $('#ending-index').val()
        console.log(starting_index, ending_index)

        crop_track_lengths = track_lengths.slice(starting_index - 1, ending_index)

        tracks_sum = crop_track_lengths.reduce(function (a, b) {
            return a + b;
        }, 0);

        console.log(crop_track_lengths)
        $('#tracks-sum').text(tracks_sum)
    });

    // add All button inside the modal 
    $('#add-all-main').click(function () {
        let tracks_sum_int = parseInt($('#tracks-sum').text())
        console.log(tracks_sum_int, tracks_name, all_artists)
    })



}