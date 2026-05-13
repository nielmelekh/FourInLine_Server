const MatchResult = Object.freeze({
  Player1Wins: "Player1Wins",
  Player2Wins: "Player2Wins",
  Draw: "Draw"
});

const matchData = [{
  "matchId": 1,
  "player1Id": 1,
  "player2Id": 2,
  "matchResult": MatchResult.Player1Wins,
  "matchDate": new Date("2024-06-01T15:00:00Z"),
  "matchDurationSeconds": 600
},
{
  "matchId": 2,
  "player1Id": 3,
  "player2Id": 4,
  "matchResult": MatchResult.Player2Wins,
  "matchDate": new Date("2024-08-01T17:00:00Z"),
  "matchDurationSeconds": 350
},
{
  "matchId": 3,
  "player1Id": 2,
  "player2Id": 3,
  "matchResult": MatchResult.Draw,
  "matchDate": new Date("2024-04-04T11:00:00Z"),
  "matchDurationSeconds": 220
}]

module.exports = { matchData, MatchResult }