// ForgotPassword

const dbConnection = require('../../config/dbConnection');

const ForgotPass = "ForgotPassword/emailform";
const ForgotPassDone = "ForgotPassword/done";


module.exports = app => {
    const connection = dbConnection();

    
    // GET
    app.get('/ForgotPassword', (req, res) => {
        res.render(ForgotPass, {
            error : ""
        });
    });

    // POST
    app.post('/ForgotPassword', (req, res) => {
        const {
            txtUserEmailReset
        } = req.body;

        let emailDomain = txtUserEmailReset.split('@')[1];

        const query = `SELECT userEmail FROM user WHERE userEmail = "${txtUserEmailReset}"`;

        connection.query(query, (err, result) => {
            console.log(result[0]);
            if (result[0] !== undefined && result[0] !== null && result[0] !== "") {
                res.render(ForgotPassDone, {
                    email : txtUserEmailReset,
                    emailDomain 
                });

            } else {
                res.render(ForgotPass, {
                    error: "This email does not exists!"
                });
            }
        });
    });
}