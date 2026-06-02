// src/components/Card.js
import React from 'react';

// Reusable component receiving data using props [cite: 50, 51]
const Card = ({ title, player1, player2, result, children }) => {
    return (
        <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '15px', width: '200px', boxShadow: '2px 2px 5px rgba(0,0,0,0.1)' }}>
            <h3 style={{ margin: '0 0 5px 0', display: 'flex', alignItems: 'center', justifyContent: 'center' }
                }>{title}</h3>
            <h5 style={{ margin: '0 0 10px 0', color: 'blue', display: 'flex', alignItems: 'center', justifyContent: 'center' }
                }>{player1} vs {player2}</h5>
            <h4 style={{ margin: '0 0 10px 0', color: result === 'Victory' ? 'darkgoldenrod' : 'darkred', display: 'flex', alignItems: 'center', justifyContent: 'center' }
                }>{result}</h4>
            <div>{children}</div>
        </div>
    );
};

export default Card;