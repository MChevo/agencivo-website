import React from "react";

export const Button = ({ children, variant = "dark", className = "", onClick, "aria-label": ariaLabel, ...props }) => {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all duration-200 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2";
  const styles =
    variant === "dark"
      ? "bg-black text-white shadow-[0_10px_30px_rgba(0,0,0,0.08)] hover:bg-neutral-800"
      : "border border-neutral-300 bg-white text-black hover:border-black";
  return (
    <button
      onClick={onClick}
      className={`${base} ${styles} ${className}`}
      aria-label={ariaLabel}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
