// src/components/Card.js
import React from 'react';

// Reusable component receiving data using props [cite: 50, 51]
const Card = ({ title, player1, player2, result, children }) => {
    return (
    <div className="game-card">
        <h3>{title}</h3>

        {/* Displays the two players involved in the match. */}
        <h5 className="card-versus">{player1} vs {player2}</h5>

        {/* Applies a visual style according to the match result. */}
        <h4 className={
            result === 'Victory' ? 'result-victory' :
            result === 'Defeat' ? 'result-defeat' :
            'result-draw'
        }>
            {result}
        </h4>

        <div>{children}</div>
    </div>
    );
};

export default Card;