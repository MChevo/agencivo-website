import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import Sidebar from "../components/Sidebar";
import Button from "../components/Button";
import DotField from "../components/DotField";
import { Layers3, Key, Copy, Check, Info } from "lucide-react";

export const TemplatesPage = () => {
  const { generateProjectCode } = useApp();
  
  const [activeTemplateCode, setActiveTemplateCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [activeTemplateName, setActiveTemplateName] = useState("");

  const templatesList = [
    {
      name: "Standard Brand Package",
      desc: "Perfect for new startups needing a strong foundational identity.",
      designs: [
        { name: "Logo Design", quantity: 1 },
        { name: "Brand Guidelines", quantity: 1 },
        { name: "Business Card", quantity: 2 }
      ]
    },
    {
      name: "Social Media Growth Kit",
      desc: "For companies scaling their content marketing across platforms.",
      designs: [
        { name: "Instagram Post Templates", quantity: 9 },
        { name: "Twitter Banner", quantity: 1 },
        { name: "Avatar & Icons", quantity: 3 }
      ]
    },
    {
      name: "Corporate Stationery Package",
      desc: "High-fidelity prints and assets for mature corporate environments.",
      designs: [
        { name: "Letterhead Design", quantity: 1 },
        { name: "Presentation Deck (Slides)", quantity: 12 },
        { name: "Corporate Folder", quantity: 1 }
      ]
    },
    {
      name: "SaaS Website Launch System",
      desc: "Full product interface layouts and landing pages.",
      designs: [
        { name: "Landing Page Wireframes", quantity: 1 },
        { name: "UI Components Library", quantity: 1 },
        { name: "Custom Icon Set", quantity: 12 }
      ]
    }
  ];

  const handleGenerateTemplateCode = async (tpl) => {
    setActiveTemplateName(tpl.name);
    const code = await generateProjectCode(`${tpl.name} Package`, tpl.designs);
    setActiveTemplateCode(code);
    setCopied(false);
  };

  const handleCopyCode = () => {
    if (!activeTemplateCode) return;
    navigator.clipboard.writeText(activeTemplateCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex min-h-screen bg-[#fbfbfa] w-full">
      <Sidebar />
      <section className="relative flex-1 overflow-x-hidden p-6 md:p-10">
        <DotField className="right-0 top-20 h-80 w-72" dense />

        <div className="mt-6 lg:mt-10">
          <h1 className="text-4xl font-black tracking-[-0.04em] text-black">Brief Templates</h1>
          <p className="text-neutral-500 text-sm mt-2">
            Generate pre-filled project codes. When clients use these codes, their briefs will be pre-populated with deliverables.
          </p>
        </div>

        {/* Display generated code at the top */}
        {activeTemplateCode && (
          <div className="mt-8 p-6 rounded-2xl border border-neutral-300 bg-white shadow-xs max-w-2xl relative overflow-hidden">
            <DotField className="-right-10 -bottom-10 h-32 w-48" dense />
            <div className="flex items-center gap-3">
              <span className="p-2 bg-neutral-100 rounded-lg text-black">
                <Key size={16} />
              </span>
              <div>
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Generated Pre-filled Code</span>
                <span className="text-xs text-neutral-600 font-semibold">{activeTemplateName}</span>
              </div>
            </div>

            <div className="mt-5 p-4 rounded-xl border border-neutral-200 bg-neutral-50 flex items-center justify-between">
              <span className="font-mono text-base font-black tracking-wider text-black select-all">
                {activeTemplateCode}
              </span>
              <button
                onClick={handleCopyCode}
                className="p-2.5 rounded-lg border border-neutral-300 hover:bg-neutral-100 text-neutral-600 hover:text-black focus:outline-none"
                aria-label="Copy code to clipboard"
              >
                {copied ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
              </button>
            </div>
            
            <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mt-4 flex items-center gap-1">
              <Info size={12} /> Send this code to your client to skip package setup!
            </p>
          </div>
        )}

        {/* Templates Grid */}
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {templatesList.map((tpl) => (
            <div key={tpl.name} className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="p-2 bg-neutral-100 rounded-lg text-black">
                    <Layers3 size={16} />
                  </span>
                  <h3 className="font-bold text-black text-lg">{tpl.name}</h3>
                </div>
                <p className="text-xs text-neutral-600 mb-6">{tpl.desc}</p>
                
                <div className="border-t border-neutral-100 pt-4 mb-8">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-3">Pre-defined Deliverables</span>
                  <ul className="space-y-2 text-xs font-semibold text-neutral-800">
                    {tpl.designs.map((design) => (
                      <li key={design.name} className="flex justify-between items-center bg-neutral-50 p-2.5 rounded-xl border border-neutral-100">
                        <span>{design.name}</span>
                        <span className="font-mono text-neutral-500">Qty: {design.quantity}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <Button onClick={() => handleGenerateTemplateCode(tpl)} className="w-full py-3">
                Generate Template Code
              </Button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default TemplatesPage;
