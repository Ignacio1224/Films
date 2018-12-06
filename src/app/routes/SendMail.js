module.exports.SendEmail = function SendEmail(dest, subj, textt, html = false) {
    // Nodemailer
    const nodemailer = require('nodemailer');

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'condeplayero@gmail.com',
            pass: 'terror24'
        }
    });

    if (html) {
        var mailOptions = {
            from: 'condeplayero@gmail.com',
            to: dest,
            subject: subj,
            html: textt
        };
    } else {
        var mailOptions = {
            from: 'condeplayero@gmail.com',
            to: dest,
            subject: subj,
            text: textt
        };
    }

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent');
        }
    });
}