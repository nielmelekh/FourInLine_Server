const { GoogleGenAI } = require('@google/genai');
require('dotenv/config');

const ai = new GoogleGenAI({});
/**
 * Analyzes a completed Connect Four match.
 * @param {number[]} moveHistory - Array of column drops, e.g., [3, 4, 3, 4, 3, 4, 3]
 * @param {boolean} isDraw - Whether the match ended in a tie
 * @param {boolean|null} winnerIsPlayer1 - True if the first player won, false if the second player won. Null if draw.
 * @returns {Promise<Object>} The structured JSON analysis.
 */
async function analyzeMatch(moveHistory, isDraw = false, winnerIsPlayer1 = null) {
  let outcomeContext = "The game ended in a draw. No one won.";
  
  if (!isDraw) {
    outcomeContext = winnerIsPlayer1 
      ? "Player 1 (who made the first move and all even-indexed moves) won the game."
      : "Player 2 (who made the second move and all odd-indexed moves) won the game.";
  }

  const prompt = `
    You are an expert Connect Four AI Coach. Analyze this match.
    The players drop pieces into a 7x6 grid. 
    The moves array represents the column index (0-6) chosen each turn.
    Moves: ${JSON.stringify(moveHistory)}
    Outcome: ${outcomeContext}
    
    Think step-by-step about the board state. 
    If someone won, identify the critical mistake made by the losing player. 
    If it was a draw, identify where a player missed a potential win or made a highly questionable move.
  `;

  const response = await ai.models.generateContent({
    model: process.env.GEMINI_MODEL,
    contents: prompt,
    config: {
      // Force Gemini to output raw JSON matching this exact structure
      responseMimeType: "application/json",
      responseSchema: {
        type: "OBJECT",
        properties: {
          board_analysis: { 
            type: "STRING", 
            description: "A brief internal thought process of how the board looks at the end." 
          },
          winner_praise: { 
            type: "STRING", 
            description: "A one-sentence compliment to the winner (or to Player 1 if it was a draw)." 
          },
          loser_tip: { 
            type: "STRING", 
            description: "A one-sentence coaching tip for the loser (or to Player 2 if it was a draw)." 
          }
        },
        required: ["board_analysis", "winner_praise", "loser_tip"]
      }
    }
  });

  // Since responseMimeType is application/json, we can safely parse it
  return JSON.parse(response.text);
}

module.exports = { analyzeMatch };