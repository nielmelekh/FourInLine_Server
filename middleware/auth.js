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
    const userRole = String(req.header("x-user-role"));
    const userId = Number(req.header("x-user-id"));
    const requestedId = Number(req.params.id);
    try {
        console.log("authorizeUser middleware: userRole =", userRole, ", userId =", userId, ", requestedId =", requestedId);
        console.log("Management roles:", managementRoles);
        console.log("Is userRole in managementRoles?", managementRoles.includes(userRole));
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

const {matchData} = require("../models/matchData")
function isUserInvolvedInMatch(userId, matchId) {
    const match = matchData.find((m) => m.matchId === matchId);
    return match && (match.player1Id === userId || match.player2Id === userId);
}
function authorizeMatchAccess(req, res, next) {
    const userRole = String(req.header("x-user-role"));
    const userId = Number(req.header("x-user-id"));
    const matchId = Number(req.params.id);

    try {
        if (!userRole || (!managementRoles.includes(userRole) && !isUserInvolvedInMatch(userId, matchId))) {
            res.status(403);
            throw new Error("Forbidden: You do not have permission to access this match.", { "userID": userId, "matchId": matchId });
        }
        next();
    } catch (err) {
        next(err);
    }
}



module.exports = {authorizeRoles, authorizeUser, authorizeMatchAccess};