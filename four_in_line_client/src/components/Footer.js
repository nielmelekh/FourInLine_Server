// src/components/Footer.js
import React from 'react';

const Footer = () => {
    return (
    <footer className="footer">
        <p><strong>Four in Line Master</strong></p>
        <p>&copy; {new Date().getFullYear()}</p>
        <p><em>The ultimate disk dropping experience!</em></p>
    </footer>
    );
};

export default Footer;