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
 * Shows the Success Modal.
 */
function alertOk(msj) {
    $('#modalSuccessTitulo').html(msj);
    $('#modalSuccess').fadeTo(2000, 500).slideUp(500, function () {
        $('#modalSuccess').slideUp(500);
    });
}
