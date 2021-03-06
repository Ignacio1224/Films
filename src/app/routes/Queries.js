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

        case "InsertViewed":
            query = `INSERT INTO ViewedFilm (filmId, userName, rating, viewDate) VALUES ('${f1}', '${f2}', '${f3}', '${f4}');`;
            break;

        case "GetViewedFilm":
            if (f1 != null) {
                query = `SELECT userName FROM ViewedFilm WHERE filmId = '${f1}';`;
            } else {
                query = 'SELECT * FROM ViewedFilm';
            }

            if (f2) {
                query += ` WHERE filmId = '${f2}';`
            } else {
                query += ';';
            }
            break;

        case "UpdateViewedFilm":
            query = `UPDATE ViewedFilm SET rating = '${f2}' WHERE filmId = '${f1}';`;
            break;

        case "GetFilm":
            if (f2 === "7896541236") {
                query = `SELECT * FROM FILM`;
            } else {
                query = `SELECT FILM.*, ViewedFilm.rating, ViewedFilm.viewDate FROM FILM JOIN ViewedFilm ON FILM.filmId = ViewedFilm.filmId`;
            }

            if (f1) {
                query += ` WHERE filmName LIKE '%${f1}%';`;
            } else {
                query += ';';
            }

            break;

        case "DeleteViewedFilm":
            query = `DELETE FROM ViewedFilm WHERE filmId = '${f1}';`;
            break;

        case "DeleteFilm":
            query = `DELETE FROM FILM WHERE filmId = '${f1}';`;
            break;

        case "UpdateFilm":
            query = `UPDATE FILM SET filmDuration = '${f2}', memoryAddress = '${f3}' WHERE filmName = '${f1}';`;
            break;

        default:
            break;
    }

    return query;
}