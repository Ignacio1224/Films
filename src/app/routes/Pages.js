module.exports.GeneratePage = function GeneratePage(Name, LoggedUser, changePassword, clas, Type = null) {

    let Page = PageAddFilm(LoggedUser, changePassword, Type);

    switch (Type) {
        case "AddFilm":
            Page["AddFilm"] = {
                messaje: Name + '!',
                clas: clas
            };
            break;

        case "ViewFilm":
            Page["ViewFilm"] = {
                messaje: Name + '!',
                clas: clas
            };
            break;

        default:
            break;
    }

    return Page;
}

function PageAddFilm(LoggedUser, changePassword, Type) {

    let Page = {
        userNameLogged: LoggedUser,
        changePassword: changePassword,
        sidebarClass: Type
    };

    switch (Type) {
        case "AddFilm":
            Page["titleTab"] = "Add Film";
            break;

        case "ViewFilm":
            Page["titleTab"] = "View Film";
            break;

        default:
            break;
    }

    return Page;
}