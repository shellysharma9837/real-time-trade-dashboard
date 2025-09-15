import React, { useState } from "react";
import axios from "axios";

export default function TradeForm() {
  const [formData, setFormData] = useState({
    asset: "",
    quantity: "",
    price: "",
    user_id: 1 // Default user ID
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
      const response = await axios.post("http://localhost:8000/trades/", {
        asset: formData.asset.toUpperCase(),
        quantity: parseFloat(formData.quantity),
        price: parseFloat(formData.price),
        user_id: formData.user_id
      });

      setMessage("✅ Trade submitted successfully!");
      setFormData({
        asset: "",
        quantity: "",
        price: "",
        user_id: 1
      });

      // Clear success message after 3 seconds
      setTimeout(() => setMessage(""), 3000);

    } catch (error) {
      console.error("Error submitting trade:", error);
      setMessage("❌ Failed to submit trade. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = formData.asset && formData.quantity && formData.price;

  return (
    <div>
      <h3>Submit New Trade</h3>
      
      <form onSubmit={handleSubmit} className="trade-form">
        <div className="form-group">
          <label htmlFor="asset">Asset Symbol:</label>
          <input
            type="text"
            id="asset"
            name="asset"
            value={formData.asset}
            onChange={handleChange}
            placeholder="e.g., AAPL, GOOGL, MSFT"
            required
            maxLength={10}
          />
        </div>

        <div className="form-group">
          <label htmlFor="quantity">Quantity:</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            placeholder="e.g., 100"
            required
            min="0.01"
            step="0.01"
          />
        </div>

        <div className="form-group">
          <label htmlFor="price">Price per Share:</label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="e.g., 150.25"
            required
            min="0.01"
            step="0.01"
          />
        </div>

        <div className="form-group">
          <label htmlFor="user_id">User ID:</label>
          <input
            type="number"
            id="user_id"
            name="user_id"
            value={formData.user_id}
            onChange={handleChange}
            required
            min="1"
          />
        </div>

        <button 
          type="submit" 
          className="submit-button"
          disabled={!isFormValid || loading}
        >
          {loading ? "Submitting..." : "Submit Trade"}
        </button>

        {message && (
          <div className={`form-message ${message.includes('✅') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}
      </form>

      <div className="form-info">
        <p><strong>Total Value:</strong> ${formData.quantity && formData.price ? (parseFloat(formData.quantity) * parseFloat(formData.price)).toFixed(2) : "0.00"}</p>
      </div>
    </div>
  );
}
