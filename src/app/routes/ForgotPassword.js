// ForgotPassword

// Database Connection
const dbConnection = require('../../config/dbConnection');

// Queries
const Queries = require('./Queries');

// Send Email
const Email = require('./SendMail');

const ForgotPass = "ForgotPassword/emailform";
const ForgotPassDone = "ForgotPassword/done";
const ForgotPassCode = "ForgotPassword/code";
const ForgotPassForm = "ForgotPassword/passform"


module.exports = app => {
    const connection = dbConnection();


    // GET
    app.get('/ForgotPassword', (req, res) => {
        res.render(ForgotPass, {
            error: ""
        });
    });

    // POST
    app.post('/ForgotPassword', (req, res) => {
        const {
            txtUserEmailReset
        } = req.body;

        let emailDomain = txtUserEmailReset.split('@')[1];

        connection.query(Queries.Query("GetUserEmailEmail", null, null, txtUserEmailReset), (err, result) => {

            if (result[0] !== undefined && result[0] !== null && result[0] !== "") {
                // Generate a code
                let code = Math.floor((Math.random() * 1000) + 1);

                // Add the code to database
                const connection2 = dbConnection();
                connection2.query(Queries.Query("InsertPasswordResetCode", null, null, txtUserEmailReset, code));

                // Send Email
                const urlChP = "/PasswordResetFormCode"
                const fullUrl = req.protocol + '://' + req.get('host') + urlChP;
                const subject = "FILMS SYSTEM | Reset Password";
                const text = `Insert this code: ${code} <a href="${fullUrl}">here!</a>`;
                Email.SendEmail(txtUserEmailReset, subject, text, true);

                res.render(ForgotPassDone, {
                    email: txtUserEmailReset,
                    emailDomain
                });

            } else {
                res.render(ForgotPass, {
                    error: "This email does not exists!"
                });
            }
        });
    });

    // GET
    app.get('/PasswordResetFormCode', (req, res) => {
        res.render(ForgotPassCode, {
            error: ""
        });
    });

    // POST
    app.post('/PasswordResetFormCode', (req, res) => {
        const {
            txtUserEmailReset,
            txtCode
        } = req.body;

        connection.query(Queries.Query("GetPasswordResetCode", null, null, txtUserEmailReset, txtCode), (err, result) => {
            if (result.length === 0) {
                res.render(ForgotPassCode, {
                    error: "Invalid Email!."
                });
                return false;
            }

            if (result[0].resetCode == txtCode) {
                // Delete the code from database
                const connection2 = dbConnection();
                connection2.query(Queries.Query("DeletePasswordResetCode", null, null, txtUserEmailReset, null));

                res.render(ForgotPassForm, {
                    error: "Init0",
                    valid: "Init0",
                    email: txtUserEmailReset
                });

            } else {
                // Delete the code from database
                const connection2 = dbConnection();
                connection2.query(Queries.Query("DeletePasswordResetCode", null, null, txtUserEmailReset, null));

                res.render(ForgotPassCode, {
                    error: 'Invalid Code! Send a request for a '
                });

                return false;
            }
        });

    });

    //POST
    app.post('/ChangePasswordReset', (req, res) => {
        const {
            txtPasswordNew,
            txtPasswordNewVerify,
            txtUserEmailReset
        } = req.body;

        if (txtPasswordNew != txtPasswordNewVerify || txtPasswordNew.length < 8) {
            res.render(ForgotPassForm, {
                error: "Invalid passwords!",
                valid: "Init0",
                email: txtUserEmailReset

            });

            return false;
        }

        const connection = dbConnection();
        connection.query(Queries.Query("ResetPassword", null, txtPasswordNew, txtUserEmailReset));

        // Send Email
        const subject = "FILMS SYSTEM | Password Changed!";
        const text = "Your password has been changed correctly.";
        Email.SendEmail(result2[0].userEmail, subject, text);

        res.render(ForgotPassForm, {
            error: "Init0",
            valid: "Password Changed Successfully!",
            email: txtUserEmailReset
        });

    });
}