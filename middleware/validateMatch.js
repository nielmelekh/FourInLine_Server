const {matchData, MatchResult} = require("../models/matchData")
function validateMatchId(req, res, next) {
  try {
    const match = matchData.find((m) => m.matchId === Number(req.params.id))
    if (!match){
      res.status(400)
      const err = new Error("Invalid id parameter.")
      err.details = { "matchId": req.params.id }
      throw err
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
      const err = new Error("Missing some of the required fields: player1Id, player2Id, matchResult, matchDate, matchDurationSeconds.")
      err.details = { "missingFields": [] }
      if (!player1Id) err.details.missingFields.push("player1Id")
      if (!player2Id) err.details.missingFields.push("player2Id")
      if (!matchResult) err.details.missingFields.push("matchResult")
      if (!matchDate) err.details.missingFields.push("matchDate")
      if (!matchDurationSeconds) err.details.missingFields.push("matchDurationSeconds")
      throw err
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
