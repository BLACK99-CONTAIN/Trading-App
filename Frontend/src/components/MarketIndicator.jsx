import React from "react";
import "./MarketIndicator.css";

export default function MarketIndicator({ name, value, change }) {
  const isUp = change > 0;
  return (
    <div className="market-indicator">
      <span className="market-name">{name}</span>
      <span className="market-value">{value}</span>
      <span className={isUp ? "market-up" : "market-down"}>
        {change > 0 ? "+" : ""}
        {change}%
      </span>
    </div>
  );
}