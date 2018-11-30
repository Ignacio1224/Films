$(document).ready(function () {

    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
    });

    // Display Modal of Change Password Correct
    var element =  document.getElementById('changePasswordModalCorrect');
    if (element != null || typeof(element) !=  undefined) {
        $('#changePasswordModalCorrect').modal('show');
        $('#changePasswordModalCorrect > div > div').css("background-color", "rgba(24, 200, 26, 0.6)");

        setTimeout(function() {
            $('#changePasswordModalCorrect').modal('hide');
        }, 2000);
    }
});