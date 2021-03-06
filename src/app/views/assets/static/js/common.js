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

    // Hide or show the slider depending if the film it's viewed
    $('#chbxViewedAddFilm').change(function () {
        $('#div-pointsAddFilm').toggle();
    });


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
    let viewed = $('#chbxViewed:checked').val();
    FillTable(null, viewed);
    $('#chbxViewed').change(function () {
        let viewed = $('#chbxViewed:checked').val();
        FillTable(null, viewed)
    });



    // Icon of Search in PlaceHolders' input
    $('#txtSearchFilm').keyup(function () {
        if ($(this).val().length > 0) {
            $(this).css('font-family', 'Poppins, sans-serif');
            $(this).css('font-weight', 400);
            let viewed = $('#chbxViewed:checked').val();
            FillTable($(this).val(), viewed)
        } else {
            $(this).removeAttr('style');
            let viewed = $('#chbxViewed:checked').val();
            FillTable(null, viewed);
        }
    });


    /* ######################## DELETE FILM ######################## */
    // Fill the dropdown with films on database
    $.ajax({
        url: "/GetAllFilms?option=7896541236",
        dataType: 'json',
        type: "GET",
        success: function (e) {
            ActionFillComboBox("#cmbFilmNameDelete", e);
        }
    });

    $('#cmbFilmNameDelete').select2();


    /* ######################## Edit FILM ######################## */
    // Slider
    var rangeSlider = function () {
        var slider = $('#range-sliderEdit'),
            range = $('#rangePointsEdit'),
            value = $('#rangePointsValueEdit');

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

    $.ajax({
        url: "/GetAllFilms?option=7896541236",
        dataType: 'json',
        type: "GET",
        success: function (e) {
            ActionFillComboBox("#cmbFilmNameEdit", e);
        }
    });

    $('#cmbFilmNameEdit').select2();

    DisableEditFields('#cmbFilmNameEdit');
    $('#cmbFilmNameEdit').change(function () {
        DisableEditFields('#cmbFilmNameEdit');
        FillDataEdit('#cmbFilmNameEdit');
    });

    $('#div-pointsEdit').hide();
    $('#chbxViewedEdit').change(function () {
        if ($('#chbxViewedEdit').is(':checked')) {
            $('#div-pointsEdit').show();
        } else {
            $('#div-pointsEdit').hide();
        }
    });

});

function FillTable(filter = null, viewed = null) {
    // Clear the table
    $('#tbodyViewFilm').html('');

    // GET DATA OF DATABASE

    if (!filter) {
        $.ajax({
            url: "/GetAllFilms?option=" + viewed + "&filter=",
            dataType: 'json',
            type: 'GET',
            success: function (e) {
                ActionFillTable(e, viewed);
            }
        });
    } else {
        $.ajax({
            url: "/GetAllFilms?option=" + viewed + "&filter=" + filter,
            dataType: 'json',
            type: 'GET',
            success: function (e) {
                ActionFillTable(e, viewed);
            }
        });
    }

}

function ActionFillTable(films, all) {

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

        if (all === "7896541236") {
            $('#trViewFilm').html('<th scope="col">Film Name</th><th scope="col">Film Duration</th><th scope="col">Address</th>');
            $('#tbodyViewFilm').append(`<tr><td>${f.filmName}</td><td>${filmDuration}</td><td>${memoryAddress}</td></tr>`);
        } else {
            $('#trViewFilm').html('<th scope="col">Film Name</th><th scope="col">Film Duration</th><th scope="col">Rating</th><th scope="col">Address</th><th scope="col">Viewed Date</th>');
            $('#tbodyViewFilm').append(`<tr><td>${f.filmName}</td><td>${filmDuration}</td><td>${rating}</td><td>${memoryAddress}</td><td>${viewDate}</td></tr>`);
        }
    }
}

function ActionFillComboBox(cmb, films) {
    for (const f of films) {
        $(cmb).append(`<option value="${f.filmName}">${f.filmName}</option>`);
    }
}

function DisableEditFields(cmb) {
    const cmbVal = $(cmb).val();
    let disabled = false;

    if (cmbVal === "" || !cmbVal) {
        disabled = true;
    }

    if ($('#chbxViewedEdit').is(':checked')) {
        $('#div-pointsEdit').show();
    } else {
        $('#div-pointsEdit').hide();
    }

    if (disabled) {
        $('#div-durationEdit').hide();
        $('#div-memoryEdit').hide();
        $('#div-viewedEdit').hide();
        $('#div-pointsEdit').hide();
        $('#bttnEdit').hide();

    } else {
        $('#div-durationEdit').show();
        $('#div-memoryEdit').show();
        $('#div-viewedEdit').show();
        $('#bttnEdit').show();
    }

}

function FillDataEdit(cmb) {
    const cmbVal = $(cmb).val();
    if (cmbVal !== "") {
        $.ajax({
            url: "/GetAllFilms?filter=" + cmbVal + "&option=7896541236",
            dataType: 'json',
            type: "GET",
            success: function (e) {
                ActionFillDataEdit(e);
            }
        });
    }
}

function ActionFillDataEdit(film, id = null) {
    if (id == null) {
        $('#txtDurationEdit').val(`${film[0].filmDuration}`);
        console.log(film[0].memoryAddress);
        
        if (film[0].memoryAddress != "") {
            $('#spanAddressMesj').show();
        } else {
            $('#spanAddressMesj').hide();
        }
        $('#chbxViewedEdit').prop('checked', false);
        $('#div-pointsEdit').hide();
        $.ajax({
            url: "/GetAllViewedFilms?filter=" + film[0].filmId,
            dataType: 'json',
            type: "GET",
            success: function (e) {
                let i = 0;
                let found = false;
                while (!found && i < e.length) {
                    if (e[i].filmId == film[0].filmId) {
                        found = true;
                        ActionFillDataEdit(e, film[0].filmId);
                    }
                    i++;
                }
            }
        });

    } else {
        $.ajax({
            url: "/GetAllViewedFilms?filter=" + id,
            dataType: 'json',
            type: "GET",
            success: function (e) {
                $('#chbxViewedEdit').prop('checked', true);
                $('#rangePointsEdit').val(`${e[0].rating}`);
                $('#rangePointsValue').text(`${e[0].rating}`);
                $('#div-pointsEdit').show();
            }
        });
    }

}