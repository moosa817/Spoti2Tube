
// url navbar
let url = window.location.href
let url_link_segment = url.substring(url.lastIndexOf('/') + 1)
if(url_link_segment == ''){
    $('#index-link').addClass('bg-gradient-to-r from-theme1 to-theme2 text-white ');
}
else if(url_link_segment == 'liked'){
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
    if(document.documentElement.classList.contains('dark')){
        // change to light
        localStorage.theme = 'light'
        document.documentElement.classList.remove('dark')
        $('#themer').addClass('fa-sun')
        $('#themer').removeClass('fa-moon');
    }
    else{
        // change to dark
        localStorage.theme = 'dark'
        document.documentElement.classList.add('dark')
        $('#themer').addClass('fa-moon')
        $('#themer').removeClass('fa-sun');
    }
    
});
