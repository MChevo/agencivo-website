import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import Sidebar from "../components/Sidebar";
import Button from "../components/Button";
import DotField from "../components/DotField";
import { Search, Folder } from "lucide-react";

export const ProjectsPage = () => {
  const { briefs, go, setSelectedBriefId } = useApp();
  const [tab, setTab] = useState("active"); // active, completed
  const [searchQuery, setSearchQuery] = useState("");

  const projectBriefs = briefs.filter(
    (b) => {
      const isProject = b.status === "In Progress" || b.status === "Completed" || b.status === "Review";
      const matchesTab = tab === "active" 
        ? b.status === "In Progress" || b.status === "Review" 
        : b.status === "Completed";
      
      const matchesSearch =
        b.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.projectType.toLowerCase().includes(searchQuery.toLowerCase());
      
      return isProject && matchesTab && matchesSearch;
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
        
        <div className="mt-6 lg:mt-10">
          <h1 className="text-4xl font-black tracking-[-0.04em] text-black">Projects</h1>
          <p className="text-neutral-500 text-sm mt-2">Track active production pipelines and client deliverables.</p>
        </div>

        {/* Tab switchers & search */}
        <div className="mt-8 flex justify-between items-center flex-wrap gap-4 border-b border-neutral-200 pb-3">
          <div className="flex gap-6 text-sm font-semibold">
            <button
              onClick={() => setTab("active")}
              className={`pb-3 border-b-2 transition-colors ${
                tab === "active" ? "border-black text-black" : "border-transparent text-neutral-400 hover:text-black"
              }`}
            >
              Active Projects
            </button>
            <button
              onClick={() => setTab("completed")}
              className={`pb-3 border-b-2 transition-colors ${
                tab === "completed" ? "border-b-2 border-black text-black" : "border-transparent text-neutral-400 hover:text-black"
              }`}
            >
              Completed Projects
            </button>
          </div>
          <div className="rounded-xl border border-neutral-300 bg-white px-3 py-2 flex items-center w-full max-w-xs focus-within:border-black">
            <Search className="mr-2 text-neutral-400 shrink-0" size={16} />
            <input
              className="w-full outline-none text-xs text-neutral-800"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Projects list */}
        <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs">
          {projectBriefs.length === 0 ? (
            <div className="text-center py-16 text-neutral-400">
              <Folder className="mx-auto text-neutral-300 mb-4" size={40} />
              <p className="font-semibold text-neutral-800">No {tab} projects found.</p>
              <p className="text-xs mt-1">Projects will show here once clients submit requirements.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-neutral-200 text-xs font-bold text-neutral-500 uppercase">
                    <th className="pb-4">Brand</th>
                    <th className="pb-4">Deliverables Package</th>
                    <th className="pb-4">Access Code</th>
                    <th className="pb-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 text-sm text-neutral-800">
                  {projectBriefs.map((project) => (
                    <tr
                      key={project.id}
                      onClick={() => handleRowClick(project.id)}
                      className="hover:bg-neutral-50/50 transition-colors cursor-pointer"
                    >
                      <td className="py-4 font-bold text-black">{project.brandName}</td>
                      <td className="py-4 text-neutral-600">{project.projectType}</td>
                      <td className="py-4 font-mono text-neutral-500 font-semibold">{project.code}</td>
                      <td className="py-4">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                          project.status === "In Progress"
                            ? "bg-blue-50 text-blue-600 border border-blue-100"
                            : project.status === "Review"
                            ? "bg-amber-50 text-amber-600 border border-amber-100"
                            : "bg-green-50 text-green-600 border border-green-100"
                        }`}>
                          {project.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ProjectsPage;
