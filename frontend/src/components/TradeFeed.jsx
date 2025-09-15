import React, { useEffect, useState } from "react";
import { fetchTrades } from "../services/api";
import { connectWs } from "../services/websocket";

export default function TradeFeed() {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');

  useEffect(() => {
    // Fetch initial trades
    fetchTrades()
      .then(setTrades)
      .catch(err => {
        console.error("Error fetching trades:", err);
        setError("Failed to load trades");
      })
      .finally(() => setLoading(false));

    // Connect to WebSocket
    const ws = connectWs(
      (msg) => {
        if (msg.type === "trade") {
          setTrades(prev => [msg.data, ...prev].slice(0, 50));
        }
      },
      (status) => setConnectionStatus(status)
    );

    return () => ws && ws.close();
  }, []);

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    try {
      return new Date(timestamp).toLocaleTimeString();
    } catch {
      return timestamp;
    }
  };

  if (loading) {
    return (
      <div>
        <h2>Live Trades</h2>
        <div className="loading">Loading trades...</div>
      </div>
    );
  }

  return (
    <div>
      <h2>Live Trades</h2>
      <div className={`connection-status connection-${connectionStatus}`}>
        {connectionStatus === 'connected' ? '🟢 Connected' : '🔴 Disconnected'}
      </div>
      
      {error && <div className="error">{error}</div>}
      
      {trades.length === 0 ? (
        <div className="loading">No trades available</div>
      ) : (
        <div className="trade-list">
          {trades.map((trade, index) => (
            <div key={trade.id || index} className="trade-item">
              <div className="trade-info">
                <div className="trade-asset">{trade.asset || 'Unknown'}</div>
                <div className="trade-details">
                  Qty: {trade.quantity || 'N/A'} | Time: {formatTimestamp(trade.timestamp)}
                </div>
              </div>
              <div className="trade-price">
                ${trade.price || 'N/A'}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
