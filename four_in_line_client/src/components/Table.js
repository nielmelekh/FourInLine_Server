// src/components/Table.js
import React from 'react';

// Requires mapping over an array of backend data [cite: 56]
// columns format: { property: headerName }
const Table = ({ data, columns }) => {
    if (!data || data.length === 0) return <p>No data to display.</p>;
    const headers = Object.values(columns);

    return (
    <div className="table-wrapper">
        <table>
            <thead>
                <tr>
                    {headers.map((header) => (
                        <th key={header}>
                            {header.toUpperCase()}
                        </th>
                    ))}
                </tr>
            </thead>

            <tbody>
                {/* Renders table rows dynamically from backend data. */}
                {data.map((row, index) => (
                    <tr key={index}>
                        {Object.keys(columns).map((key) => (
                            <td key={key} style={{ textAlign: 'center' }}>
                                {row[key]}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
    );
};

export default Table;