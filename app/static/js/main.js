
let tracks_sum;
const item_limiter = 30;

let search_yt_items = [];

let track_lengths;
let tracks_name = [];
let all_artists = [];
let types = []; //track length types
let urls = [];

let crop_track_lengths;
let crop_track_names = [];
let crop_all_artists = [];
let crop_types = [];
let crop_urls = [];
// checks stuff and adds yt-card (not the card itself)
function addYTCard(type, search_for, url, from_add_all = false) {
    if (search_yt_items.includes(search_for)) {
        $('#error').show();
        $('#myerror').html("Already Added");
    }
    else {
        search_yt_items.push(search_for)
        if (type === 'Track') {
            let songs = [search_for]
            // search for yt url
            if (from_add_all) { $('#loader2').show() }
            $.ajax({
                type: "POST",
                url: "/search_yt",
                data: JSON.stringify({ search: songs }),
                contentType: 'application/json',
                success: function (response) {
                    $('#loader2').fadeOut()
                    $('#loader').fadeOut()
                    if (response === undefined || response.length == 0) {
                        console.error("Found Nothing")
                        $('#error').show();
                        $('#myerror').html("Nothing Found");
                    }
                    else {
                        let track = response[0]
                        // console.log()

                        yt_card(track.link, track.title, track.by, track.thumbnail, track.type, search_for)
                    }
                }

            })


        }
        else {
            // playlist etc
            console.log(url)
            if (url != undefined) {
                console.log({ search: url, type: 'link', 'no': 1 })
                if (from_add_all) { $('#loader2').show() }
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
                            // console.log("searching playlist ")
                            if (from_add_all) { $('#loader2').show() }
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
                                        $('#loader2').fadeOut()

                                        // console.log(response)
                                        response.forEach(element => {


                                            yt_card(element.link, element.title, element.by, element.thumbnail, element.type, search_for)
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

    // console.log(search_val, tracks_name)
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
                        urls.push(element.url)
                        types.push(element.type)

                        spotify_card(element.name, element.url, element.by, element.type, element.img, element.length)

                    }
                });

                $('#boxs').show()
            }
        },
    });
});


//remove btn on spoti card
$('body').on('click', '.remove', function () {

    let spotiCard = $(this).closest('.spoti-card');
    spotiCard.fadeOut();
})

//add btn on spoti card
$('body').on('click', '.add', function () {
    // console.log()

    let search_for = $(this).attr('data');
    let type = $(this).attr('data-type');
    let url = $(this).attr('data-url');
    let item_length = $(this).attr('data-length');
    item_length = parseInt(item_length)


    if ($('.yt-card').length + item_length > item_limiter) {
        $('#error').show();
        $('#myerror').html(`You can only add upto ${item_limiter} tracks at a time`);
    }
    else {
        if (search_yt_items.includes(search_for)) {
            $('#error').show();
            $('#myerror').html("Already Added");
        } else {
            $('#loader').show()
            $('#loader-txt').text("Adding Your Tracks, this might take upto a minute")

            addYTCard(type, search_for, url)
        }
    }
    console.log(search_for, item_length)
})





// add All button inside the modal 
$('#add-all-main').click(function () {

    let tracks_sum_int = parseInt($('#tracks-sum').text())

    // console.log(crop_all_artists, crop_track_lengths, crop_track_names, crop_types)


    if ($('.yt-card').length + tracks_sum_int > item_limiter) {
        $('#error').show();
        $('#myerror').html(`You can only add upto ${item_limiter} tracks at a time`);
    }
    else {
        console.log("ofc running this")
        $('#close-modal').trigger("click");

        $('#success').show();
        $('#mysuccess').html('Adding everything , this will take a while come back in some minutes')




        $('#loader-txt2').text("Adding All Tracks This will take a while")

        $('#loader2').show()

        console.log(crop_track_names)
        for (i = 0; i <= crop_track_names.length - 1; i++) {


            let type2 = crop_types[i];
            let search_for2 = crop_track_names[i] + ' ' + crop_all_artists[i];

            let url2 = crop_urls[i];
            $('#loader2').show()
            console.log(url2)
            addYTCard(type2, search_for2, url2, true)


        }




    }

    // console.log(track_lengths)
    // console.log(tracks_sum_int, tracks_name, all_artists)
    // crop_track_lengths = track_lengths
})




// when the index thingy changes from add all modal
$('#starting-index, #ending-index').on('change', function () {
    var value = $(this).val();
    console.log('Input changed to: ' + value);

    let starting_index = $('#starting-index').val()
    let ending_index = $('#ending-index').val()
    console.log(starting_index, ending_index)

    crop_track_lengths = track_lengths.slice(starting_index - 1, ending_index)
    crop_all_artists = all_artists.slice(starting_index - 1, ending_index)

    crop_track_names = tracks_name.slice(starting_index - 1, ending_index)
    crop_types = types.slice(starting_index - 1, ending_index)
    crop_urls = urls.slice(starting_index - 1, ending_index)

    tracks_sum = crop_track_lengths.reduce(function (a, b) {
        return a + b;
    }, 0);

    console.log(crop_track_lengths)
    $('#tracks-sum').text(tracks_sum)
});







$('#removeAll').click(function () {
    $('.spoti-card').fadeOut()
    $('.spoti-card').remove()

})

// add all button not the one inside modal
$('#add-all').click(function () {
    let names = []
    let lengths = []
    let artists1 = []
    let types1 = []
    let urls1 = []
    let a = 0
    $('#modal-html').html('')
    $('.spoti-card').each(function () {
        a += 1
        let dataLength = $(this).data('length');
        let name = $(this).data('name');
        let type = $(this).data('type');
        let artist = $(this).data('artist');
        let url = $(this).data('url')


        AddModal(a, name, dataLength)

        names.push(name)
        lengths.push(dataLength)
        types1.push(type)
        artists1.push(artist)
        urls1.push(url)
    });
    $('#ending-index').val(lengths.length)


    //setting cropped list values gonna use them to add all
    track_lengths = lengths
    crop_track_lengths = track_lengths
    crop_track_names = names
    crop_types = types1
    crop_all_artists = artists1
    crop_urls = urls1


    tracks_sum = lengths.reduce(function (a, b) {
        return a + b;
    }, 0);

    $('#tracks-sum').text(tracks_sum)
})





function removeItemOnce(arr, value) {
    var index = arr.indexOf(value);
    if (index > -1) {
        arr.splice(index, 1);
    }
    return arr;
}

// yt-remove btn
$('body').on('click', '.yt-remove', function () {
    let yt_card1 = $(this).closest('.yt-card')
    yt_card1.fadeOut()
    yt_card1.remove()


    yt_search_items = removeItemOnce(search_yt_items, yt_card1.attr("data-search"))
})


// remove all yt cards
$('#remove-all-yt').click(function () {
    $('.yt-card').fadeOut()
    $('.yt-card').remove()
    search_yt_items = []
})