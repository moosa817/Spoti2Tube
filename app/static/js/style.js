
let url = window.location.href
let url_link_segment = url.substring(url.lastIndexOf('/') + 1)
if(url_link_segment == ''){
    $('#index-link').addClass('bg-gradient-to-r from-theme1 to-theme2 text-white ');
}
else if(url_link_segment == 'liked'){
    $('#liked-link').addClass('bg-gradient-to-r from-theme1 to-theme2 text-white ');

}