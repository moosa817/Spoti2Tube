
$('#search_form').submit(function (e) { 
    e.preventDefault();
    console.log($('#search').val())
    $.ajax({
        type: "POST",
        url: "/",
        data: "data",
        dataType: "dataType",
        success: function (response) {
            
        }
    });
    

});