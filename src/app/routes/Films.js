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
                res.render("LogIn/LogIn", {
                    error: "User or Password Incorrect"
                });
                return false;
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
        res.render('LogIn/LogIn', {
            error: ""
        });
    });


    // #################################### CHANGE PASSWORD ####################################
    // POST
    app.post('/ChangePassword', (req, res) => {
        if (LoggedUser === null) {
            res.render("LogIn/LogIn", {
                error: "User not logged"
            });
            return false;
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
            res.render("LogIn/LogIn", {
                error: "User not logged"
            });
            return false;
        }

        const {
            txtFilmName,
            txtDuration,
            txtMemoryAddress,
            txtPoints,
            chbxViewed
        } = req.body;

        const points = parseInt(txtPoints);

        if (txtFilmName === "" || txtDuration === "" || txtPoints === "" || points === NaN) {
            res.render(RenderPage, {
                Page: GenPage.GeneratePage('Invalid Fields', LoggedUser, false, 'alert-danger', 'AddFilm')
            });
        }

        try {
            connection.query(Queries.Query("InsertFilm", txtFilmName, txtDuration, txtMemoryAddress));
            if (chbxViewed == "1") {
                try {

                    const connection2 = dbConnection();
                    let a = connection2.query(Queries.Query("GetFilmId", txtFilmName), (err1, result1) => {return result1});
                    console.log(a.result)

                    // let filmID = result2[0].filmId;
                    // let todayDate = new Date();
                    // let dd = todayDate.getDate();
                    // let mm = todayDate.getMonth() + 1;
                    // let yyyy = todayDate.getFullYear();

                    // if (dd < 10) {
                    //     dd = '0' + dd;
                    // }
                    // if (mm < 10) {
                    //     mm = '0' + mm;
                    // }

                    // todayDate = yyyy + '/' + mm + '/' + dd;

                    // try {

                    //     const connection3 = dbConnection();
                    //     connection3.query(Queries.Query("InsertViewed", filmID, LoggedUser, points, todayDate));
                    //     console.log("BBBBBBBBB")
                    //     res.render(RenderPage, {
                    //         Page: GenPage.GeneratePage('Film Added Successfully', LoggedUser, false, 'alert-success', 'AddFilm')
                    //     });
                    // } catch (error1) {
                    //     console.log(error1);

                    //     res.render(RenderPage, {
                    //         Page: GenPage.GeneratePage('Can Not Add This Film', LoggedUser, false, 'alert-danger', 'AddFilm')
                    //     });
                    // }

                } catch (error2) {
                    console.log(error2);
                    res.render(RenderPage, {
                        Page: GenPage.GeneratePage('Can Not Add This Film', LoggedUser, false, 'alert-danger', 'AddFilm')
                    });
                }

            } else {
                res.render(RenderPage, {
                    Page: GenPage.GeneratePage('Film Added Successfully', LoggedUser, false, 'alert-success', 'AddFilm')
                });
            }

        } catch (error3) {
            console.log(error3);
            res.render(RenderPage, {
                Page: GenPage.GeneratePage('Can Not Add This Film', LoggedUser, false, 'alert-danger', 'AddFilm')
            });
        }
        // connection.query(Queries.Query("InsertFilm", txtFilmName, txtDuration, txtMemoryAddress), (err, result) => {
        //     if (!err) {

        //         if (chbxViewed == "1") {

        //             const connection2 = dbConnection();
        //             connection2.query(Queries.Query("GetFilmId", txtFilmName), (err2, result2) => {

        //                 let filmID = result2[0].filmId;
        //                 let todayDate = new Date();
        //                 let dd = todayDate.getDate();
        //                 let mm = todayDate.getMonth() + 1;
        //                 let yyyy = todayDate.getFullYear();

        //                 if (dd < 10) {
        //                     dd = '0' + dd;
        //                 }
        //                 if (mm < 10) {
        //                     mm = '0' + mm;
        //                 }

        //                 todayDate = yyyy + '/' + mm + '/' + dd;

        //                 const connection3 = dbConnection();
        //                 connection3.query(Queries.Query("InsertViewed", filmID, LoggedUser, points, todayDate), (err3, result3) => {

        //                     if (!err3) {
        //                         res.render(RenderPage, {
        //                             Page: GenPage.GeneratePage('Film Added Successfully', LoggedUser, false, 'alert-success', 'AddFilm')
        //                         });
        //                     } else {
        //                         res.render(RenderPage, {
        //                             Page: GenPage.GeneratePage('Can Not Add This Film', LoggedUser, false, 'alert-danger', 'AddFilm')
        //                         });
        //                     }
        //                 });
        //             });
        //         } else {
        //             res.render(RenderPage, {
        //                 Page: GenPage.GeneratePage('Film Added Successfully', LoggedUser, false, 'alert-success', 'AddFilm')
        //             });
        //         }
        //     } else {
        //         res.render(RenderPage, {
        //             Page: GenPage.GeneratePage('Can Not Add This Film', LoggedUser, false, 'alert-danger', 'AddFilm')
        //         });
        //     }

        // });

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
            res.render("LogIn/LogIn", {
                error: "User not logged"
            });
            return false;
        }

        const {
            cmbFilmName,
            chbxConfirm
        } = req.body;

        if (cmbFilmName === "" || chbxConfirm != "1") {
            res.render(RenderPage, {
                Page: GenPage.GeneratePage('Invalid Fields', LoggedUser, false, 'alert-danger', 'DeleteFilm')
            });
            return false;
        }

        var deleted = false;
        let filmID;
        let connection3 = dbConnection();

        connection.query(Queries.Query("GetFilmId", cmbFilmName), (err, result) => {
            filmID = result[0].filmId;

            let connection2 = dbConnection();
            try {
                connection2.query(Queries.Query("DeleteViewedFilm", filmID));
                deleted = true;
            } catch (error) {
                deleted = false;
            }
        });

        console.log(deleted);
        try {
            connection3.query(Queries.Query("DeleteFilm", cmbFilmName));
            deleted = true;
        } catch (error) {
            deleted = false;
        }
        console.log(deleted);



        if (deleted) {
            res.render(RenderPage, {
                Page: GenPage.GeneratePage('Film Deleted', LoggedUser, false, 'alert-success', 'DeleteFilm')
            });
        }

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
            Page: {
                userNameLogged: LoggedUser,
                titleTab: "Edit Film",
                sidebarClass: "EditFilm",
                changePassword: false
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
            res.render("LogIn/LogIn", {
                error: "User not logged"
            });
            return false;
        }

        let filter = req.query.filter;

        if (!filter) {
            connection.query(Queries.Query("GetFilm"), (err, result) => {
                res.json(result);
            });
        } else {
            connection.query(Queries.Query("GetFilm", filter), (err, result) => {
                res.json(result);
            });
        }
    });

}