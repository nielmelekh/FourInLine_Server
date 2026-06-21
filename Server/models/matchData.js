const MatchResult = Object.freeze({
  Player1Wins: "Player1Wins",
  Player2Wins: "Player2Wins",
  Draw: "Draw"
});

const matchData = [{
  "matchId": 1,
  "player1Id": 1,
  "player1Username": "DanSmith",
  "player2Id": 2,
  "player2Username": "MayaJohnson",
  "matchResult": MatchResult.Player1Wins,
  "matchDate": new Date("2024-06-01T15:00:00Z"),
  "durationInSeconds": 600
},
{
  "matchId": 2,
  "player1Id": 3,
  "player1Username": "NoaWilliams",
  "player2Id": 4,
  "player2Username": "EliBrown",
  "matchResult": MatchResult.Player2Wins,
  "matchDate": new Date("2024-08-01T17:00:00Z"),
  "durationInSeconds": 350
},
{
  "matchId": 3,
  "player1Id": 2,
  "player1Username": "MayaJohnson",
  "player2Id": 3,
  "player2Username": "NoaWilliams",
  "matchResult": MatchResult.Draw,
  "matchDate": new Date("2024-04-04T11:00:00Z"),
  "durationInSeconds": 220
},
{
  "matchId": 4,
  "player1Id": 4,
  "player1Username": "EliBrown",
  "player2Id": 1,
  "player2Username": "DanSmith",
  "matchResult": MatchResult.Player1Wins,
  "matchDate": new Date("2025-06-08T19:00:00Z"),
  "durationInSeconds": 100
},
{
  "matchId": 5,
  "player1Id": 1,
  "player2Id": 5,
  "player1Username": "DanSmith",
  "player2Username": "AlexDavis",
  "matchResult": MatchResult.Player1Wins,
  "matchDate": new Date("2024-03-01T16:00:00Z"),
  "durationInSeconds": 1200
},
{
  "matchId": 6,
  "player1Id": 3,
  "player1Username": "NoaWilliams",
  "player2Id": 1,
  "player2Username": "DanSmith",
  "matchResult": MatchResult.Draw,
  "matchDate": new Date("2023-08-11T11:00:00Z"),
  "durationInSeconds": 550
}]

module.exports = { matchData, MatchResult }