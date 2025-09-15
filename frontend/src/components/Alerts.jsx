import React, { useEffect, useState } from "react";
import axios from "axios";
import { connectWs } from "../services/websocket";

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch initial alerts
    axios.get("http://localhost:8000/alerts/")
      .then(r => setAlerts(r.data))
      .catch(err => {
        console.error("Error fetching alerts:", err);
        setError("Failed to load alerts");
        // Set some mock alerts for demo purposes
        setAlerts([
          { id: 1, level: 'high', message: 'Portfolio VaR exceeded limit', value: '2.5%' },
          { id: 2, level: 'medium', message: 'High concentration in tech stocks', value: '45%' },
          { id: 3, level: 'low', message: 'Daily trading volume normal', value: '$1.2M' }
        ]);
      })
      .finally(() => setLoading(false));

    // Connect to WebSocket for real-time alerts
    const ws = connectWs((msg) => {
      if (msg.type === "alert") {
        setAlerts(prev => [msg.data, ...prev].slice(0, 50));
      }
    });

    return () => ws && ws.close();
  }, []);

  const getAlertClass = (level) => {
    switch (level?.toLowerCase()) {
      case 'high': return 'alert-high';
      case 'medium': return 'alert-medium';
      case 'low': return 'alert-low';
      default: return 'alert-low';
    }
  };

  if (loading) {
    return (
      <div>
        <h3>Alerts</h3>
        <div className="loading">Loading alerts...</div>
      </div>
    );
  }

  return (
    <div>
      <h3>Alerts</h3>
      {error && <div className="error">{error}</div>}
      
      {alerts.length === 0 ? (
        <div className="loading">No alerts</div>
      ) : (
        <div className="alert-list">
          {alerts.map(alert => (
            <div key={alert.id} className={`alert-item ${getAlertClass(alert.level)}`}>
              <div><strong>{alert.level?.toUpperCase()}:</strong> {alert.message}</div>
              {alert.value && <div>Value: {alert.value}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
