import React from "react";
import { useApp } from "../context/AppContext";

export const DotField = ({ className = "", dense = false }) => {
  const { briefs } = useApp();
  // Get active dotColor. We can try to read it safely.
  // We'll read it from context, or fall back to default #111111 (or #111)
  const context = useApp();
  const dotColor = context?.dotColor || "#111111";

  return (
    <div
      className={`pointer-events-none absolute opacity-[0.42] ${className}`}
      style={{
        backgroundImage: `radial-gradient(circle, ${dotColor} 1px, transparent 1.6px)`,
        backgroundSize: dense ? "8px 8px" : "11px 11px",
        maskImage:
          "radial-gradient(ellipse at center, black 0%, black 38%, transparent 72%)",
        WebkitMaskImage:
          "radial-gradient(ellipse at center, black 0%, black 38%, transparent 72%)",
      }}
    />
  );
};

export default DotField;
