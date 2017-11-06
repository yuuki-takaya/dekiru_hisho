$(function(){
    $('#login').click(function () {

        var email = $('.login-container [name=email]').val();
        var password = $('.login-container [name=password]').val();
	
	alert(email+' : '+password);
    });

    $('#signup').click(function () {
        alert("signupクリックされました");
    });

    $('#test').click(function () {
        $(this).text("クリックされました");
        alert("signupクリックされました");
    });
});
