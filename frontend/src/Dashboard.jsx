import React from "react";
import TradeFeed from "../components/TradeFeed";
import Alerts from "../components/Alerts";

export default function Dashboard() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
      <div>
        <TradeFeed />
      </div>
      <div>
        <Alerts />
      </div>
    </div>
  );
}
