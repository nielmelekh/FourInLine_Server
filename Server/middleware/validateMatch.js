const { prisma } = require('../prismaClient');

async function validateMatchExists(req, res, next) {
    try {
        const matchId = Number(req.params.id);
        const match = await prisma.match.findUnique({
            where: { matchId: matchId }
        });
        if (!match){
            res.status(404);
            throw new Error("Match not found", { matchId: req.params.id });
        }
    } catch (err) {
        return next(err);
    }
}

function validateMatchBody(req, res, next) {
  try {
    const { player1Id, player2Id, result, startTime, endTime } = req.body;

    if (!player1Id || !player2Id || !result || !startTime || !endTime) {
      res.status(400);
      const err = new Error("Missing some of the required fields: player1Id, player2Id, result, startTime, endTime.");
      err.details = { "missingFields": [] };
      if (!player1Id) err.details.missingFields.push("player1Id");
      if (!player2Id) err.details.missingFields.push("player2Id");
      if (!result) err.details.missingFields.push("result");
      if (!startTime) err.details.missingFields.push("startTime");
      if (!endTime) err.details.missingFields.push("endTime");
      throw err;
    }

    next()
    } catch (err) {
        return next(err);
    }
}

module.exports = {
    validateMatchExists, 
    validateMatchBody
}
