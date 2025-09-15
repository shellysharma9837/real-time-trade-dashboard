import React, { useState } from "react";
import axios from "axios";

export default function AuthForm({ onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const endpoint = isLogin ? "/users/login" : "/users/signup";
      const response = await axios.post(`http://localhost:8000${endpoint}`, formData);
      
      setMessage(`✅ ${isLogin ? 'Login' : 'Signup'} successful!`);
      
      // Store auth info
      localStorage.setItem('username', formData.username);
      localStorage.setItem('token', response.data.access_token || 'fake-token');
      
      // Notify parent component
      onAuthSuccess(formData.username);
      
      // Clear form
      setFormData({ username: "", password: "" });
      
    } catch (error) {
      console.error("Auth error:", error);
      setMessage(`❌ ${isLogin ? 'Login' : 'Signup'} failed. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{isLogin ? "Login" : "Sign Up"}</h2>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>

          <button 
            type="submit" 
            className="auth-button"
            disabled={loading || !formData.username || !formData.password}
          >
            {loading ? "Processing..." : (isLogin ? "Login" : "Sign Up")}
          </button>

          {message && (
            <div className={`auth-message ${message.includes('✅') ? 'success' : 'error'}`}>
              {message}
            </div>
          )}
        </form>

        <div className="auth-switch">
          <p>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button 
              type="button" 
              className="switch-button"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Sign Up" : "Login"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
