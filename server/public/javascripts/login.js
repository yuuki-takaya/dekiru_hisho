$(function(){
    $('#login').click(function () {
        $(this).text("クリックされました");
    });

    $('#signup').click(function () {
        alert("signupクリックされました");
    });

    $('#test').click(function () {
        $(this).text("クリックされました");
        alert("signupクリックされました");
    });
});