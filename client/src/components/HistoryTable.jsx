import React from 'react';

export default function HistoryTable({ history }) {
  if (!history || history.length === 0) {
    return <p>No analysis history found.</p>;
  }

  return (
    <div className="history-table-container">
      <h3>Analysis History</h3>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Text (Preview)</th>
            <th>Result</th>
          </tr>
        </thead>
        <tbody>
          {history.map((item, index) => (
            <tr key={index}>
              <td>{new Date(item.createdAt).toLocaleDateString()}</td>
              <td>{item.text.substring(0, 30)}...</td>
              <td>{item.result}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}