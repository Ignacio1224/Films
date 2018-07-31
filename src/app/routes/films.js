const dbConnection = require('../../config/dbConnection');


module.exports = app => {
    const connection = dbConnection();

    app.get('/', (req, res) => {
        res.render("LogIn/LogIn", {
            error : ""
        });
    });

    app.post('/Films', (req, res) => {
        const {userName, passwords} = req.body;
        const query = `SELECT * FROM user WHERE userName = "${userName}"`;
        
        connection.query(query, (err, result) => {
            if (result[0].userName === userName && result[0].passwords === passwords) {
                res.render("Films/Films"); 
            } else {
                res.render("LogIn/LogIn", {
                    error : "User or Password Incorrect"
                }); 
            }
        });
    });
}