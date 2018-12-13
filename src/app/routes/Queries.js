module.exports.Query = function Query(Name, f1 = null, f2 = null, f3 = null, f4 = null, f5 = null, f6 = null) {
    var query = "";

    switch (Name) {
        case "GetUserComplete":
            query = `SELECT * FROM SYSTEMUSER WHERE userName = "${f1}";`;
            break;

        case "GetUserEmail":
            query = `SELECT userEmail FROM SYSTEMUSER WHERE userName = '${f1}';`;
            break;

        case "GetUserEmailEmail":
            query = `SELECT userEmail FROM SYSTEMUSER WHERE userEmail = '${f1}';`;
            break;

        case "UpdateUserPassword":
            query = `UPDATE SYSTEMUSER SET userPassword = '${f1}' WHERE userName = '${f2}';`;
            break;

        case "GetPasswordResetCode":
            query = `SELECT resetCode FROM PASSWORDRESETCODE WHERE userEmail = '${f1}';`;
            break;

        case "InsertPasswordResetCode":
            query = `INSERT INTO PASSWORDRESETCODE (userEmail, resetCode) VALUES ('${f1}', '${f2}');`;
            break;

        case "DeletePasswordResetCode":
            query = `DELETE FROM PASSWORDRESETCODE WHERE userEmail = '${f1}';`;
            break;
        
        case "ResetPassword":
            query = `UPDATE SYSTEMUSER SET userPassword = '${f1}' WHERE userEmail = '${f2}';`;
            break;

        case "InsertFilm":
            query = `INSERT INTO FILM (filmName, filmDuration, memoryAddress) VALUES ('${f1}', '${f2}', '${f3}');`;
            break;
        
        case "GetFilmId":
            query = `SELECT filmId FROM FILM WHERE filmName = '${f1}';`;
            break;

        case "InsertSees":
            query = `INSERT INTO ViewedFilm (filmId, userName, rating, viewDate) VALUES ('${f1}', '${f2}', '${f3}', '${f4}');`;
            break;

        case "GetFilm":
            query = `SELECT FILM.filmName, FILM.filmDuration, FILM.memoryAddress, ViewedFilm.rating, ViewedFilm.viewDate FROM FILM JOIN ViewedFilm ON FILM.filmId = ViewedFilm.filmId`;

            if (f1) {
                query += ` WHERE filmName LIKE '%${f1}%'`;
            }

            break;

        default:
            break;
    }

    return query;
}