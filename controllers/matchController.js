const {matchData, MatchResult} = require("../models/matchData")

// GET /matches
function getMatches(req, res, next) {
    res.json({
        success: true,
        data: matchData,
        error: null,
    })
    next()
}

// GET /matches/:id
async function getMatch(req, res, next) {
    try {
        const match = matchData.find((m) => m.matchId === Number(req.params.id))
        if (!match){
            res.status(404)
            throw new Error("Match not found", { matchId: req.params.id })
        } 
        res.json({ success: true, data: match, error: null })
    } catch (err) {
        next(err)
    }
}

// POST /matches  — called after validateCreateMatch middleware
function createMatch(req, res, next) {
    const { player1Id, player2Id, matchResult, matchDate, matchDurationSeconds } = req.body
    const newMatch = { matchId: matchData.length + 1, 
        player1Id: player1Id, player2Id: player2Id, matchResult: matchResult, 
        matchDate: matchDate, matchDurationSeconds: matchDurationSeconds }
    matchData.push(newMatch)
    res.status(201).json({ success: true, data: newMatch.matchId, error: null })
    next()
}


//PUT /matches/:id  — called after validateExistingMatch middleware
function updateMatch(req, res) {
    const matchId = Number(req.params.id)
    const { player1Id, player2Id, matchResult, matchDate, matchDurationSeconds } = req.body
    const matchIndex = matchData.findIndex((m) => m.matchId === matchId)
    if (matchIndex === -1) {
        res.status(404)
        throw new Error("Match not found", { matchId: req.params.id })
    }
    matchData[matchIndex] = { ...matchData[matchIndex], player1Id, player2Id, matchResult, matchDate, matchDurationSeconds }
    res.status(200).json({
        success: true,
        data: matchId,
        error: null
    })
}

// DELETE /matches/:id — called after validateExistingMatch middleware
function deleteMatch(req, res) {
    const matchId = Number(req.params.id)
    const matchIndex = matchData.findIndex((m) => m.matchId === matchId)
    if (matchIndex === -1) {
        res.status(404)
        throw new Error("Match not found", { matchId: req.params.id })
    }
    matchData.splice(matchIndex, 1)
    res.status(200).json({
        success: true,
        data: matchId,
        error: null
    })
}

module.exports = {
  getMatches,
  getMatch,
  createMatch,
  updateMatch,
  deleteMatch
}