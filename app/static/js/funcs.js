function spotify_card(trackname, link, artist, type, img, length) {

    let content = `
       <div class="spoti-card" data-length="${length}" data-type="${type}" data-artist="${artist}" data-url="${link}">

            <div
                class="dark:bg-gray-950 bg-gray-300 rounded-lg p-4 m-4 grid md:grid-flow-col md:grid-cols-3 grid-flow-row ">
                <div class="custom-span">
                    <img class="inline-block h-20 rounded" src="${img}"></img>
                </div>

                <div class="flex items-center justify-between col-span-2 ">
                    <div class="mr-auto">
                        <div class="sm:text-[1rem] font-semibold ">
                           <a href="${link}" target="_blank" class="track-name"> ${trackname} </a>
                        </div>

                        <div class=" text-[10px]  dark:text-gray-400 text-right">
                            By: ${artist}
                        </div>
                        <div class=" text-[10px]  dark:text-gray-400 text-right">
                            Type: ${type}
                        </div>
                        <div class=" text-[10px]  dark:text-gray-400 text-right track-length">
                            Length: ${length} Tracks
                        </div>
                
                    </div>

                    <div class="ml-auto">
                        <div class="my-2 add" data-url="${link}" data-type="${type}"  data="${link} ${artist}" data-length="${length}">
                            <button class="hover:scale-110 bg-green-400 p-1 rounded-lg "><i
                                    class="fa-solid fa-plus w-4"></i>
                                </button>
                        </div>
                        <div class="remove"> <button class="bg-red-600 rounded-[50%] w-6 h-6 hover:scale-110"
                                style="border-radius:60%;"><i class=" fa-solid fa-minus "></i></button>
                        </div>


                    </div>
                </div>
            </div>

        </div>
`
    $('#spotify-cards').prepend(content);
    if (type === 'Track') {
        $(`[data-url="${link}"] .track-length`).hide()
    }

}


function yt_card(link, ytname, artist, img, type, search_name) {
    let content = `<div class="yt-card" data-search="${search_name}">
            <div
                class="dark:bg-gray-950 bg-gray-300 rounded-lg p-4 m-4 grid md:grid-flow-col md:grid-cols-3 grid-flow-row ">
                <div class="custom-span">
                    <img class="inline-block h-20 rounded" src="${img}">
                </div>

                <div class="flex items-center justify-between col-span-2">
                    <div class="mr-auto">
                        <div class="text-[13px] font-semibold">
                        <a href="${link}" target="_blank" class='yt-link'>
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
                            <button data-url="${link}" data-title="${ytname}" class="download hover:scale-110 bg-green-400 p-1 rounded-lg "><svg class="h-6 text-white"
                                    viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g id="Interface / Download">
                                        <path class="stroke-black dark:stroke-white" id="Vector"
                                            d="M6 21H18M12 3V17M12 17L17 12M12 17L7 12" stroke-width="2"
                                            stroke-linecap="round" stroke-linejoin="round" />
                                    </g>
                                </svg></button>
                        </div>
                        <div> <button class="yt-remove bg-red-600 rounded-[50%] w-6 ml-1 h-6 hover:scale-110"
                                style="border-radius:60%;"><i class=" fa-solid fa-minus "></i></button>
                        </div>

                    </div>
                </div>
            </div>
        </div>

`


    var hrefs = $('.yt-link').map(function () {
        return $(this).attr('href');
    }).get();

    if (hrefs.includes(link)) {

        $('#error').show()
        $('#myerror').text("Already Added Skipping")

    }
    else {
        $('#yt-cards').append(content);

    }

}


// when Add All is clicked
function AddModal(no, name, length) {
    let content = `
<div class="flex bg-gray-400 dark:text-white mt-4 dark:bg-gray-900 p-4 justify-between rounded mx-4">
    <div class="">
        ${no}. ${name}
    </div>
    <div>Length: <span class="font-medium">${length}</span></div>

</div>

`

    $('#modal-html').append(content)
    // $('#modal-text').text("Are you sure you want to add all these tracks ?")


}

// checks stuff and adds yt-card (not the card itself)
function addYTCard(type, search_for, url, liked = false, from_single_file = false) {
    if (search_yt_items.includes(search_for)) {
        $('#error').show();
        $('#myerror').text("Already Added");
    }
    else {
        if (liked) {
            $.ajax({
                type: "POST",
                url: "/search_yt",
                data: JSON.stringify({ search: search_for }),
                contentType: 'application/json',
                success: function (response) {
                    $('#loader').fadeOut()
                    if (response === undefined || response.length == 0) {
                        console.error("Found Nothing")
                        $('#error').show();
                        $('#myerror').html("Nothing Found");
                    }
                    else {
                        let counter = 0
                        response.forEach(track => {
                            counter += 1
                            yt_card(track.link, track.title, track.by, track.thumbnail, track.type, search_for[counter])
                        })
                    }
                }
            })



        } else {


            search_yt_items.push(search_for)
            if (type === 'Track') {
                let songs = [search_for]
                // search for yt url
                $('#loader').show()
                $.ajax({
                    type: "POST",
                    url: "/search_yt",
                    data: JSON.stringify({ search: songs }),
                    contentType: 'application/json',
                    success: function (response) {
                        if (response === undefined || response.length == 0) {
                            console.error("Found Nothing")
                            $('#error').show();
                            $('#myerror').html("Nothing Found");
                        }
                        else {
                            let track = response[0]
                            counter += 1

                            if (counter === crop_urls.length) {
                                $('#loader').fadeOut()
                            }

                            if (from_single_file) {
                                $('#loader').fadeOut()
                            }


                            yt_card(track.link, track.title, track.by, track.thumbnail, track.type, search_for)
                            $('#success').show()
                            $('#mysuccess').text("Added Tracks")

                        }
                    }

                })


            }
            else {
                // playlist etc
                if (url != undefined) {
                    $('#loader').show()
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
                                let track_names = []
                                response.forEach(item => {
                                    track_names.push(item.name + ' ' + item.by)
                                });
                                $('#loader').show()
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
                                            // $('#loader').fadeOut()
                                            if (from_single_file) { $('#loader').fadeOut() }


                                            counter += 1

                                            if (counter === crop_urls.length) {
                                                $('#loader').fadeOut()
                                            }
                                            response.forEach(element => {


                                                yt_card(element.link, element.title, element.by, element.thumbnail, element.type, search_for)
                                            });

                                            $('#success').show()
                                            $('#mysuccess').text("Added Tracks")

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
}