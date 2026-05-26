import React from "react";

export const Logo = ({ compact = false }) => (
  <div className="flex items-center gap-3 select-none">
    <div className="relative h-7 w-7">
      <div className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 rounded-sm bg-black" />
      <div className="absolute bottom-0 left-1/2 h-2 w-2 -translate-x-1/2 rounded-sm bg-black" />
      <div className="absolute left-0 top-1/2 h-2 w-2 -translate-y-1/2 rounded-sm bg-black" />
      <div className="absolute right-0 top-1/2 h-2 w-2 -translate-y-1/2 rounded-sm bg-black" />
      <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-[3px] border-2 border-black" />
    </div>
    {!compact && <span className="text-[13px] font-extrabold tracking-[0.32em]">AGENCIVO</span>}
  </div>
);

export default Logo;
