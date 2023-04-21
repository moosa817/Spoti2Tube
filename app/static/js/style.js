$(document).ready(function () {
    $('#loading-bar').fadeOut()
});
$('#loader').hide()
$('#loader2').hide()
$('#boxs').hide()


// url navbar
let url = window.location.href
let url_link_segment = url.substring(url.lastIndexOf('/') + 1)
if (url_link_segment == '') {
    $('#index-link').addClass('bg-gradient-to-r from-theme1 to-theme2 text-white ');
}
else if (url_link_segment == 'liked') {
    $('#liked-link').addClass('bg-gradient-to-r from-theme1 to-theme2 text-white ');

}


// theme

// On page load or when changing themes, best to add inline in `head` to avoid FOUC

if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark')
    $('#themer').addClass('fa-moon')

} else {
    document.documentElement.classList.remove('dark')
    $('#themer').addClass('fa-sun')

}


$('#changetheme').click(function (e) {
    if (document.documentElement.classList.contains('dark')) {
        // change to light
        localStorage.theme = 'light'
        document.documentElement.classList.remove('dark')
        $('#themer').addClass('fa-sun')
        $('#themer').removeClass('fa-moon');
    }
    else {
        // change to dark
        localStorage.theme = 'dark'
        document.documentElement.classList.add('dark')
        $('#themer').addClass('fa-moon')
        $('#themer').removeClass('fa-sun');
    }

});

function check_dropdown() {
    if ($('#current_type').text() === "Tracks") {
        $('#current_type').attr('data', 'track');
        $('#search-dropdown').attr('placeholder', 'Search Spotify Track Name')
        console.log($('#current_type').attr('data', 'track'))
    }
    else if ($('#current_type').text() === "Playlists") {
        $('#current_type').attr('data', 'playlist');
        $('#search-dropdown').attr('placeholder', 'Search Spotify Playlist Name')
    }
    else if ($('#current_type').text() === "Albums") {
        $('#current_type').attr('data', 'album');
        $('#search-dropdown').attr('placeholder', 'Search Spotify Album Name')
    }
    else {
        $('#current_type').attr('data', 'link');
        $('#search-dropdown').attr('placeholder', 'Enter Spotify Track/Playlist/Album Link')
    }
}
check_dropdown()

// search bar
$('#dropdown button').click(function () {
    $('#current_type').text(this.innerText)
    $('#dropdown').toggleClass('hidden');
    check_dropdown()


})

// Show close icon when input field has text
$('#search-dropdown').on('input', function () {
    if ($(this).val().length > 0) {

        $('#close-icon').removeClass('hidden');
    } else {
        $('#close-icon').addClass('hidden');
    }
});

// Clear input field and hide close icon when close icon is clicked
$('#close-icon').on('click', function () {
    $('#search-dropdown').val('').trigger('input');
    $(this).addClass('hidden');
});



$('.hide-alert').click(function () {
    $(this).hide()
})


function removeFadeOut() {
    $('div[name=fadeOut]').delay(8000).fadeOut('fast');
}

setInterval(removeFadeOut, 1000);
