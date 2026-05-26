import React, { useState, useEffect } from "react";
import { ArrowRight, Plus, ChevronDown, Trash2, ExternalLink } from "lucide-react";
import { useApp } from "../context/AppContext";
import Button from "../components/Button";
import DotField from "../components/DotField";

const FieldBlock = ({ no, title, desc, children }) => (
  <div className="grid gap-6 border-b border-neutral-200 p-7 last:border-b-0 md:grid-cols-[0.28fr_1fr]">
    <div className="flex gap-5">
      <span style={{ borderColor: "var(--brand-accent)", color: "var(--brand-accent)" }} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm font-bold animate-pulse">
        {no}
      </span>
      <div>
        <h3 className="font-bold text-black">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-neutral-600">{desc}</p>
      </div>
    </div>
    <div>{children}</div>
  </div>
);

export const BriefFormPage = () => {
  const { go, draftBrief, saveDraft, submitBrief, setSupportModalOpen } = useApp();

  // Local state initialized from draft in context
  const [brandName, setBrandName] = useState(draftBrief.brandName || "");
  const [colors, setColors] = useState(draftBrief.colors || []);
  const [identityVision, setIdentityVision] = useState(draftBrief.identityVision || "");
  const [targetAgeMin, setTargetAgeMin] = useState(draftBrief.targetAgeMin || 25);
  const [targetAgeMax, setTargetAgeMax] = useState(draftBrief.targetAgeMax || 40);
  const [requiredDesigns, setRequiredDesigns] = useState(draftBrief.requiredDesigns || []);
  const [notes, setNotes] = useState(draftBrief.notes || "");

  // UI state for adding elements
  const [showColorInput, setShowColorInput] = useState(false);
  const [newColorHex, setNewColorHex] = useState("#");
  const [showItemInput, setShowItemInput] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [newItemQty, setNewItemQty] = useState(1);

  const [validationError, setValidationError] = useState("");
  const [draftMessage, setDraftMessage] = useState("");

  // Sync back to local draft periodically or when state changes
  useEffect(() => {
    saveDraft({
      brandName,
      colors,
      identityVision,
      targetAgeMin,
      targetAgeMax,
      requiredDesigns,
      notes
    });
  }, [brandName, colors, identityVision, targetAgeMin, targetAgeMax, requiredDesigns, notes]);

  const handleAddColor = (e) => {
    e.preventDefault();
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (!hexRegex.test(newColorHex)) {
      alert("Please enter a valid hex code (e.g. #FF6A00)");
      return;
    }
    // Prevent duplicates
    if (colors.some(c => c.hex.toLowerCase() === newColorHex.toLowerCase())) {
      setShowColorInput(false);
      return;
    }
    setColors([...colors, { hex: newColorHex, name: "custom-color" }]);
    setNewColorHex("#");
    setShowColorInput(false);
  };

  const handleRemoveColor = (hexToRemove) => {
    setColors(colors.filter(c => c.hex !== hexToRemove));
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    setRequiredDesigns([...requiredDesigns, { name: newItemName.trim(), quantity: newItemQty }]);
    setNewItemName("");
    setNewItemQty(1);
    setShowItemInput(false);
  };

  const handleRemoveItem = (indexToRemove) => {
    setRequiredDesigns(requiredDesigns.filter((_, idx) => idx !== indexToRemove));
  };

  const handleQuantityChange = (index, newQty) => {
    const qty = parseInt(newQty, 10);
    setRequiredDesigns(
      requiredDesigns.map((item, idx) =>
        idx === index ? { ...item, quantity: qty > 0 ? qty : 1 } : item
      )
    );
  };

  const handleSaveDraft = () => {
    saveDraft({
      brandName,
      colors,
      identityVision,
      targetAgeMin,
      targetAgeMax,
      requiredDesigns,
      notes
    });
    setDraftMessage("Draft saved successfully to localStorage!");
    setTimeout(() => setDraftMessage(""), 3000);
  };

  const handleSubmit = async () => {
    if (!brandName.trim()) {
      setValidationError("Brand Name is required.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (!identityVision.trim()) {
      setValidationError("Identity & Vision description is required.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (requiredDesigns.length === 0) {
      setValidationError("At least one Required Design is required.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setValidationError("");
    const success = await submitBrief({
      brandName,
      colors,
      identityVision,
      targetAgeMin,
      targetAgeMax,
      requiredDesigns,
      notes
    });

    if (success) {
      go("submitted");
    } else {
      setValidationError("Failed to submit brief to backend. Please check connection and try again.");
    }
  };

  return (
    <main className="relative overflow-hidden bg-[#fbfbfa] px-8 py-10 lg:px-12">
      <DotField className="right-0 top-16 h-72 w-[430px]" dense />
      <button
        onClick={() => go("access")}
        className="mt-5 flex items-center gap-3 text-sm font-semibold hover:text-neutral-600 focus:outline-none"
      >
        <ArrowRight className="rotate-180" size={16} /> Back to Access
      </button>

      <section className="mx-auto max-w-[1740px] py-10">
        <div className="grid items-center gap-10 lg:grid-cols-[0.35fr_0.65fr]">
          <div>
            <h1 className="text-6xl font-black tracking-[-0.06em]">Client Brief</h1>
            <p className="mt-6 max-w-[450px] text-base leading-7 text-neutral-700">
              Help us understand your brand and vision so we can deliver designs that align perfectly.
            </p>
          </div>
          <div className="flex items-center justify-center gap-8 text-sm">
            {[
              ["01", "Brief", true],
              ["02", "Goals", false],
              ["03", "Deliverables", false],
              ["04", "Additional", false]
            ].map(([n, t, active], i) => (
              <React.Fragment key={n}>
                <div className="flex items-center gap-3">
                  <span
                    className="flex h-10 w-10 items-center justify-center rounded-full border font-bold"
                    style={
                      active 
                        ? { backgroundColor: "var(--brand-accent)", borderColor: "var(--brand-accent)", color: "white" } 
                        : { backgroundColor: "white", borderColor: "#d4d4d4", color: "#737373" }
                    }
                  >
                    {n}
                  </span>
                  <span className={active ? "font-bold text-black" : "text-neutral-500"}>{t}</span>
                </div>
                {i < 3 && <div className="h-px w-20 bg-neutral-300" />}
              </React.Fragment>
            ))}
          </div>
        </div>

        {validationError && (
          <div className="mt-8 rounded-xl border border-red-300 bg-red-50 p-4 text-sm font-semibold text-red-600">
            {validationError}
          </div>
        )}

        {draftMessage && (
          <div className="mt-8 rounded-xl border border-green-300 bg-green-50 p-4 text-sm font-semibold text-green-700">
            {draftMessage}
          </div>
        )}

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          {/* Left Column */}
          <div className="rounded-2xl border border-neutral-200 bg-white">
            <FieldBlock no="01" title="Brand Name" desc="Define your brand essence.">
              <input
                required
                type="text"
                className="w-full rounded-xl border border-neutral-300 px-6 py-4 outline-none focus:border-black text-neutral-800"
                placeholder="Enter your brand name"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
              />
            </FieldBlock>

            <FieldBlock no="02" title="Brand Colors" desc="Choose your primary brand colors.">
              <div className="flex flex-wrap gap-4">
                {colors.map((c, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 rounded-xl border border-neutral-300 px-4 py-3 bg-[#fbfbfa] relative group"
                  >
                    <span
                      className="h-8 w-8 rounded border border-neutral-200"
                      style={{ backgroundColor: c.hex }}
                    />
                    <span className="font-mono text-sm text-neutral-600">{c.hex}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveColor(c.hex)}
                      className="text-neutral-400 hover:text-red-500 focus:outline-none"
                      aria-label={`Remove color ${c.hex}`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}

                {showColorInput ? (
                  <form onSubmit={handleAddColor} className="flex items-center gap-2 rounded-xl border border-neutral-400 p-2 bg-white">
                    <input
                      type="text"
                      className="w-20 font-mono text-sm border-b border-neutral-300 outline-none px-1"
                      placeholder="#HEX"
                      value={newColorHex}
                      onChange={(e) => setNewColorHex(e.target.value)}
                      maxLength={7}
                      required
                    />
                    <button type="submit" className="text-xs bg-black text-white px-2 py-1 rounded hover:bg-neutral-800">
                      Add
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowColorInput(false)}
                      className="text-xs text-neutral-500 hover:text-black"
                    >
                      Cancel
                    </button>
                  </form>
                ) : (
                  <button
                    onClick={() => setShowColorInput(true)}
                    className="flex items-center gap-3 rounded-xl border border-neutral-300 px-5 py-3 hover:border-black focus:outline-none"
                  >
                    <Plus size={16} /> Add Color
                  </button>
                )}
              </div>
            </FieldBlock>

            <FieldBlock
              no="03"
              title="Identity & Vision"
              desc="Tell us about your brand’s purpose, personality, and vision."
            >
              <textarea
                required
                maxLength={1000}
                className="h-36 w-full rounded-xl border border-neutral-300 p-5 outline-none focus:border-black text-neutral-800 resize-none"
                placeholder="Describe your brand, mission, values, and the future you’re building."
                value={identityVision}
                onChange={(e) => setIdentityVision(e.target.value)}
              />
              <div className="-mt-8 pr-4 text-right text-xs text-neutral-500">
                {identityVision.length}/1000
              </div>
            </FieldBlock>
          </div>

          {/* Right Column */}
          <div className="rounded-2xl border border-neutral-200 bg-white">
            <FieldBlock no="04" title="Target Age Range" desc="Who is your primary audience?">
              <div className="flex items-center gap-5">
                <div className="relative">
                  <select
                    className="appearance-none rounded-xl border border-neutral-300 bg-white pl-8 pr-12 py-4 outline-none focus:border-black font-semibold text-sm cursor-pointer"
                    value={targetAgeMin}
                    onChange={(e) => setTargetAgeMin(parseInt(e.target.value, 10))}
                  >
                    {Array.from({ length: 90 }, (_, i) => i + 10).map((age) => (
                      <option key={age} value={age}>
                        {age}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" size={14} />
                </div>
                <span className="text-neutral-500">to</span>
                <div className="relative">
                  <select
                    className="appearance-none rounded-xl border border-neutral-300 bg-white pl-8 pr-12 py-4 outline-none focus:border-black font-semibold text-sm cursor-pointer"
                    value={targetAgeMax}
                    onChange={(e) => setTargetAgeMax(parseInt(e.target.value, 10))}
                  >
                    {Array.from({ length: 90 }, (_, i) => i + 10)
                      .filter((age) => age >= targetAgeMin)
                      .map((age) => (
                        <option key={age} value={age}>
                          {age}
                        </option>
                      ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" size={14} />
                </div>
                <span className="text-sm font-semibold text-neutral-700">years old</span>
              </div>
            </FieldBlock>

            <FieldBlock no="05" title="Required Designs" desc="Select the assets you need and quantities.">
              <div className="overflow-hidden rounded-xl border border-neutral-300">
                {requiredDesigns.map((item, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-[1fr_120px] border-b border-neutral-200 last:border-b-0 items-center"
                  >
                    <div className="px-5 py-4 flex justify-between items-center text-sm font-medium">
                      <span>{item.name}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(index)}
                        className="text-neutral-400 hover:text-red-500 focus:outline-none"
                        aria-label={`Remove design ${item.name}`}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <div className="border-l border-neutral-200 px-5 py-3 flex items-center relative">
                      <select
                        className="w-full bg-transparent outline-none appearance-none pr-6 cursor-pointer font-bold"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(index, e.target.value)}
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20].map(q => (
                          <option key={q} value={q}>
                            {q}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-5 pointer-events-none" size={14} />
                    </div>
                  </div>
                ))}

                {showItemInput ? (
                  <form onSubmit={handleAddItem} className="p-4 border-t border-neutral-200 flex flex-col gap-3 bg-neutral-50">
                    <input
                      type="text"
                      className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none bg-white"
                      placeholder="e.g. Website Design, Packaging"
                      value={newItemName}
                      onChange={(e) => setNewItemName(e.target.value)}
                      required
                    />
                    <div className="flex gap-3 items-center">
                      <label className="text-xs font-semibold text-neutral-500">Qty:</label>
                      <input
                        type="number"
                        min="1"
                        max="99"
                        className="w-16 rounded-lg border border-neutral-300 px-2 py-1 text-sm outline-none bg-white font-bold"
                        value={newItemQty}
                        onChange={(e) => setNewItemQty(parseInt(e.target.value, 10) || 1)}
                      />
                      <button type="submit" className="ml-auto text-xs bg-black text-white px-3 py-2 rounded-lg hover:bg-neutral-800">
                        Add Design
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowItemInput(false)}
                        className="text-xs text-neutral-500 hover:text-black"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <button
                    onClick={() => setShowItemInput(true)}
                    className="flex w-full items-center gap-3 px-5 py-4 text-sm font-semibold hover:bg-neutral-50 focus:outline-none"
                  >
                    <Plus size={16} /> Add Item
                  </button>
                )}
              </div>
            </FieldBlock>

            <FieldBlock no="06" title="Notes" desc="Any additional information we should know?">
              <textarea
                maxLength={1000}
                className="h-32 w-full rounded-xl border border-neutral-300 p-5 outline-none focus:border-black text-neutral-800 resize-none"
                placeholder="Add any extra details, references, or notes that will help us bring your vision to life."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
              <div className="-mt-8 pr-4 text-right text-xs text-neutral-500">
                {notes.length}/1000
              </div>
            </FieldBlock>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between">
          <Button variant="light" onClick={handleSaveDraft}>
            Save Draft
          </Button>
          <Button onClick={handleSubmit} className="min-w-[290px]">
            Submit Brief <ArrowRight size={18} />
          </Button>
        </div>

        <div className="mt-10 flex gap-3 text-sm text-neutral-700">
          <Plus size={16} /> Need help?{" "}
          <button
            onClick={() => setSupportModalOpen(true)}
            className="font-bold hover:underline inline-flex items-center gap-1 focus:outline-none"
          >
            Contact Support <ExternalLink size={14} />
          </button>
        </div>
      </section>
    </main>
  );
};

export default BriefFormPage;
