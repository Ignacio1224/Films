const dbConnection = require('../../config/dbConnection');

// MainPage
const RenderPage = "Base/base";



// Logued User
var LoggedUser = null;

module.exports = app => {
    const connection = dbConnection();

    // #################################### START ####################################
    app.get('/', (req, res) => {
        res.render("LogIn/LogIn", {
            error: ""
        });
    });

    app.get('/LogIn', (req,res) => {
        res.render("LogIn/LogIn", {
            error:""
        });
    });


    // #################################### LOGIN FROM ####################################
    // GET
    app.get('/Films', (req, res) => {
        if (LoggedUser != null) {
            res.render(RenderPage, {
                Page: {
                    userNameLogged: LoggedUser,
                    titleTab: "Dashboard",
                    sidebarClass : "Home"
                }
            });

        } else {
            res.render("LogIn/LogIn", {
                error: "User not logged"
            });
        }
    });

    // POST
    app.post('/Films', (req, res) => {
        const {
            userName,
            password
        } = req.body;
        const query = `SELECT * FROM user WHERE userName = "${userName}"`;

        connection.query(query, (err, result) => {
            if (result[0].userName === userName && result[0].passwords === password) {
                res.render(RenderPage, {
                    Page: {
                        userNameLogged: result[0].userName,
                        titleTab: "Dashboard",
                        sidebarClass : "Home"
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


    // #################################### ADD FILM ####################################
    // GET
    app.get('/AddFilm', (req, res) => {
        if (LoggedUser != null) {
            res.render(RenderPage, {
                Page: {
                    userNameLogged: LoggedUser,
                    titleTab: "Add Film",
                    sidebarClass : "AddFilm"
                }
            });

        } else {
            res.render("LogIn/LogIn", {
                error: "User not logged"
            });
        }
    });
    

    // #################################### DELETE FILM ####################################
    // GET
    app.get('/DeleteFilm', (req, res) => {
        if (LoggedUser != null) {
            res.render(RenderPage, {
                Page: {
                    userNameLogged: LoggedUser,
                    titleTab: "Delete Film",
                    sidebarClass : "DeleteFilm"
                }
            });

        } else {
            res.render("LogIn/LogIn", {
                error: "User not logged"
            });
        }
    });


    // #################################### MODIFY FILM ####################################
    // GET
    app.get('/ModifyFilm', (req, res) => {
        if (LoggedUser != null) {
            res.render(RenderPage, {
                Page: {
                    userNameLogged: LoggedUser,
                    titleTab: "Modify Film",
                    sidebarClass : "ModifyFilm"
                }
            });

        } else {
            res.render("LogIn/LogIn", {
                error: "User not logged"
            });
        }
    });


    // #################################### VIEW FILM ####################################
    // GET
    app.get('/ViewFilm', (req, res) => {
        if (LoggedUser != null) {
            res.render(RenderPage, {
                Page: {
                    userNameLogged: LoggedUser,
                    titleTab: "View Film",
                    sidebarClass : "ViewFilm"
                }
            });

        } else {
            res.render("LogIn/LogIn", {
                error: "User not logged"
            });
        }
    });


    // app.post('/changePassword', (req, res) => {
    //     const {
    //         newPassword,
    //         verifiedPassword
    //     } = req.body;

    //     if (newPassword.length >= 8 && (newPassword === verifiedPassword)) {
    //         const query = `UPDATE user SET passwords = "${newPassword}" WHERE userName = "${usernameLogged}"`
    //         connection.query(query, (err, result) => {
    //             res.render("Films/Films", {
    //                 userNameLogged: usernameLogged
    //             });
    //         });
    //     }
    // });

}