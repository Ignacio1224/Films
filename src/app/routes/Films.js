// Database Connection
const dbConnection = require('../../config/dbConnection');

// AddFilmPage
const GenPage = require('./Pages');

// Send Mail
const Email = require('./SendMail');

// Queries
const Queries = require('./Queries');


// MainPage
const RenderPage = "Base/base";

// Logued User
var LoggedUser = null;


module.exports = app => {
    const connection = dbConnection();

    // #################################### START ####################################
    //GET
    app.get('/', (req, res) => {
        res.render("LogIn/LogIn", {
            error: ""
        });
    });

    //GET
    app.get('/LogIn', (req, res) => {
        res.render("LogIn/LogIn", {
            error: ""
        });
    });


    // #################################### LOGIN FROM ####################################
    // GET
    app.get('/Films', (req, res) => {
        if (LoggedUser === null) {
            res.render("LogIn/LogIn", {
                error: "User not logged"
            });
            return false;
        }

        res.render(RenderPage, {
            Page: {
                userNameLogged: LoggedUser,
                titleTab: "Dashboard",
                sidebarClass: "Home",
                changePassword: false
            }
        });
    });

    // POST
    app.post('/Films', (req, res) => {
        const {
            userName,
            password
        } = req.body;

        connection.query(Queries.Query("GetUserComplete", userName), (err, result) => {

            if (result.length === 0) {
                return res.render("LogIn/LogIn", {
                    error: "User or Password Incorrect"
                });
            }

            if (result[0].userName === userName && result[0].userPassword === password) {

                // Delete the code from database
                var email = result[0].userEmail;
                const connection2 = dbConnection();
                connection2.query(Queries.Query("DeletePasswordResetCode", email));

                res.render(RenderPage, {
                    Page: {
                        userNameLogged: result[0].userName,
                        titleTab: "Dashboard",
                        sidebarClass: "Home",
                        changePassword: false
                    }
                });

            } else {
                res.render("LogIn/LogIn", {
                    error: "User or Password Incorrect"
                });
            }

            // Set userLogged
            LoggedUser = result[0].userName;
        });
    });


    // #################################### LOGOUT ####################################
    // GET
    app.get('/LogOut', (req, res) => {
        LoggedUser = null;
        return res.render('LogIn/LogIn', {
            error: ""
        });
    });


    // #################################### CHANGE PASSWORD ####################################
    // POST
    app.post('/ChangePassword', (req, res) => {
        if (LoggedUser === null) {
            return res.render("LogIn/LogIn", {
                error: "User not logged"
            });
        }

        const {
            txtPasswordNew,
            txtPasswordNewVerify
        } = req.body;

        if (txtPasswordNew.length >= 8 && (txtPasswordNew === txtPasswordNewVerify)) {

            connection.query(Queries.Query("UpdateUserPassword", LoggedUser, txtPasswordNew), (err, result) => {

                const connection2 = dbConnection();
                connection2.query(Queries.Query("GetUserEmail", LoggedUser), (err, result2) => {

                    // Send Email
                    const subject = "FILMS SYSTEM | Password Changed!";
                    const text = "Your password has been changed correctly.";
                    Email.SendEmail(result2[0].userEmail, subject, text);

                    res.render(RenderPage, {
                        Page: {
                            userNameLogged: LoggedUser,
                            titleTab: "Dashboard",
                            sidebarClass: "Home",
                            changePassword: true,
                            AddFilm: {
                                filmName: "",
                                duration: "",
                                memoryAddress: "",
                                points: 50,
                                messaje: "",
                                class: "alert-init"
                            }
                        }
                    });

                });

            });
        }
    });


    // #################################### ADD FILM ####################################
    // GET
    app.get('/AddFilm', (req, res) => {
        if (LoggedUser === null) {
            res.render("LogIn/LogIn", {
                error: "User not logged"
            });
            return false;
        }

        res.render(RenderPage, {
            Page: GenPage.GeneratePage('', LoggedUser, false, 'alert-init', 'AddFilm')
        });
    });

    // POST
    app.post('/AddFilm', (req, res) => {
        if (LoggedUser === null) {
            return res.render("LogIn/LogIn", {
                error: "User not logged"
            });
        }

        const {
            txtFilmName,
            txtDuration,
            txtMemoryAddress,
            rangePointsAdd,
            chbxViewedAddFilm
        } = req.body;

        const points = parseInt(rangePointsAdd);

        if (txtFilmName === "" || txtDuration === "" || rangePointsAdd === "" || points === NaN) {
            return res.render(RenderPage, {
                Page: GenPage.GeneratePage('Invalid Fields', LoggedUser, false, 'alert-danger', 'AddFilm')
            });
        }

        connection.query(Queries.Query("InsertFilm", txtFilmName, txtDuration, txtMemoryAddress), (err, result) => {
            if (!err) {

                if (chbxViewedAddFilm == "1") {

                    const connection2 = dbConnection();
                    connection2.query(Queries.Query("GetFilmId", txtFilmName), (err2, result2) => {

                        let filmID = result2[0].filmId;
                        let todayDate = GetTodayDate();

                        const connection3 = dbConnection();
                        connection3.query(Queries.Query("InsertViewed", filmID, LoggedUser, points, todayDate), (err3, result3) => {

                            if (!err3) {
                                return res.render(RenderPage, {
                                    Page: GenPage.GeneratePage('Film Added Successfully', LoggedUser, false, 'alert-success', 'AddFilm')
                                });
                            } else {
                                return res.render(RenderPage, {
                                    Page: GenPage.GeneratePage('Can Not Add This Film', LoggedUser, false, 'alert-danger', 'AddFilm')
                                });
                            }
                        });
                    });
                } else {
                    return res.render(RenderPage, {
                        Page: GenPage.GeneratePage('Film Added Successfully', LoggedUser, false, 'alert-success', 'AddFilm')
                    });
                }
            } else {
                return res.render(RenderPage, {
                    Page: GenPage.GeneratePage('Can Not Add This Film', LoggedUser, false, 'alert-danger', 'AddFilm')
                });
            }

        });

    });


    // #################################### DELETE FILM ####################################
    // GET
    app.get('/DeleteFilm', (req, res) => {
        if (LoggedUser === null) {
            res.render("LogIn/LogIn", {
                error: "User not logged"
            });
            return false;
        }

        res.render(RenderPage, {
            Page: GenPage.GeneratePage('', LoggedUser, false, 'alert-init', 'DeleteFilm')
        });
    });

    // POST
    app.post('/DeleteFilm', (req, res) => {
        if (LoggedUser === null) {
            return res.render("LogIn/LogIn", {
                error: "User not logged"
            });
        }

        const {
            cmbFilmNameDelete,
            chbxConfirm
        } = req.body;

        if (cmbFilmNameDelete === "" || chbxConfirm != "1") {
            return res.render(RenderPage, {
                Page: GenPage.GeneratePage('Invalid Fields', LoggedUser, false, 'alert-danger', 'DeleteFilm')
            });
        }

        var deleted = false;
        var filmID;
        let connection3 = dbConnection();

        connection.query(Queries.Query("GetFilmId", cmbFilmNameDelete), (err, result) => {
            filmID = result[0].filmId;
            let connection2 = dbConnection();

            connection2.query(Queries.Query("DeleteViewedFilm", filmID));

            connection3.query(Queries.Query("DeleteFilm", filmID), (err2, result2) => {
                if (!err2) {
                    deleted = true;
                } else {
                    deleted = false;
                }

                if (deleted) {
                    return res.render(RenderPage, {
                        Page: GenPage.GeneratePage('Film Deleted', LoggedUser, false, 'alert-success', 'DeleteFilm')
                    });
                } else {
                    return res.render(RenderPage, {
                        Page: GenPage.GeneratePage('Invalid Fields', LoggedUser, false, 'alert-danger', 'DeleteFilm')
                    });
                }
            });

        });

    });

    
    // #################################### EDIT FILM ####################################
    // GET
    app.get('/EditFilm', (req, res) => {
        if (LoggedUser === null) {
            res.render("LogIn/LogIn", {
                error: "User not logged"
            });
            return false;
        }

        res.render(RenderPage, {
            Page: GenPage.GeneratePage('', LoggedUser, false, 'alert-init', 'EditFilm')
        });
    });


    // POST
    app.post('/EditFilm', (req, res) => {
        if (LoggedUser === null) {
            res.render("LogIn/LogIn", {
                error: "User not logged"
            });
            return false;
        }

        const {
            cmbFilmNameEdit,
            txtDurationEdit,
            txtMemoryAddressEdit,
            chbxViewedEdit,
            rangePointsEdit
        } = req.body;

        const points = parseInt(rangePointsEdit);

        if (cmbFilmNameEdit === "" || txtDurationEdit === "" || points === NaN) {
            return res.render(RenderPage, {
                Page: GenPage.GeneratePage('Invalid Fields', LoggedUser, false, 'alert-danger', 'EditFilm')
            });
        }

        connection.query(Queries.Query("UpdateFilm", cmbFilmNameEdit, txtDurationEdit, txtMemoryAddressEdit), (err, result) => {
            if (!err) {

                const connection2 = dbConnection();
                connection2.query(Queries.Query("GetFilmId", cmbFilmNameEdit), (err2, result2) => {

                    let filmID = result2[0].filmId;
                    let todayDate = GetTodayDate();

                    const connection3 = dbConnection();
                    connection3.query(Queries.Query("GetViewedFilm", filmID), (err3, result3) => {
                        let viewedExist = false;
                        if (result3[0].userName !== "") {
                            viewedExist = true;
                        }

                        if (chbxViewedEdit == "1") {
                            if (!viewedExist){
                                const connection4 = dbConnection();
                                connection4.query(Queries.Query("InsertViewed", filmID, LoggedUser, points, todayDate), (err4, result4) => {
                                    if (!err4) {
                                        return res.render(RenderPage, {
                                            Page: GenPage.GeneratePage('Film Modified Successfully', LoggedUser, false, 'alert-success', 'EditFilm')
                                        });
                                    } else {
                                        return res.render(RenderPage, {
                                            Page: GenPage.GeneratePage('Can Not Modify This Film', LoggedUser, false, 'alert-danger', 'EditFilm')
                                        });
                                    }
    
                                });
                            } else {
                                const connection4 = dbConnection();
                                connection4.query(Queries.Query("UpdateViewedFilm", filmID, points), (err4, result4) => {
                                    if (!err4) {  
                                        return res.render(RenderPage, {
                                            Page: GenPage.GeneratePage('Film Modified Successfully', LoggedUser, false, 'alert-success', 'EditFilm')
                                        });
                                    } else {
                                        return res.render(RenderPage, {
                                            Page: GenPage.GeneratePage('Can Not Modify This Film', LoggedUser, false, 'alert-danger', 'EditFilm')
                                        });
                                    }
                                });
                            }

                        } else {
                            if (viewedExist) {
                                const connection4 = dbConnection();
                                connection4.query(Queries.Query("DeleteViewedFilm", filmID), (err4, result4) => {
                                    if (!err4) {
                                        return res.render(RenderPage, {
                                            Page: GenPage.GeneratePage('Film Modified Successfully', LoggedUser, false, 'alert-success', 'EditFilm')
                                        });
                                    } else {
    
                                        return res.render(RenderPage, {
                                            Page: GenPage.GeneratePage('Can Not Modify This Film', LoggedUser, false, 'alert-danger', 'EditFilm')
                                        });
                                    }
    
                                });
                            } else {
                                return res.render(RenderPage, {
                                    Page: GenPage.GeneratePage('Film Modified Successfully', LoggedUser, false, 'alert-success', 'EditFilm')
                                });
                            }
                        }
                    });
                });
            } else {
                return res.render(RenderPage, {
                    Page: GenPage.GeneratePage('Can Not Modify This Film', LoggedUser, false, 'alert-danger', 'EditFilm')
                });
            }

        });
    });

    // #################################### VIEW FILM ####################################
    // GET
    app.get('/ViewFilm', (req, res) => {
        if (LoggedUser === null) {
            res.render("LogIn/LogIn", {
                error: "User not logged"
            });
            return false;
        }

        res.render(RenderPage, {
            Page: GenPage.GeneratePage('', LoggedUser, false, 'alert-init', 'ViewFilm')
        });
    });



    // #################################### UTILITIES ####################################
    app.get('/GetAllFilms', (req, res) => {
        if (LoggedUser === null) {
            return res.render("LogIn/LogIn", {
                error: "User not logged"
            });
            
        }

        let filter = req.query.filter,
            option = req.query.option;
        
        connection.query(Queries.Query("GetFilm", filter, option), (err, result) => {
            return res.json(result);
        });
        
    });

    app.get('/GetAllViewedFilms', (req, res) => {
        if (LoggedUser === null) {
            return res.render("LogIn/LogIn", {
                error: "User not logged"
            });

        }

        let filter = req.query.filter;

        connection.query(Queries.Query("GetViewedFilm", null, filter), (err, result) => {
            return res.json(result);
        });
        
    });

    function GetTodayDate() {
        let todayDate = new Date();
        let dd = todayDate.getDate();
        let mm = todayDate.getMonth() + 1;
        let yyyy = todayDate.getFullYear();

        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }

        todayDate = yyyy + '/' + mm + '/' + dd;

        return todayDate;
    }

}