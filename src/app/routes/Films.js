const dbConnection = require('../../config/dbConnection');

const RenderPage = "Base/base";

var LoggedUser = null;

//var usernameLogged;

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


    // #################################### LOGIN ####################################
    // POST
    app.post('/LogIn', (req, res) => {
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
                    titleTab: "AddFilm"
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