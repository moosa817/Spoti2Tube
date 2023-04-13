
$('#liked_email').submit(function (e) {
    e.preventDefault();
    let email = $('#email-liked').val();



    $.ajax({
        type: "POST",
        url: "/verify",
        data: JSON.stringify({ email: email }),
        contentType: 'application/json',
        success: function (response) {
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