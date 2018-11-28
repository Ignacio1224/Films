/**
 * Created By:
 * Ignacio Cabrera
 */

// Events
$(document).ready(mostrarCuadroLogin);
$('#modalSuccess').modal('hide');

/**
 * Shows the LogIn square with an effect like fundition.
 */
function mostrarCuadroLogin() {
    $('#squareLogin').fadeIn('slow');
}

/**
 * Shows the div error change password.
 */
$('#btnCambiarClave').click(verifyPass);
function verifyPass() {
    if (($('#txtPassword').val() !== $('#txtVerifiedPassword').val()) || $('#txtPassword').val().length < 8) {
        $('#divErrorChangePassword').html('The new password is incorrect or both doesn`t coincide');
        $('#divErrorChangePassword').css('display', 'block');
        $('#modalChangePassword').modal('show');
    } else {
        alertOk("Password changed correctly");
    }
}

/**
 * Shows the Success Modal.
 */
function alertOk(msj) {
    $('#modalSuccessTitulo').html(msj);
    $('#modalSuccess').fadeTo(2000, 500).slideUp(500, function () {
        $('#modalSuccess').slideUp(500);
    });
}
