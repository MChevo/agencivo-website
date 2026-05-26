import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import Sidebar from "../components/Sidebar";
import Button from "../components/Button";
import DotField from "../components/DotField";
import { Search, BriefcaseBusiness } from "lucide-react";

export const BriefsPage = () => {
  const { briefs, go, setSelectedBriefId } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredBriefs = briefs.filter(
    (b) => {
      const matchesSearch =
        b.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.projectType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (b.code && b.code.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesStatus = statusFilter === "all" || b.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    }
  );

  const handleRowClick = (briefId) => {
    setSelectedBriefId(briefId);
    go("details");
  };

  return (
    <div className="flex min-h-screen bg-[#fbfbfa] w-full">
      <Sidebar />
      <section className="relative flex-1 overflow-x-hidden p-6 md:p-10">
        <DotField className="right-0 top-20 h-80 w-72" dense />
        
        <div className="mt-6 lg:mt-10 flex justify-between items-center flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-black tracking-[-0.04em] text-black">Client Briefs</h1>
            <p className="text-neutral-500 text-sm mt-2">Manage, filter, and review project requirements submitted by your clients.</p>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-8 flex gap-4 flex-wrap items-center">
          <div className="flex-1 max-w-sm rounded-xl border border-neutral-300 bg-white px-4 py-2.5 flex items-center focus-within:border-black">
            <Search className="mr-2 text-neutral-400 shrink-0" size={16} />
            <input
              className="w-full outline-none text-xs text-neutral-800"
              placeholder="Search briefs, clients, or codes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2 text-xs font-semibold">
            {["all", "Code Unused", "In Progress", "Review", "Completed"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-xl border transition-all ${
                  statusFilter === status
                    ? "bg-black text-white border-black"
                    : "bg-white border-neutral-200 text-neutral-600 hover:border-black"
                }`}
              >
                {status === "all" ? "All Briefs" : status}
              </button>
            ))}
          </div>
        </div>

        {/* Briefs Table */}
        <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs">
          {filteredBriefs.length === 0 ? (
            <div className="text-center py-16 text-neutral-400">
              <BriefcaseBusiness className="mx-auto text-neutral-300 mb-4" size={40} />
              <p className="font-semibold text-neutral-800">No briefs found.</p>
              <p className="text-xs mt-1">Try adjusting your filters or search terms.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-neutral-200 text-xs font-bold text-neutral-500 uppercase">
                    <th className="pb-4">Brand</th>
                    <th className="pb-4">Project Type</th>
                    <th className="pb-4">Project Code</th>
                    <th className="pb-4">Date</th>
                    <th className="pb-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 text-sm text-neutral-800">
                  {filteredBriefs.map((brief) => {
                    const dateFormatted = new Date(brief.submittedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric"
                    });
                    return (
                      <tr
                        key={brief.id}
                        onClick={() => handleRowClick(brief.id)}
                        className="hover:bg-neutral-50/50 transition-colors cursor-pointer"
                      >
                        <td className="py-4 font-bold text-black">
                          {brief.brandName === "Pending Client" ? `Pending Client` : brief.brandName}
                        </td>
                        <td className="py-4 text-neutral-600">{brief.projectType}</td>
                        <td className="py-4 font-mono font-semibold text-neutral-600">{brief.code || "N/A"}</td>
                        <td className="py-4 text-neutral-500">{dateFormatted}</td>
                        <td className="py-4">
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                            brief.status === "Code Unused"
                              ? "bg-neutral-100 text-neutral-500 border border-neutral-200"
                              : brief.status === "In Progress"
                              ? "bg-blue-50 text-blue-600 border border-blue-100"
                              : brief.status === "Review"
                              ? "bg-amber-50 text-amber-600 border border-amber-100"
                              : "bg-green-50 text-green-600 border border-green-100"
                          }`}>
                            {brief.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default BriefsPage;
