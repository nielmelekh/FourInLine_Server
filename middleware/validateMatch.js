const {matchData, MatchResult} = require("../models/matchData")
function validateMatchId(req, res, next) {
  try {
    const match = matchData.find((m) => m.matchId === Number(req.params.id))
    if (!match){
      res.status(400)
      throw new Error("Invalid id parameter.")
    }

    next()
  } catch (err) {
    return next(err)
  }
}

function validateMatchBody(req, res, next) {
  try {
    const { player1Id, player2Id, matchResult, matchDate, matchDurationSeconds } = req.body

    if (!player1Id || !player2Id || !matchResult || !matchDate || !matchDurationSeconds) {
      res.status(400)
      throw new Error("Missing some of the required fields: player1Id, player2Id, matchResult, matchDate, matchDurationSeconds.")
    }

    next()
    } catch (err) {
        return next(err)
    }
}

module.exports = {
  validateMatchId,
  validateMatchBody
}
