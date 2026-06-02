// src/components/Footer.js
import React from 'react';

const Footer = () => {
    return (
        <footer style={{ textAlign: 'center', padding: '20px', background: '#ddd', marginTop: 'auto' }}>
            <p><strong>Four in Line Master</strong></p> {/* Project/team name [cite: 39] */}
            <p>&copy; {new Date().getFullYear()}</p> {/* Year [cite: 39] */}
            <p><em>The ultimate disk dropping experience!<br />Show these losers how it's DONE</em></p> {/* Short project description/slogan [cite: 39] */}
        </footer>
    );
};

export default Footer;