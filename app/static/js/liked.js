// function spotify_card(trackname, link, artist, type, img) {
//     let content = `
//        <div>



//             <div
//                 class="dark:bg-gray-950 bg-gray-300 rounded-lg p-4 m-4 grid md:grid-flow-col md:grid-cols-3 grid-flow-row ">
//                 <div class="custom-span">
//                     <img class="inline-block h-20" src="${img}">
//                 </div>

//                 <div class="flex items-center justify-between col-span-2 ">
//                     <div class="mr-auto">
//                         <div class="sm:text-[1rem] font-semibold ">
//                            <a href=${link}> ${trackname} </a>
//                         </div>

//                         <div class=" text-[10px]  dark:text-gray-400 text-right">
//                             By: ${artist}
//                         </div>
//                         <div class=" text-[10px]  dark:text-gray-400 text-right">
//                             Type: ${type}
//                         </div>
//                     </div>

//                     <div class="ml-auto">
//                         <div class="my-2 ">
//                             <button class="hover:scale-110 bg-green-400 p-1 rounded-lg "><i
//                                     class="fa-solid fa-plus w-4"></i>
//                                 </svg></button>
//                         </div>
//                         <div> <button class="bg-red-600 rounded-[50%] w-6 h-6 hover:scale-110"
//                                 style="border-radius:60%;"><i class=" fa-solid fa-minus "></i></button>
//                         </div>


//                     </div>
//                 </div>
//             </div>

//         </div>
// `
//     $('#spotify-col').append(content);

// }


$('#liked_email').submit(function (e) {
    e.preventDefault();
    let email = $('#email-liked').val();
    $('#loading-bar').show();



    $.ajax({
        type: "POST",
        url: "/verify",
        data: JSON.stringify({ email: email }),
        contentType: 'application/json',
        success: function (response) {
            $('#loading-bar').fadeOut()

            if (response.success) {
                $('#not_verified_form').hide()
                if (response.status === 'verified') {
                    $('#login_spotify_btn').css("display", "flex");

                }
                else if (response.status === 'pending') {
                    $('#pending').css("display", "flex");

                }
            }
            else {
                $('#error').show();
                $('#myerror').html("Unvalid Email Address");
            }

        }
    });

});




if (typeof mytracks !== 'undefined') {
    $('#boxs').show()

    mytracks.reverse().forEach(track => {



        tracks_name.push(track.name)
        all_artists.push(track.by)
        urls.push(track.url)
        types.push(track.type)


        spotify_card(track.name, track.url, track.by, track.type, track.img, 1)

    });


}
const queryParams = new URLSearchParams(window.location.search);
const limit = queryParams.get('limit');

if (limit == null) {
    $('#n-link').attr('href', 'liked?limit=' + '50')
} else {
    $('#liked-range').val(limit)
    $('#n-link').attr('href', 'liked?limit=' + limit)

}

$('#liked-range').on('change', function () {
    if ($(this).val() > max_tracks) {
        $('#n-link').attr('href', 'liked?limit=' + max_tracks)
        $('#liked-range').val(max_tracks)

    }


    $('#n-link').attr('href', 'liked?limit=' + $(this).val())
});

$('#all-check').on('change', function () {
    if (this.checked) {
        $('#liked-range').val(max_tracks)
        $('#n-link').attr('href', 'liked?limit=' + max_tracks)
    }
})