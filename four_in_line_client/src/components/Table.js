// src/components/Table.js
import React from 'react';

// Requires mapping over an array of backend data [cite: 56]
// columns format: { property: headerName }
const Table = ({ data, columns }) => {
    if (!data || data.length === 0) return <p>No data to display.</p>;
    const headers = Object.values(columns);

    return (
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
                <tr style={{ background: '#f4f4f4' }}>
                    {headers.map((header) => (
                        <th key={header} style={{ padding: '8px', borderBottom: '2px solid #ccc' }}>
                            {header.toUpperCase()}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {/* Dynamically map over array [cite: 56] */}
                {data.map((row, index) => (
                    <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                        {Object.keys(columns).map((key) => (
                            <td key={key} style={{ padding: '8px' }}>
                                {row[key]}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default Table;