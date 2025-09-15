# backend/app/analytics/risk_engine.py
"""
Very small risk engine:
- flag anomaly if quantity * price > threshold
- compute a simple historical rolling VaR would require history; here we show a stub that could be replaced.
"""
def analyze_trade(trade_payload: dict):
    alerts = []
    notional = trade_payload.get("quantity", 0) * trade_payload.get("price", 0)
    # simple anomaly threshold
    THRESHOLD = 100000.0
    if notional > THRESHOLD:
        alerts.append({
            "trade_id": int(trade_payload.get("id", 0)),
            "level": "HIGH",
            "message": f"Large notional trade detected: {notional}",
            "value": notional
        })
    # placeholder: compute VaR or exposure here and append alerts if needed
    return alerts
