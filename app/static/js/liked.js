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


function yt_card(ytname, link, artist, type) {
    let content = `<div>
            <div
                class="dark:bg-gray-950 bg-gray-300 rounded-lg p-4 m-4 grid md:grid-flow-col md:grid-cols-3 grid-flow-row ">
                <div class="custom-span">
                    <img class="inline-block h-20" src="https://flowbite.com/docs/images/blog/image-1.jpg">
                </div>

                <div class="flex items-center justify-between col-span-2">
                    <div class="mr-auto">
                        <div class="text-xl font-semibold">
                        <a href=${link}>
                            ${ytname}
                            </a>
                        </div>

                        <div class=" text-[10px] dark:text-gray-400 text-right">
                            By: ${artist}
                        </div>
                        <div class=" text-[10px] dark:text-gray-400 text-right">
                            Type: ${type}
                        </div>
                    </div>

                    <div class="ml-auto">
                        <div class="my-2 ">
                            <button class="hover:scale-110 bg-green-400 p-1 rounded-lg "><svg class="h-6 text-white"
                                    viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g id="Interface / Download">
                                        <path class="stroke-black dark:stroke-white" id="Vector"
                                            d="M6 21H18M12 3V17M12 17L17 12M12 17L7 12" stroke-width="2"
                                            stroke-linecap="round" stroke-linejoin="round" />
                                    </g>
                                </svg></button>
                        </div>
                        <div> <button class="bg-red-600 rounded-[50%] w-6 ml-1 h-6 hover:scale-110"
                                style="border-radius:60%;"><i class=" fa-solid fa-minus "></i></button>
                        </div>

                    </div>
                </div>
            </div>
        </div>

`
    $('#yt-col').append(content);

}


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
                $('#error #myerror').html("Unvalid Email Address");
            }

        }
    });

});

let tracks = $('#liked-tracks').attr('data');

if (tracks !== undefined) {
    $('#boxs').show()
    tracks = tracks.replaceAll("'", '"');

    tracks = JSON.parse(tracks)


    tracks.forEach(track => {
        spotify_card(track.name, track.url, track.by, track.type, track.img)

    });
    after_search()


}
