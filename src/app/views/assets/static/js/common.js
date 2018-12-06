// Negate Go Back with Explorer Button
window.location.hash = "no-back-button";
window.location.hash = "Again-No-back-button"; //again because google chrome don't insert first hash into history
window.onhashchange = function () {
    window.location.hash = "no-back-button";
}

$(document).ready(function () {

    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
    });

    // Display Modal of Change Password Correct
    var element = document.getElementById('changePasswordModalCorrect');
    if (element != null || typeof (element) != undefined) {
        $('#changePasswordModalCorrect').modal('show');
        $('#changePasswordModalCorrect > div > div').css("background-color", "rgba(24, 200, 26, 0.6)");

        setTimeout(function () {
            $('#changePasswordModalCorrect').modal('hide');
        }, 2000);
    }
});