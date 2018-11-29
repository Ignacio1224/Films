const dbConnection = require('../../config/dbConnection');

let usernameLogged;
let nametab = "Dashboard";

module.exports = app => {
    const connection = dbConnection();

    app.get('/', (req, res) => {
        res.render("LogIn/LogIn", {
            error : ""
        });
    });

    app.post('/changePassword', (req, res) => {
        const {newPassword, verifiedPassword} = req.body;
        
        if (newPassword.length >= 8 && (newPassword === verifiedPassword)) {
            const query = `UPDATE user SET passwords = "${newPassword}" WHERE userName = "${usernameLogged}"`
            connection.query(query, (err, result) => {
                res.render("Films/Films", {
                    userNameLogged : usernameLogged
                });
            });
        }
    });

    app.post('/Films', (req, res) => {
        const {userName, passwords} = req.body;
        const query = `SELECT * FROM user WHERE userName = "${userName}"`;
        
        connection.query(query, (err, result) => {
            if (result[0].userName === userName && result[0].passwords === passwords) {
                res.render("Films/Films", {
                    userNameLogged : result[0].userName,
                    titleTab : "Dashboard"
                });
            } else {
                res.render("LogIn/LogIn", {
                    error : "User or Password Incorrect"
                }); 
            }
        });
    });
}