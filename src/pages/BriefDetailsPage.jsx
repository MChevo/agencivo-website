import React, { useState } from "react";
import { ArrowRight, Download, HelpCircle, ExternalLink, Key, AlertCircle } from "lucide-react";
import { useApp } from "../context/AppContext";
import Button from "../components/Button";
import DotField from "../components/DotField";

const DetailSection = ({ label, children }) => (
  <div className="grid items-start gap-7 lg:grid-cols-[190px_1fr] border-b border-neutral-100 py-6 last:border-b-0">
    <div className="flex items-center gap-5 pt-1 text-xs font-bold uppercase tracking-[0.16em] text-neutral-500">
      <span className="h-px w-6 bg-black block shrink-0" />
      {label}
    </div>
    <div className="w-full">{children}</div>
  </div>
);

export const BriefDetailsPage = () => {
  const { go, briefs, selectedBriefId, updateBriefStatus, setSupportModalOpen } = useApp();

  // Find selected brief or fallback to first brief
  const currentBrief = briefs.find((b) => b.id === selectedBriefId) || briefs[0];

  const [statusMessage, setStatusMessage] = useState("");

  if (!currentBrief) {
    return (
      <main className="relative overflow-hidden bg-[#fbfbfa] px-8 py-10 lg:px-12 text-center">
        <h1 className="text-3xl font-bold mt-20 text-black">Brief Not Found</h1>
        <Button onClick={() => go("dashboard")} className="mt-5">
          Back to Dashboard
        </Button>
      </main>
    );
  }

  const handleUpdateStatus = async (newStatus) => {
    await updateBriefStatus(currentBrief.id, newStatus);
    setStatusMessage(`Brief status updated to "${newStatus}"`);
    setTimeout(() => setStatusMessage(""), 3000);
  };

  const handleDownload = () => {
    if (currentBrief.status === "Code Unused") {
      alert("This project code has not been filled out by the client yet. There is no brief data to download.");
      return;
    }

    const reportText = `AGENCIVO CLIENT PROJECT BRIEF REPORT
===================================================
Brand Name:        ${currentBrief.brandName}
Project Code:      ${currentBrief.code || "N/A"}
Project Type:      ${currentBrief.projectType}
Submission Date:   ${new Date(currentBrief.submittedAt).toLocaleString()}
Current Status:    ${currentBrief.status}

1. BRAND OVERVIEW & VISION
---------------------------------------------------
${currentBrief.brandOverview || currentBrief.identityVision}

2. BRAND COLORS
---------------------------------------------------
${
  currentBrief.colors?.length > 0
    ? currentBrief.colors.map((c) => `- Hex: ${c.hex} (${c.name || "custom"})`).join("\n")
    : "None specified"
}

3. TARGET AUDIENCE
---------------------------------------------------
Target age range:  ${currentBrief.targetAgeMin} to ${currentBrief.targetAgeMax} years old

4. REQUIRED DELIVERABLES
---------------------------------------------------
${
  currentBrief.requiredDesigns?.length > 0
    ? currentBrief.requiredDesigns.map((d) => `- ${d.name}: Quantity ${d.quantity}`).join("\n")
    : "None specified"
}

5. EXTRA NOTES & GUIDELINES
---------------------------------------------------
${currentBrief.notes || "None specified"}

===================================================
Generated via Agencivo platform.
`;

    const blob = new Blob([reportText], { type: "text/plain;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Agencivo_Brief_${currentBrief.brandName.replace(/\s+/g, "_")}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <main className="relative overflow-hidden bg-[#fbfbfa] px-8 py-10 lg:px-12 animate-fade-in">
      <DotField className="right-0 top-32 h-80 w-80" dense />

      <div className="flex items-center justify-between">
        <button
          onClick={() => go("dashboard")}
          className="flex items-center gap-3 text-sm font-semibold hover:text-neutral-600 focus:outline-none"
        >
          <ArrowRight className="rotate-180" size={16} /> Back to Dashboard
        </button>
        <Button
          variant="light"
          onClick={handleDownload}
          disabled={currentBrief.status === "Code Unused"}
          className="text-xs py-2 px-4"
        >
          Download Brief <Download size={16} />
        </Button>
      </div>

      {statusMessage && (
        <div className="mx-auto max-w-[1740px] mt-6 rounded-xl border border-green-300 bg-green-50 p-4 text-sm font-semibold text-green-700">
          {statusMessage}
        </div>
      )}

      <section className="mx-auto max-w-[1740px] py-12">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
          <h1 className="text-4xl md:text-7xl font-black tracking-[-0.07em] text-black break-words">
            {currentBrief.brandName === "Pending Client" ? `Project: ${currentBrief.code}` : currentBrief.brandName}
            <span className={`ml-5 align-middle inline-block rounded-lg border px-4 py-2 text-sm font-bold tracking-normal uppercase bg-white ${
              currentBrief.status === "Code Unused" ? "border-neutral-300 text-neutral-500" : "border-[#ff6a00] text-[#ff6a00]"
            }`}>
              {currentBrief.status}
            </span>
          </h1>
        </div>

        <h2 className="text-3xl font-extrabold text-black">Task Details</h2>
        <p className="mt-3 max-w-[650px] text-lg leading-7 text-neutral-700">
          Review the current project configuration, codes, and client responses. Adjust statuses below as progress updates.
        </p>

        {currentBrief.status === "Code Unused" ? (
          /* Notice banner for generated, unused codes */
          <div className="mt-10 rounded-2xl border border-neutral-300 bg-white p-8 md:p-12 text-center max-w-[800px] mx-auto shadow-sm relative overflow-hidden">
            <DotField className="-bottom-20 right-0 h-40 w-56" dense />
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-neutral-100 text-black mb-6">
              <Key size={24} />
            </div>
            <h3 className="text-2xl font-bold text-black mb-3">Pending Client Submission</h3>
            <p className="text-neutral-600 text-sm max-w-[500px] mx-auto leading-6">
              This code has not been used by a client yet. Share this code with your client to allow them to access and submit their brand brief:
            </p>
            <div className="mt-6 inline-block bg-neutral-100 font-mono text-2xl font-black tracking-wider px-8 py-4 rounded-xl border select-all text-black">
              {currentBrief.code}
            </div>
            <p className="mt-4 text-xs text-neutral-400">
              Created on {new Date(currentBrief.submittedAt).toLocaleDateString()}
            </p>
          </div>
        ) : (
          /* Form Fields Viewer */
          <div className="mt-10 rounded-2xl border border-neutral-200 bg-white p-6 md:p-8 space-y-2 shadow-xs">
            <DetailSection label="CLIENT CODE">
              <div className="font-mono text-lg font-bold text-black select-all">
                {currentBrief.code || "N/A"}
              </div>
            </DetailSection>

            <DetailSection label="BRAND OVERVIEW">
              <div className="text-lg leading-8 text-neutral-800 break-words whitespace-pre-wrap">
                {currentBrief.brandOverview || currentBrief.identityVision}
              </div>
            </DetailSection>

            <DetailSection label="BRAND COLORS">
              <div className="flex flex-wrap gap-4">
                {currentBrief.colors?.length > 0 ? (
                  currentBrief.colors.map((c, index) => (
                    <div key={index} className="flex items-center gap-3 rounded-xl border border-neutral-300 bg-[#fbfbfa] px-4 py-2.5">
                      <span
                        className="h-9 w-9 rounded border border-neutral-200 shrink-0"
                        style={{ backgroundColor: c.hex }}
                      />
                      <span className="font-mono text-sm text-neutral-700">{c.hex}</span>
                    </div>
                  ))
                ) : (
                  <span className="text-neutral-500 text-sm">None specified</span>
                )}
              </div>
            </DetailSection>

            <DetailSection label="IDENTITY & VISION">
              <div className="text-lg leading-8 text-neutral-800 break-words whitespace-pre-wrap">
                {currentBrief.identityVision}
              </div>
            </DetailSection>

            <DetailSection label="TARGET AGE RANGE">
              <div className="text-sm font-semibold text-neutral-800">
                {currentBrief.targetAgeMin && currentBrief.targetAgeMax ? (
                  <span>
                    {currentBrief.targetAgeMin} to {currentBrief.targetAgeMax} years old
                  </span>
                ) : (
                  <span>Not specified</span>
                )}
              </div>
            </DetailSection>

            <DetailSection label="REQUIRED DESIGNS">
              <div className="overflow-hidden rounded-xl border border-neutral-300 bg-white max-w-[500px]">
                {currentBrief.requiredDesigns?.length > 0 ? (
                  currentBrief.requiredDesigns.map((d, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-[1fr_100px] border-b border-neutral-200 last:border-b-0 items-center text-sm font-medium"
                    >
                      <div className="px-6 py-4 text-neutral-800">{d.name}</div>
                      <div className="border-l border-neutral-200 px-6 py-4 font-bold text-center text-black">
                        {d.quantity}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-6 py-4 text-neutral-500 text-sm">None specified</div>
                )}
              </div>
            </DetailSection>

            <DetailSection label="NOTES">
              <div className="text-lg leading-8 text-neutral-800 break-words whitespace-pre-wrap">
                {currentBrief.notes || "No additional notes provided by client."}
              </div>
            </DetailSection>
          </div>
        )}

        {/* Action Panel */}
        <div className="mt-8 flex flex-col md:flex-row items-center justify-between border border-neutral-200 bg-white p-8 gap-6 shadow-sm rounded-2xl">
          <div className="flex items-center gap-5">
            <HelpCircle size={32} className="text-black shrink-0" />
            <div>
              <p className="text-xs font-bold text-neutral-500">Need clarification?</p>
              <button
                onClick={() => setSupportModalOpen(true)}
                className="font-bold hover:underline text-sm inline-flex items-center gap-1 focus:outline-none"
              >
                Contact Support <ExternalLink size={14} />
              </button>
            </div>
          </div>
          
          {currentBrief.status !== "Code Unused" && (
            <div className="flex gap-5 w-full md:w-auto">
              <Button
                variant="light"
                onClick={() => handleUpdateStatus("Review")}
                className="flex-1 md:flex-initial py-3"
                disabled={currentBrief.status === "Review"}
              >
                Save for Later
              </Button>
              {currentBrief.status === "In Progress" || currentBrief.status === "Review" ? (
                <Button
                  onClick={() => handleUpdateStatus("Completed")}
                  className="flex-1 md:flex-initial py-3"
                >
                  Complete Brief <ArrowRight size={17} />
                </Button>
              ) : currentBrief.status === "Completed" ? (
                <Button
                  onClick={() => handleUpdateStatus("In Progress")}
                  className="flex-1 md:flex-initial py-3"
                >
                  Reopen Brief
                </Button>
              ) : (
                <Button
                  onClick={() => handleUpdateStatus("In Progress")}
                  className="flex-1 md:flex-initial py-3"
                >
                  Accept Brief <ArrowRight size={17} />
                </Button>
              )}
            </div>
          )}
        </div>

        <div className="mt-8 flex justify-between text-xs text-neutral-500">
          <span>© 2026 Agencivo. All rights reserved.</span>
          <div className="flex gap-12">
            <span className="hover:underline cursor-pointer">Privacy Policy</span>
            <span className="hover:underline cursor-pointer">Terms of Service</span>
            <span className="hover:underline cursor-pointer">Security</span>
          </div>
        </div>
      </section>
    </main>
  );
};

export default BriefDetailsPage;
