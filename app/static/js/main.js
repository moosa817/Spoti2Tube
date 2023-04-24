/*
storing values in these values then set them equal to croped ones 
then croped ones change when index's are select in add all button
item limiters set how many youtube videos can be added at a time
search_yt_items has a list of all the items that been searched

Main.js contains all the main code some functions used here described in func.js 
style.js contains all the things related to style
*/

let tracks_sum;
const item_limiter = 200;

let search_yt_items = [];

let track_lengths = [];
let tracks_name = [];
let all_artists = [];
let types = [];
let urls = [];

let crop_track_lengths;
let crop_track_names = [];
let crop_all_artists = [];
let crop_types = [];
let crop_urls = [];


let liked = false;






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
                        track_lengths.push(element.length)

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
    spotiCard.remove();
    let removeIndex = tracks_name.indexOf($(this).closest('.spoti-card').data('name'))

    tracks_name.splice(removeIndex, 1)
    all_artists.splice(removeIndex, 1)
    urls.splice(removeIndex, 1)
    types.splice(removeIndex, 1)
    track_lengths.splice(removeIndex, 1)

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
            $('#success').show()
            $('#mysuccess').text("Adding Tracks")

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




        $('#loader-txt').text("Adding All Tracks This will take a while")

        $('#loader').show()

        console.log(crop_track_names)
        if (window.location.pathname.replaceAll('/', '') === 'liked') {
            liked = true
        }
        console.log(liked)
        if (liked) {
            let liked_all_tracks = []

            for (i = 0; i <= crop_track_names.length - 1; i++) {
                liked_all_tracks.push(crop_track_names[i] + ' ' + crop_all_artists[i])
            }
            console.log(liked_all_tracks)
            addYTCard(undefined, liked_all_tracks, undefined, liked)

        } else {
            for (i = 0; i <= crop_track_names.length - 1; i++) {


                let type2 = crop_types[i];
                let search_for2 = crop_track_names[i] + ' ' + crop_all_artists[i];

                let url2 = crop_urls[i];
                $('#loader').show()
                console.log(url2)
                addYTCard(type2, search_for2, url2, liked)


            }
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