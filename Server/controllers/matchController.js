const { prisma } = require("../prismaClient");

// GET /matches
async function getMatches(req, res, next) {
    try {
        const matches = await prisma.match.findMany();
        res.json({
            success: true,
            data: matches,
            error: null,
        });
    } catch (err) {
        next(err);
    }
}

// GET /matches/:id
async function getMatch(req, res, next) {
    try {
        const matchId = Number(req.params.id);
        const match = await prisma.match.findUnique({
            where: { matchId: matchId }
        });

        if (!match){
            res.status(404);
            throw new Error("Match not found", { matchId: req.params.id });
        } 
        res.json({ success: true, data: match, error: null });
    } catch (err) {
        next(err);
    }
}

// POST /matches - called after validateMatchBody middleware
async function createMatch(req, res, next) {
    try {
        const { player1Id, player2Id, result, startTime, endTime } = req.body;

        // Convert frontend payload to database schema requirements
        const startTimeObj = new Date(startTime);
        const endTimeObj = new Date(endTime);

        const newMatch = await prisma.match.create({
            data: {
                player1Id: player1Id,
                player2Id: player2Id,
                result: result,
                startTime: startTimeObj,
                endTime: endTimeObj
            }
        });

        res.status(201).json({ success: true, data: newMatch, error: null });
    } catch (err) {
        next(err);
    }
}


// PUT /matches/:id
async function updateMatch(req, res, next) {
    try {
        const matchId = Number(req.params.id);
        const { player1Id, player2Id, result, startTime, endTime } = req.body;

        // Safely map optional variables for the update
        const startTimeObj = startTime ? new Date(startTime) : undefined;
        const endTimeObj = endTime ? new Date(endTime) : undefined;

        const updatedMatch = await prisma.match.update({
            where: { matchId: matchId },
            data: {
                player1Id: player1Id,
                player2Id: player2Id,
                result: result,
                startTime: startTimeObj,
                endTime: endTimeObj
            }
        });

        if (!updatedMatch){
            res.status(404);
            throw new Error("Match not found", { matchId: req.params.id });
        } 
        res.status(200).json({
            success: true,
            data: updatedMatch,
            error: null
        });
    } catch (err) {
        next(err);
    }
}

// DELETE /matches/:id - called after validateMatchExists middleware
async function deleteMatch(req, res, next) {
    try {
        const matchId = Number(req.params.id);

        // Proceed with deletion if the match exists
        await prisma.match.delete({
            where: { matchId: matchId }
        });

        res.status(200).json({
            success: true,
            data: matchId,
            error: null
        });
    } catch (err) {
        next(err);
    }
}

// GET /matches/user - called after validateMatchExists middleware
async function getUserMatches(req, res, next) {
    try {
        const userId = Number(req.header("x-user-id"));
        
        const userMatches = await prisma.match.findMany({
            where: {
                OR: [
                    { player1Id: userId },
                    { player2Id: userId }
                ],
            },
            include: {
                player1: { select: { username: true } },
                player2: { select: { username: true } }
            }
        });

        // add durationInSeconds to each match object
        const matchesWithDuration = userMatches.map(match => {
            const startTime = new Date(match.startTime);
            const endTime = new Date(match.endTime);
            const durationInSeconds = (endTime - startTime) / 1000;
            return { ...match, durationInSeconds };
        });

        res.json({
            success: true,
            data: matchesWithDuration,
            error: null,
        });
    } catch (err) {
        next(err);
    }
}

module.exports = {
    getMatches,
    getMatch,
    createMatch,
    updateMatch,
    deleteMatch,
    getUserMatches
}