function spotify_card(trackname, link, artist, type, img) {
    let content = `
       <div class="spoti-card">

            <div
                class="dark:bg-gray-950 bg-gray-300 rounded-lg p-4 m-4 grid md:grid-flow-col md:grid-cols-3 grid-flow-row ">
                <div class="custom-span">
                    <img class="inline-block h-20" src="${img}"></img>
                </div>

                <div class="flex items-center justify-between col-span-2 ">
                    <div class="mr-auto">
                        <div class="sm:text-[1rem] font-semibold ">
                           <a href="${link}" target="_blank"> ${trackname} </a>
                        </div>

                        <div class=" text-[10px]  dark:text-gray-400 text-right">
                            By: ${artist}
                        </div>
                        <div class=" text-[10px]  dark:text-gray-400 text-right">
                            Type: ${type}
                        </div>
                    </div>

                    <div class="ml-auto">
                        <div class="my-2 add" data-url="${link}" data-type="${type}"  data="${trackname} ${artist}">
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

}


function yt_card(ytname, link, artist, type, img) {
    let content = `<div>
            <div
                class="dark:bg-gray-950 bg-gray-300 rounded-lg p-4 m-4 grid md:grid-flow-col md:grid-cols-3 grid-flow-row ">
                <div class="custom-span">
                    <img class="inline-block h-20" src="${img}">
                </div>

                <div class="flex items-center justify-between col-span-2">
                    <div class="mr-auto">
                        <div class="text-[13px] font-semibold">
                        <a href="${link}" target="_blank">
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
// yt_card()




$(document).ready(function () {
    $('#loading-bar').fadeOut()
});
$('#boxs').hide()

// when search button clicked
$('#search_form').submit(function (e) {
    e.preventDefault();
    let search_val = $('#search-dropdown').val();
    let type = $('#current_type').attr('data');
    let no = $('#no').val()
    if (no === '#') {
        no = 1
    } else {
        no = parseInt(no);
    }

    console.log(search_val, type, no)
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
                    spotify_card(element.name, element.url, element.by, element.type, element.img)

                });

                $('#boxs').show()
                $('#success').show();
                $('#mysuccess').html(`Songs Found`)
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
        $('#loading-bar').show()

        let search_for = $(this).attr('data');
        let type = $(this).attr('data-type');
        let url = $(this).attr('data-url');
        console.log(search_for)

        if (type === 'Track') {
            let songs = [search_for]
            // search for yt url
            $.ajax({
                type: "POST",
                url: "/search_yt",
                data: JSON.stringify({ search: songs }),
                contentType: 'application/json',
                success: function (response) {
                    $('#loading-bar').fadeOut()
                    if (response === undefined || response.length == 0) {
                        console.error("Found Nothing")
                        $('#error').show();
                        $('#myerror').html("Nothing Found");
                    }
                    else {
                        ytinfo = response[0]
                        yt_card(ytinfo["title"], ytinfo["link"], ytinfo['by'], ytinfo['type'], ytinfo['thumbnail'])
                    }
                }

            })


        }
        else {
            // playlist etc
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
                        track_names = []
                        response.forEach(item => {
                            track_names.push(item.name + ' ' + item.by)
                        });
                        $.ajax({
                            type: "POST",
                            url: "/search_yt",
                            data: JSON.stringify({ search: track_names }),
                            contentType: 'application/json',
                            success: function (response) {
                                $('#loading-bar').fadeOut()
                                if (response === undefined || response.length == 0) {
                                    console.error("Found Nothing")
                                    $('#error').show();
                                    $('#myerror').html("Nothing Found");
                                }
                                else {
                                    console.log(response)
                                    response.forEach(element => {
                                        yt_card(element.title, element.url, element.by, element.type, element.thumbnail)
                                    });
                                }
                            }

                        })

                    }
                }
            })
        }
    })
}