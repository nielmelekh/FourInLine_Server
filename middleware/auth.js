function authorizeRoles(...allowedRoles) {
    return (req, res, next) => {
        const userRole = req.header("x-user-role");

        try {
            if (!userRole || !allowedRoles.includes(userRole)) {
                res.status(403);
                throw new Error("Forbidden: You do not have permission to perform this action.", { "userRole": userRole });
            }
            next();
        }
        catch (err) {
            next(err);
        }
    };
}

const managementRoles = require("../models/userData").managementRoles
function authorizeUser(req, res, next) {
    const userRole = req.header("x-user-role");
    const userId = req.header("x-user-id");
    const requestedId = Number(req.params.id);
    try {
        if (!userRole || (!managementRoles.includes(userRole) && Number(userId) !== requestedId)) {
            res.status(403);
            throw new Error("Forbidden: You do not have permission to perform this action.", { "userID": userId, "requestedId": requestedId });
        }
        next();
    }
    catch (err) {
        next(err);
    }
}




module.exports = {authorizeRoles, authorizeUser};