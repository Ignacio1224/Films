const dbConnection = require('../../config/dbConnection');


module.exports = app => {
    const connection = dbConnection();

    app.get('/', (req, res) => {

        connection.query('SELECT userName FROM user', (err, result) => {
            res.render("films/films", {
                user : result
            }); 
        });
    });

    app.post('/films', (req, res) => {
        const {user, passs} = req.body;

        const query = `SELECT * FROM user where userName = ${user}`;
        connection.query(`SELECT * FROM user where userName = ${user}`, (err, result) => {
            res.send(err); 
        });
    });
}