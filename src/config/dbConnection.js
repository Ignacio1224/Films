const mysql = require('mysql');

module.exports = () => {
    return mysql.createConnection({
        host : 'localhost',
        user : 'NANO',
        password : '//122418',
        database : 'FilmsDB'
    });
}