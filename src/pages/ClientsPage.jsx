import React from "react";
import { useApp } from "../context/AppContext";
import Sidebar from "../components/Sidebar";
import Button from "../components/Button";
import DotField from "../components/DotField";
import { Users, FileText, Calendar } from "lucide-react";

export const ClientsPage = () => {
  const { briefs } = useApp();

  // Extract unique client details from submitted briefs
  const clientNames = [...new Set(briefs.filter(b => b.brandName !== "Pending Client").map(b => b.brandName))];

  const clientsData = clientNames.map(name => {
    const clientBriefs = briefs.filter(b => b.brandName === name);
    const activeBrief = clientBriefs[0] || {};
    return {
      name,
      projectCount: clientBriefs.length,
      lastSubmitted: activeBrief.submittedAt,
      status: activeBrief.status,
      code: activeBrief.code
    };
  });

  return (
    <div className="flex min-h-screen bg-[#fbfbfa] w-full">
      <Sidebar />
      <section className="relative flex-1 overflow-x-hidden p-6 md:p-10">
        <DotField className="right-0 top-20 h-80 w-72" dense />
        
        <div className="mt-6 lg:mt-10">
          <h1 className="text-4xl font-black tracking-[-0.04em] text-black">Clients</h1>
          <p className="text-neutral-500 text-sm mt-2">Manage your client relationships, project scopes, and credentials.</p>
        </div>

        <div className="mt-10 rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs">
          {clientsData.length === 0 ? (
            <div className="text-center py-16 text-neutral-400">
              <Users className="mx-auto text-neutral-300 mb-4" size={40} />
              <p className="font-semibold text-neutral-800">No active clients yet.</p>
              <p className="text-xs mt-1">Clients will appear here once they complete a brief using a generated code.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-neutral-200 text-xs font-bold text-neutral-500 uppercase">
                    <th className="pb-4">Client Brand</th>
                    <th className="pb-4">Active Projects</th>
                    <th className="pb-4">Project Access Code</th>
                    <th className="pb-4">Last Activity</th>
                    <th className="pb-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 text-sm text-neutral-800">
                  {clientsData.map((client) => {
                    const dateStr = new Date(client.lastSubmitted).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric"
                    });
                    return (
                      <tr key={client.name} className="hover:bg-neutral-50/50 transition-colors">
                        <td className="py-4 font-bold text-black flex items-center gap-3">
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-xs font-semibold text-white uppercase">
                            {client.name.charAt(0)}
                          </span>
                          {client.name}
                        </td>
                        <td className="py-4">{client.projectCount} Brief(s)</td>
                        <td className="py-4 font-mono font-semibold text-neutral-600">{client.code || "N/A"}</td>
                        <td className="py-4 text-neutral-500">{dateStr}</td>
                        <td className="py-4">
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                            client.status === "In Progress"
                              ? "bg-blue-50 text-blue-600 border border-blue-100"
                              : client.status === "Completed"
                              ? "bg-green-50 text-green-600 border border-green-100"
                              : "bg-[#ff6a00]/10 text-[#ff6a00]"
                          }`}>
                            {client.status}
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

export default ClientsPage;
