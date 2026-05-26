import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import Sidebar from "../components/Sidebar";
import Button from "../components/Button";
import DotField from "../components/DotField";
import DotGrid from "../components/DotGrid";
import { Settings, Shield, Sliders, Check, AlertCircle } from "lucide-react";

export const SettingsPage = () => {
  const { user, dotColor, updateUserSettings, subscription, go } = useApp();
  
  const [agencyName, setAgencyName] = useState(user?.agencyName || "");
  const [selectedColor, setSelectedColor] = useState(dotColor || "#FF6A00");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const colorSwatches = [
    { name: "Orange", hex: "#FF6A00" },
    { name: "Yellow", hex: "#EAB308" },
    { name: "Green", hex: "#22C55E" },
    { name: "Blue", hex: "#3B82F6" },
    { name: "Red", hex: "#EF4444" },
    { name: "Purple", hex: "#8B5CF6" },
    { name: "Gray", hex: "#737373" }
  ];

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    if (!agencyName.trim()) {
      setError("Agency name cannot be empty.");
      return;
    }

    setLoading(true);
    const result = await updateUserSettings({
      agencyName: agencyName.trim(),
      dotColor: selectedColor
    });
    setLoading(false);

    if (result.success) {
      setSuccess("Settings updated successfully!");
    } else {
      setError(result.error || "Failed to save settings.");
    }
  };

  return (
    <div className="flex min-h-screen bg-[#fbfbfa] w-full">
      <Sidebar />
      <section className="relative flex-1 overflow-x-hidden p-6 md:p-10">
        <DotField className="right-0 top-20 h-80 w-72" dense />

        <div className="mt-6 lg:mt-10">
          <h1 className="text-4xl font-black tracking-[-0.04em] text-black">Settings</h1>
          <p className="text-neutral-500 text-sm mt-2">Manage your agency brand, user preferences, and theme styling.</p>
        </div>

        {error && (
          <div className="mt-6 p-4 rounded-xl border border-red-200 bg-red-50 flex items-center gap-3 text-red-700 text-sm max-w-2xl">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mt-6 p-4 rounded-xl border border-green-200 bg-green-50 flex items-center gap-3 text-green-700 text-sm max-w-2xl">
            <Check size={18} />
            <span>{success}</span>
          </div>
        )}

        <div className="mt-8 grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
          
          {/* Brand customization and profile details */}
          <form onSubmit={handleSave} className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs space-y-8 max-w-2xl h-fit">
            <div>
              <h3 className="text-xl font-bold text-black mb-1">Agency Identity</h3>
              <p className="text-xs text-neutral-500">Configure agency branding defaults.</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-2">
                  Agency Name
                </label>
                <input
                  type="text"
                  value={agencyName}
                  onChange={(e) => setAgencyName(e.target.value)}
                  className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm outline-none focus:border-black"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-2">
                  Account Email Address
                </label>
                <input
                  type="email"
                  value={user?.email || ""}
                  className="w-full rounded-xl border border-neutral-300 bg-neutral-50 px-4 py-3 text-sm outline-none text-neutral-500 cursor-not-allowed select-none"
                  disabled
                  readOnly
                />
                <span className="text-[10px] text-neutral-400 mt-1 block">Your email acts as your owner identifier and cannot be modified.</span>
              </div>
            </div>

            <div className="border-t border-neutral-200 pt-6">
              <h4 className="text-sm font-bold text-black uppercase tracking-wider mb-2">
                Brand Accent Theme (Dot Matrix)
              </h4>
              <p className="text-xs text-neutral-500 mb-4">
                Choose the color for your background halftone dots grid. This color is dynamic and updates automatically.
              </p>
              
              <div className="flex flex-wrap gap-3">
                {colorSwatches.map((c) => {
                  const isSelected = selectedColor.toLowerCase() === c.hex.toLowerCase();
                  return (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => setSelectedColor(c.hex)}
                      className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 transition-all text-xs font-semibold focus:outline-none ${
                        isSelected 
                          ? "border-black bg-neutral-50 text-black shadow-inner" 
                          : "border-neutral-300 hover:border-black text-neutral-600 bg-white"
                      }`}
                    >
                      <span
                        className="h-3.5 w-3.5 rounded-full border border-neutral-200 block shrink-0"
                        style={{ backgroundColor: c.hex }}
                      />
                      {c.name}
                      {isSelected && <Check size={12} className="ml-1" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full py-4 flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? "Saving Changes..." : "Save Settings"}
            </Button>
          </form>

          {/* Subscription and System License */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs h-fit">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-lg font-bold text-black">Subscription License</h3>
                  <span className="text-xs text-neutral-500 mt-0.5">Renewals and tiers.</span>
                </div>
                <span className="h-10 w-10 flex items-center justify-center bg-neutral-100 rounded-lg text-black">
                  <Shield size={18} />
                </span>
              </div>

              <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Current Plan</span>
                <b className="text-xl font-black text-black mt-1 block uppercase">
                  {subscription === "professional" ? "Professional Plan" : subscription === "starter" ? "Starter Plan" : subscription === "enterprise" ? "Enterprise Plan" : "No Plan Selected"}
                </b>
                <p className="text-xs text-neutral-500 mt-2">
                  {subscription === "professional" ? "Access to custom branding, team accounts up to 15 members." : subscription === "starter" ? "Access to basic dashboard tools up to 3 team members." : "Full enterprise features & custom support SLA."}
                </p>
              </div>

              <Button
                variant="light"
                onClick={() => go("pricing")}
                className="w-full mt-6 py-3 border border-neutral-300 hover:border-black"
              >
                Change Subscription Plan
              </Button>
            </div>
            
            {/* Dot Grid Visualizer */}
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs flex items-center gap-5 relative overflow-hidden">
              <DotGrid className="shrink-0" />
              <div>
                <h4 className="font-bold text-black text-sm">Theme Preview</h4>
                <p className="text-xs text-neutral-500 mt-1">This is how your selected accent color looks on dashboard components.</p>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};

export default SettingsPage;
