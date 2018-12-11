// Database Connection
const dbConnection = require('../../config/dbConnection');

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

            if (result[0].userName === userName && result[0].passwords === password) {

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
            Page: {
                userNameLogged: LoggedUser,
                titleTab: "Add Film",
                sidebarClass: "AddFilm",
                changePassword: false,
                AddFilm: {
                    filmName: "",
                    duration: "",
                    memoryAddress: "",
                    points: 50,
                    messaje: "",
                    clas: "alert-init"
                }
            }
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
            txtPoints
        } = req.body;

        const points = parseInt(txtPoints);

        if (txtFilmName === "" || txtDuration === "" || txtPoints === "" || points === NaN) {
            res.render(RenderPage, {
                Page: {
                    userNameLogged: LoggedUser,
                    titleTab: "Add Film",
                    sidebarClass: "AddFilm",
                    changePassword: false,
                    AddFilm: {
                        filmName: txtFilmName,
                        duration: txtDuration,
                        memoryAddress: txtMemoryAddress,
                        points: txtPoints,
                        messaje: "Invalid Fields!",
                        clas: "alert-danger"
                    }
                }
            });
        }

        // Modificar con un if si se vio la peli o no y se quiere agregar Decidir
        connection.query(Queries.Query("InsertFilm", txtFilmName, txtDuration, txtMemoryAddress), (err, result) => {

            const connection2 = dbConnection();
            connection2.query(Queries.Query("GetFilmId", txtFilmName), (err2, result2) => {

                let filmID = result2[0].idFilm;
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

                const connection3 = dbConnection();
                connection3.query(Queries.Query("InsertSees", filmID, LoggedUser, todayDate), (err3, result3) => {

                    res.render(RenderPage, {
                        Page: {
                            userNameLogged: LoggedUser,
                            titleTab: "Add Film",
                            sidebarClass: "AddFilm",
                            changePassword: false,
                            AddFilm: {
                                filmName: txtFilmName,
                                duration: txtDuration,
                                memoryAddress: txtMemoryAddress,
                                points: txtPoints,
                                messaje: "Film Added Successfully!",
                                clas: "alert-success"
                            }
                        }
                    });
                });
            });
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
            Page: {
                userNameLogged: LoggedUser,
                titleTab: "Delete Film",
                sidebarClass: "DeleteFilm",
                changePassword: false
            }
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
            Page: {
                userNameLogged: LoggedUser,
                titleTab: "View Film",
                sidebarClass: "ViewFilm",
                changePassword: false
            }
        });
    });

}