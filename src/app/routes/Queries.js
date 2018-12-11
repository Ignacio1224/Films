module.exports.Query = function Query(Name, f1 = null, f2 = null, f3 = null, f4 = null, f5 = null, f6 = null) {
    var query = "";
    switch (Name) {
        case "GetUserComplete":
            query = `SELECT * FROM user WHERE userName = "${f1}";`;
            break;

        case "GetUserEmail":
            query = `SELECT userEmail FROM user WHERE userName = '${f1}';`;
            break;

        case "GetUserEmailEmail":
            query = `SELECT userEmail FROM user WHERE userEmail = '${f1}';`;
            break;

        case "UpdateUserPassword":
            query = `UPDATE user SET passwords = '${f1}' WHERE userName = '${f2}';`;
            break;

        case "GetPasswordResetCode":
            query = `SELECT resetCode FROM passwordResetCode WHERE userEmail = '${f1}';`;
            break;

        case "InsertPasswordResetCode":
            query = `INSERT INTO passwordResetCode (userEmail, resetCode) VALUES ('${f1}', '${f2}');`;
            break;

        case "DeletePasswordResetCode":
            query = `DELETE FROM passwordResetCode WHERE userEmail = '${f1}';`;
            break;
        
        case "ResetPassword":
            query = `UPDATE user SET passwords = '${f1}' WHERE userEmail = '${f2}';`;
            break;

        // REVISARRRR
        case "InsertFilm":
            query = `INSERT INTO film (filmName, filmDuration, memoryAddress) VALUES ('${f1}', '${f2}', '${f3}');`;
        break;
        
        case "GetFilmId":
            query = `SELECT idFilm FROM film WHERE filmName = '${f1}';`;
            break;

        case "InsertSees":
            query = `INSERT INTO sees (idFilm, userName, viewDate) VALUES ('${f1}','${f2}','${f3}');`;
            break;

        default:
            break;
    }
    return query;
}