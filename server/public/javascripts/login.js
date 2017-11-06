$(function(){
    $('#login').click(function () {
        var email = $('.login-container [name=email]').val();
        var password = $('.login-container [name=password]').val();

        $.ajax({
            type: "POST",
            url: "https://ec2-13-112-109-240.ap-northeast-1.compute.amazonaws.com:3000/login",
            data: {
                "email": email,
                "password": password
            },
            success: function(j_data){

                alert("POST success");

            }
        });

    });

    $('#signup').click(function () {
        alert("signupクリックされました");
    });

    $('#test').click(function () {
        $(this).text("クリックされました");
        alert("signupクリックされました");
    });
});
