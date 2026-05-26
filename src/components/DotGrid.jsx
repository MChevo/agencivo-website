import React from "react";
import { useApp } from "../context/AppContext";

export const DotGrid = ({ className = "" }) => {
  const context = useApp();
  const dotColor = context?.dotColor || "#111111";

  return (
    <div
      className={`h-12 w-12 opacity-70 ${className}`}
      style={{
        backgroundImage: `radial-gradient(circle, ${dotColor} 1.35px, transparent 1.5px)`,
        backgroundSize: "9px 9px",
      }}
    />
  );
};

export default DotGrid;
