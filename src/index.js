const app = require("./config/server");

// Films
require("./app/routes/Films.js")(app);

// Forgot Password
require("./app/routes/ForgotPassword.js")(app);


// Starting the server

app.listen(app.get('port'), () => {
    console.log(app.get('port'));
});