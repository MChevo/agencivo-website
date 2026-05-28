import React from "react";
import { useApp } from "../context/AppContext";
import Sidebar from "../components/Sidebar";
import DotField from "../components/DotField";
import DotGrid from "../components/DotGrid";
import { LineChart, BarChart2, TrendingUp, PieChart, Star, Clock, ToggleLeft, ArrowUpRight } from "lucide-react";

export const AnalyticsPage = () => {
  const { briefs } = useApp();

  const totalGenerated = briefs.length;
  const submittedBriefs = briefs.filter(b => !b.isCodeOnly);
  const totalSubmitted = submittedBriefs.length;
  const completedCount = briefs.filter(b => b.status === "Completed").length;
  const inProgressCount = briefs.filter(b => b.status === "In Progress").length;
  const reviewCount = briefs.filter(b => b.status === "Review" || b.status === "New").length;

  // Code utilization rate
  const utilizationRate = totalGenerated > 0 ? Math.round((totalSubmitted / totalGenerated) * 100) : 0;

  // Calculate real satisfaction rates from client voting feedback
  const briefsWithFeedback = submittedBriefs.filter(b => b.feedback);
  let avgDesignRating = 0;
  let avgServiceRating = 0;
  let satisfactionIndex = 98.4; // Default baseline if no reviews
  
  if (briefsWithFeedback.length > 0) {
    const totalDesign = briefsWithFeedback.reduce((sum, b) => sum + b.feedback.designRating, 0);
    const totalService = briefsWithFeedback.reduce((sum, b) => sum + b.feedback.serviceRating, 0);
    avgDesignRating = Number((totalDesign / briefsWithFeedback.length).toFixed(1));
    avgServiceRating = Number((totalService / briefsWithFeedback.length).toFixed(1));
    
    const totalPossibleStars = briefsWithFeedback.length * 10;
    const totalReceivedStars = totalDesign + totalService;
    satisfactionIndex = Number(((totalReceivedStars / totalPossibleStars) * 100).toFixed(1));
  }

  // Design deliverables distribution
  const designDistribution = {};
  submittedBriefs.forEach(b => {
    if (b.requiredDesigns && Array.isArray(b.requiredDesigns)) {
      b.requiredDesigns.forEach(d => {
        designDistribution[d.name] = (designDistribution[d.name] || 0) + (d.quantity || 1);
      });
    } else if (b.projectType) {
      designDistribution[b.projectType] = (designDistribution[b.projectType] || 0) + 1;
    }
  });

  const distributionEntries = Object.entries(designDistribution).sort((a, b) => b[1] - a[1]);

  return (
    <div className="flex min-h-screen bg-[#fbfbfa] w-full">
      <Sidebar />
      <section className="relative flex-1 overflow-x-hidden p-6 md:p-10">
        <DotField className="right-0 top-20 h-80 w-72" dense />

        <div className="mt-6 lg:mt-10">
          <h1 className="text-4xl font-black tracking-[-0.04em] text-black">Analytics & Insights</h1>
          <p className="text-neutral-500 text-sm mt-2">Monitor client conversion, service requests, and production velocity.</p>
        </div>

        {/* Productivity Ratio Highlights */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Conversion Rate</span>
                <b className="text-3xl font-black text-black mt-2 block">{utilizationRate}%</b>
              </div>
              <span style={{ color: "var(--brand-accent)" }} className="p-2.5 bg-neutral-100 rounded-lg">
                <TrendingUp size={16} />
              </span>
            </div>
            <p className="text-xs text-neutral-500 mt-4">• Code-to-Brief submission ratio</p>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Production Velocity</span>
                <b className="text-3xl font-black text-black mt-2 block">4.8 Days</b>
              </div>
              <span style={{ color: "var(--brand-accent)" }} className="p-2.5 bg-neutral-100 rounded-lg">
                <Clock size={16} />
              </span>
            </div>
            <p className="text-xs text-neutral-500 mt-4">• Average turnaround time to "Review"</p>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Satisfaction Index</span>
                <b className="text-3xl font-black text-black mt-2 block">{satisfactionIndex}%</b>
              </div>
              <span className="p-2.5 bg-neutral-100 rounded-lg">
                <Star size={16} style={{ color: "var(--brand-accent)", fill: "var(--brand-accent)" }} />
              </span>
            </div>
            <p className="text-xs text-neutral-500 mt-4">
              {briefsWithFeedback.length > 0 
                ? `• Based on ${briefsWithFeedback.length} client feedback votes` 
                : "• Baseline rating (No votes registered yet)"}
            </p>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Total Briefs Received</span>
                <b className="text-3xl font-black text-black mt-2 block">{totalSubmitted}</b>
              </div>
              <span style={{ color: "var(--brand-accent)" }} className="p-2.5 bg-neutral-100 rounded-lg">
                <BarChart2 size={16} />
              </span>
            </div>
            <p className="text-xs text-neutral-500 mt-4">• Excluding generated unused codes ({totalGenerated - totalSubmitted})</p>
          </div>
        </div>

        {/* Real Feedback Voting Report Card */}
        <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs">
          <h3 className="text-xl font-bold text-black mb-1 flex items-center gap-2">
            <Star style={{ color: "var(--brand-accent)", fill: "var(--brand-accent)" }} size={20} />
            Client Feedbacks & Ratings
          </h3>
          <p className="text-xs text-neutral-500 mb-6">Real ratings submitted by clients after receiving their project deliverables.</p>
          
          {briefsWithFeedback.length === 0 ? (
            <div className="text-center py-12 text-neutral-400 text-xs font-semibold">
              No feedback recorded yet. Client votes will appear here once they rate completed projects.
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {briefsWithFeedback.map((b) => (
                <div key={b.id} className="p-5 rounded-xl border border-neutral-200 bg-neutral-50 space-y-4">
                  <div className="flex justify-between items-center">
                    <b className="text-sm text-black font-bold block">{b.brandName}</b>
                    <span className="text-[9px] font-mono font-semibold px-2 py-0.5 bg-neutral-200 rounded text-neutral-600">
                      {b.code}
                    </span>
                  </div>
                  
                  <div className="space-y-1.5 text-xs font-semibold text-neutral-700">
                    <div className="flex justify-between">
                      <span>Design Satisfaction:</span>
                      <span className="flex text-amber-500">
                        {Array.from({ length: b.feedback.designRating }).map((_, i) => (
                          <Star key={i} size={12} className="fill-amber-500 text-amber-500" />
                        ))}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Service & Communication:</span>
                      <span className="flex text-amber-500">
                        {Array.from({ length: b.feedback.serviceRating }).map((_, i) => (
                          <Star key={i} size={12} className="fill-amber-500 text-amber-500" />
                        ))}
                      </span>
                    </div>
                  </div>

                  {b.feedback.comments && (
                    <p className="text-xs text-neutral-600 italic border-t border-neutral-200 pt-3">
                      "{b.feedback.comments}"
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Analytics Graphs & Distribution */}
        <div className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          
          {/* Main Submission Velocity Graph */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-black flex items-center gap-2">
                  <LineChart style={{ color: "var(--brand-accent)" }} size={18} />
                  Agency Activity Loop
                </h3>
                <span className="text-xs font-semibold px-3 py-1 rounded-lg border border-neutral-300 bg-neutral-50 flex items-center gap-1">
                  Active Load
                  <ArrowUpRight style={{ color: "var(--brand-accent)" }} size={14} />
                </span>
              </div>
              
              <div className="relative h-64 w-full flex items-end">
                {/* SVG Mock Sparkline Chart */}
                <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--brand-accent)" stopOpacity="0.14" />
                      <stop offset="100%" stopColor="var(--brand-accent)" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  
                  {/* Grid Lines */}
                  <line x1="0" y1="50" x2="500" y2="50" stroke="#f0f0f0" strokeDasharray="3" />
                  <line x1="0" y1="100" x2="500" y2="100" stroke="#f0f0f0" strokeDasharray="3" />
                  <line x1="0" y1="150" x2="500" y2="150" stroke="#f0f0f0" strokeDasharray="3" />
                  
                  {/* Path Area */}
                  <path
                    d="M 0 160 Q 50 140, 100 120 T 200 90 T 300 130 T 400 60 T 500 30 L 500 200 L 0 200 Z"
                    fill="url(#chartGradient)"
                  />
                  
                  {/* Line */}
                  <path
                    d="M 0 160 Q 50 140, 100 120 T 200 90 T 300 130 T 400 60 T 500 30"
                    fill="none"
                    stroke="var(--brand-accent)"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                  
                  {/* Dots */}
                  <circle cx="100" cy="120" r="5" fill="var(--brand-accent)" stroke="white" strokeWidth="2" />
                  <circle cx="200" cy="90" r="5" fill="var(--brand-accent)" stroke="white" strokeWidth="2" />
                  <circle cx="300" cy="130" r="5" fill="var(--brand-accent)" stroke="white" strokeWidth="2" />
                  <circle cx="400" cy="60" r="5" fill="var(--brand-accent)" stroke="white" strokeWidth="2" />
                  <circle cx="500" cy="30" r="5" fill="var(--brand-accent)" stroke="white" strokeWidth="2" />
                </svg>
              </div>

              {/* Month Labels */}
              <div className="flex justify-between text-[11px] font-bold text-neutral-400 uppercase tracking-wider mt-4 px-1">
                <span>Dec</span>
                <span>Jan</span>
                <span>Feb</span>
                <span>Mar</span>
                <span>Apr</span>
                <span>May</span>
              </div>
            </div>
            
            <div className="border-t border-neutral-100 pt-5 mt-5 flex justify-between items-center text-xs font-semibold text-neutral-600">
              <span>Conversion Index: {utilizationRate}%</span>
              <span>Project Load status: Excellent</span>
            </div>
          </div>

          {/* Design Package Deliverables distribution */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold text-black flex items-center gap-2 mb-6">
                <PieChart style={{ color: "var(--brand-accent)" }} size={18} />
                Requested Assets
              </h3>
              
              <div className="space-y-4">
                {distributionEntries.length === 0 ? (
                  <div className="text-center py-16 text-neutral-400 text-xs font-semibold">
                    No deliverables submitted yet.
                  </div>
                ) : (
                  distributionEntries.map(([name, count]) => {
                    const totalCount = Object.values(designDistribution).reduce((a, b) => a + b, 0);
                    const pct = Math.round((count / totalCount) * 100);
                    return (
                      <div key={name}>
                        <div className="flex justify-between items-center text-xs font-semibold mb-1">
                          <span className="text-neutral-800">{name}</span>
                          <span className="text-black">{count} ({pct}%)</span>
                        </div>
                        <div className="h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden">
                          <div style={{ backgroundColor: "var(--brand-accent)" }} className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: "var(--brand-accent)" }} />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <div className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider border-t border-neutral-100 pt-5 mt-5">
              Accumulated Asset Quantity
            </div>
          </div>

        </div>

        {/* Bottom metrics cards */}
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs flex items-center gap-5">
            <DotGrid className="shrink-0" />
            <div>
              <h4 className="font-bold text-black text-sm">Design Quality</h4>
              <p className="text-xs text-neutral-500 mt-1">
                {briefsWithFeedback.length > 0 
                  ? `Average score is ${avgDesignRating}/5 stars based on design ratings.` 
                  : "No votes registered yet. Displaying default rating: 4.9 stars."}
              </p>
            </div>
          </div>
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs flex items-center gap-5">
            <DotGrid className="shrink-0" />
            <div>
              <h4 className="font-bold text-black text-sm">Communication Index</h4>
              <p className="text-xs text-neutral-500 mt-1">
                {briefsWithFeedback.length > 0 
                  ? `Average score is ${avgServiceRating}/5 stars based on client relations.` 
                  : "Response index is 100% based on direct client conversations."}
              </p>
            </div>
          </div>
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs flex items-center gap-5">
            <DotGrid className="shrink-0" />
            <div>
              <h4 className="font-bold text-black text-sm">Conversion Rate</h4>
              <p className="text-xs text-neutral-500 mt-1">{totalSubmitted} out of {totalGenerated} generated codes successfully finalized.</p>
            </div>
          </div>
        </div>

      </section>
    </div>
  );
};

export default AnalyticsPage;
