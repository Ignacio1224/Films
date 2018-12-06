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
                // CODE TASK: GENERATE A CODE, SEND IN EMAIL, ADD THIS CODE TO DATABASE

                // Send Email
                const urlChP = "/PasswordResetFormCode"
                const fullUrl = req.protocol + '://' + req.get('host') + urlChP;
                const subject = "FILMS SYSTEM | Reset Password";
                const text = `<a href="${fullUrl}">Change Password</a>`;
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
                res.render(ForgotPassForm);
            } else {
                // CODE TASK: DELETE CODE OF THIS EMAIL
                
                res.render(ForgotPassCode, {
                    error: "Invalid Code! Send a request for a new one."
                });
                return false;
            }
        });

    });
}