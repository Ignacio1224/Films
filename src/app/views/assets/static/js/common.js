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


    /* ######################## ADD FILM ####################### */
    // SLIDER
    var rangeSlider = function () {
        var slider = $('#range-slider'),
            range = $('#rangePoints'),
            value = $('#rangePointsValue');

        slider.each(function () {

            value.each(function () {
                var value = $(this).prev().attr('value');
                $(this).html(value);
            });

            range.on('input', function () {
                $(this).next(value).html(this.value);
            });
        });
    };

    rangeSlider();

    /* ######################## VIEW FILM ######################## */
    // Fill the table
    FillTable();



    // Icon of Search in PlaceHolders' input
    $('#txtSearchFilm').keyup(function () {
        if ($(this).val().length > 0) {
            $(this).css('font-family', 'Poppins, sans-serif');
            $(this).css('font-weight', 400);
            FillTable($(this).val())
        } else {
            $(this).removeAttr('style');
            FillTable();
        }
    });


    /* ######################## VIEW FILM ######################## */
    // Fill the dropdown with films on database
    $.ajax({
        url: "/GetAllFilms",
        dataType: 'json',
        type: "GET",
        success: function (e){
            ActionFillComboBox(e);
        }
    });



    /* ######################## DELETE FILM ######################## */
    $('#cmbFilmName').select2();

});

function FillTable(filter = null) {
    // Clear the table
    $('#tbodyViewFilm').html('');

    // GET DATA OF DATABASE
    if (!filter) {
        $.ajax({
            url: "/GetAllFilms",
            dataType: 'json',
            type: 'GET',
            success: function (e) {
                ActionFillTable(e);
            }
        });
    } else {
        $.ajax({
            url: "/GetAllFilms?filter=" + filter,
            dataType: 'json',
            type: 'GET',
            success: function (e) {
                ActionFillTable(e);
            }
        });
    }

}

function ActionFillTable(films) {

    for (const f of films) {
        let filmDuration = (f.filmDuration === "" || f.filmDuration === undefined || !f.filmDuration) ? "------" : f.filmDuration + " min";
        let memoryAddress = (f.memoryAddress === "" || f.memoryAddress === undefined || !f.memoryAddress) ? "------" : f.memoryAddress;
        let rating = (f.reting === "" || f.rating === undefined || !f.rating) ? "------" : f.rating;

        let date = new Date(f.viewDate);
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let dt = date.getDate();

        if (dt < 10) {
            dt = '0' + dt;
        }
        if (month < 10) {
            month = '0' + month;
        }

        let viewDate = month + ' / ' + dt + ' / ' + year;


        $('#tbodyViewFilm').append(`<tr><td>${f.filmName}</td><td>${filmDuration}</td><td>${rating}</td><td>${memoryAddress}</td><td>${viewDate}</td></tr>`);
    }
}

function ActionFillComboBox(films) {
    for (const f of films) {
        $("#cmbFilmName").append(`<option value="${f.filmName}">${f.filmName}</option>`);
    }
}