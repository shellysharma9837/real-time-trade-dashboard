import React, { useState, useEffect } from "react";
import TradeFeed from "./components/TradeFeed";
import Alerts from "./components/Alerts";

import TradeForm from "./components/TradeForm";
import AuthForm from "./components/AuthForm";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    // Check if user is already logged in
    const savedUsername = localStorage.getItem('username');
    if (savedUsername) {
      setUsername(savedUsername);
      setIsAuthenticated(true);
    }
  }, []);

  const handleAuthSuccess = (user) => {
    setUsername(user);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('token');
    setUsername("");
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <AuthForm onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div>
      <div className="user-info">
        <div className="welcome">Welcome, {username}!</div>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
      
      <div className="dashboard">
        <div className="card">
          <TradeForm />
        </div>
        <div className="card trade-feed">
          <TradeFeed />
        </div>
        <div className="card">
          <Alerts />
        </div>
      </div>
    </div>
  );
}
