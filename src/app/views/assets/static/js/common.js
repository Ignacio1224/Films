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

    // POST Change Password Form
    $("#changePasswordForm").submit(function (event) {

        let newPassword = $('#txtPasswordNew').val();
        let newPasswordVerify = $('#txtPasswordNewVerify').val();

        if (newPassword === newPasswordVerify && newPassword.length > 7) {
            $(this).unbind("click");
            $('#divErrorChangePassword').css("display", "none");
            
            $.ajax({
                type: "POST",
                url: "ChangePassword",
                data: {
                    txtPasswordNew: newPassword,
                    txtPasswordNewVerify: newPasswordVerify
                }
            });

        } else {
            event.preventDefault();
            $('#divErrorChangePassword').css("display", "block");
        }
    });


    // Display Modal of Change Password Correct
    var changePasswordModal = document.getElementById('changePasswordModalCorrect');
    if (changePasswordModal != null || typeof (changePasswordModal) != undefined) {
        $('#changePasswordModalCorrect').modal('show');
        $('#changePasswordModalCorrect > div > div').css("background-color", "rgba(24, 200, 26, 0.6)");

        setTimeout(function () {
            $('#changePasswordModalCorrect').modal('hide');
        }, 2000);
    }

    // Display Modal of Reset Password Correct
    var resetPasswordModal = document.getElementById('resetPasswordModalCorrect');
    if (resetPasswordModal != null || typeof (resetPasswordModal) != undefined) {
        $('#resetPasswordModalCorrect').modal('show');
        $('#resetPasswordModalCorrect > div > div').css("background-color", "rgba(24, 200, 26, 0.6)");

        setTimeout(function () {
            $('#resetPasswordModalCorrect').modal('hide');

            if (resetPasswordModal !== null)
                window.location.replace('/');

            resetPasswordModal = null;
        }, 2000);

    }

});