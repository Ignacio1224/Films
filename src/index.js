const app = require("./config/server");

require("./app/routes/films")(app);

// Starting the server

app.listen(app.get('port'), () => {
    console.log(app.get('port'));
});