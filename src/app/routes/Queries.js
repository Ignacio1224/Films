module.exports.Query = function Query(Name, user = null, newPassword = null, email = null, code = null) {
    var query = "";
    switch (Name) {
        case "GetUserComplete":
            query = `SELECT * FROM user WHERE userName = "${user}";`;
            break;

        case "GetUserEmail":
            query = `SELECT userEmail FROM user WHERE userName = '${user}';`;
            break;

        case "GetUserEmailEmail":
            query = `SELECT userEmail FROM user WHERE userEmail = '${email}';`;
            break;

        case "UpdateUserPassword":
            query = `UPDATE user SET passwords = '${newPassword}' WHERE userName = '${user}';`;
            break;

        case "GetPasswordResetCode":
            query = `SELECT resetCode FROM passwordResetCode WHERE userEmail = '${email}';`;
            break;

        default:
            break;
    }
    return query;
}