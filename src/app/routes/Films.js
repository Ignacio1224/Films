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
                changePassword : false
            }
        });
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
                        sidebarClass: "Home",
                        changePassword : false
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
                changePassword : false
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
            Page: {
                userNameLogged: LoggedUser,
                titleTab: "Delete Film",
                sidebarClass: "DeleteFilm",
                changePassword : false
            }
        });
    });


    // #################################### MODIFY FILM ####################################
    // GET
    app.get('/ModifyFilm', (req, res) => {
        if (LoggedUser === null) {
            res.render("LogIn/LogIn", {
                error: "User not logged"
            });
            return false;
        }

        res.render(RenderPage, {
            Page: {
                userNameLogged: LoggedUser,
                titleTab: "Modify Film",
                sidebarClass: "ModifyFilm",
                changePassword : false
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
                changePassword : false
            }
        });
    });


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
            const query = `UPDATE user SET passwords = "${txtPasswordNew}" WHERE userName = "${LoggedUser}";`;
            connection.query(query, (err, result) => {
                res.render(RenderPage, {
                    Page: {
                        userNameLogged: LoggedUser,
                        titleTab: "Dashboard",
                        sidebarClass: "Home",
                        changePassword : true
                    }
                });
            });
        }
    });

}