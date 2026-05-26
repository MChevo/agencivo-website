import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import Sidebar from "../components/Sidebar";
import Button from "../components/Button";
import DotField from "../components/DotField";
import { Users, Shield, Plus, Key, Check, AlertCircle, Trash } from "lucide-react";

export const TeamPage = () => {
  const { team, addTeamMember, user } = useApp();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roleDescription, setRoleDescription] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState(["clients", "briefs", "projects", "messages"]);
  
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // States for editing permissions
  const [editingMemberEmail, setEditingMemberEmail] = useState(null);
  const [editingPermissions, setEditingPermissions] = useState([]);

  const permissionOptions = [
    { id: "clients", label: "Clients Page" },
    { id: "briefs", label: "Briefs Page" },
    { id: "projects", label: "Projects Page" },
    { id: "team", label: "Team Page" },
    { id: "messages", label: "Messages Page" },
    { id: "analytics", label: "Analytics Page" },
    { id: "templates", label: "Templates Page" },
    { id: "settings", label: "Settings Page" }
  ];

  const handlePermissionChange = (id) => {
    if (selectedPermissions.includes(id)) {
      setSelectedPermissions(selectedPermissions.filter(p => p !== id));
    } else {
      setSelectedPermissions([...selectedPermissions, id]);
    }
  };

  const handleEditPermissionChange = (id) => {
    if (editingPermissions.includes(id)) {
      setEditingPermissions(editingPermissions.filter(p => p !== id));
    } else {
      setEditingPermissions([...editingPermissions, id]);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    if (!email || !password || !roleDescription) {
      setError("Please fill all required fields.");
      return;
    }

    setLoading(true);
    const result = await addTeamMember(email, password, selectedPermissions, roleDescription);
    setLoading(false);

    if (result.success) {
      setSuccess(`Successfully invited ${email}!`);
      setEmail("");
      setPassword("");
      setRoleDescription("");
      setSelectedPermissions(["clients", "briefs", "projects", "messages"]);
    } else {
      setError(result.error || "Failed to add team member.");
    }
  };

  const handleSavePermissions = async (memberEmail) => {
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`/api/team/${memberEmail}/permissions`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-User-Email": user.email
        },
        body: JSON.stringify({ permissions: editingPermissions })
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(`Permissions updated for ${memberEmail}`);
        setEditingMemberEmail(null);
        // Page polls every 5s, but we can trigger a manual page reload/update context if needed.
        // Wait, context polls team list every 5s so it will sync shortly.
      } else {
        setError(data.error || "Failed to update permissions.");
      }
    } catch (e) {
      setError("Network error occurred.");
    }
  };

  const isManager = user?.role === "Manager";

  return (
    <div className="flex min-h-screen bg-[#fbfbfa] w-full">
      <Sidebar />
      <section className="relative flex-1 overflow-x-hidden p-6 md:p-10">
        <DotField className="right-0 top-20 h-80 w-72" dense />

        <div className="mt-6 lg:mt-10">
          <h1 className="text-4xl font-black tracking-[-0.04em] text-black">Team Management</h1>
          <p className="text-neutral-500 text-sm mt-2">
            {isManager 
              ? "Add agency members, edit roles, and assign specific page permissions." 
              : "View team members and roles at your agency."}
          </p>
        </div>

        {error && (
          <div className="mt-6 p-4 rounded-xl border border-red-200 bg-red-50 flex items-center gap-3 text-red-700 text-sm">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mt-6 p-4 rounded-xl border border-green-200 bg-green-50 flex items-center gap-3 text-green-700 text-sm">
            <Check size={18} />
            <span>{success}</span>
          </div>
        )}

        <div className="mt-8 grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
          {/* Team Members List */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs">
            <h3 className="text-xl font-bold text-black mb-6">Active Team Members</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-neutral-200 text-xs font-bold text-neutral-500 uppercase">
                    <th className="pb-4">User</th>
                    <th className="pb-4">Role</th>
                    <th className="pb-4">Authorized Pages</th>
                    {isManager && <th className="pb-4 text-right">Actions</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 text-sm text-neutral-800">
                  {team.map((member) => (
                    <tr key={member.email} className="hover:bg-neutral-50/50 transition-colors">
                      <td className="py-4">
                        <div className="font-bold text-black">{member.email}</div>
                        <div className="text-xs text-neutral-400 mt-0.5">
                          {member.email === user?.email ? "You" : ""}
                        </div>
                      </td>
                      <td className="py-4">
                        <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
                          member.role === "Manager" 
                            ? "bg-black text-white" 
                            : "bg-neutral-100 text-neutral-800 border border-neutral-200"
                        }`}>
                          {member.role === "Manager" && <Shield size={12} />}
                          {member.role}
                        </span>
                      </td>
                      <td className="py-4">
                        {editingMemberEmail === member.email ? (
                          <div className="grid grid-cols-2 gap-2 mt-1 max-w-sm">
                            {permissionOptions.map((opt) => (
                              <label key={opt.id} className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={editingPermissions.includes(opt.id)}
                                  onChange={() => handleEditPermissionChange(opt.id)}
                                  className="rounded border-neutral-300 text-black focus:ring-black"
                                />
                                {opt.label}
                              </label>
                            ))}
                          </div>
                        ) : (
                          <div className="flex flex-wrap gap-1.5 max-w-md">
                            {member.role === "Manager" ? (
                              <span className="text-xs text-neutral-500 italic">Full Access (All Pages)</span>
                            ) : member.permissions && member.permissions.length > 0 ? (
                              member.permissions.map((p) => (
                                <span key={p} className="text-[10px] font-bold px-2 py-0.5 bg-neutral-100 border border-neutral-200 rounded-md uppercase tracking-wider">
                                  {p}
                                </span>
                              ))
                            ) : (
                              <span className="text-xs text-red-500 font-semibold">No Pages Authorized</span>
                            )}
                          </div>
                        )}
                      </td>
                      {isManager && (
                        <td className="py-4 text-right">
                          {member.role !== "Manager" && (
                            <>
                              {editingMemberEmail === member.email ? (
                                <div className="flex items-center justify-end gap-2">
                                  <Button 
                                    onClick={() => handleSavePermissions(member.email)}
                                    className="py-1 px-3 text-xs"
                                  >
                                    Save
                                  </Button>
                                  <Button 
                                    variant="light"
                                    onClick={() => setEditingMemberEmail(null)}
                                    className="py-1 px-3 text-xs border border-neutral-200"
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              ) : (
                                <Button 
                                  variant="light"
                                  onClick={() => {
                                    setEditingMemberEmail(member.email);
                                    setEditingPermissions(member.permissions || []);
                                  }}
                                  className="py-1.5 px-3 text-xs border border-neutral-200 hover:border-black"
                                >
                                  Edit Permissions
                                </Button>
                              )}
                            </>
                          )}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Add Team Member (Manager Only) */}
          {isManager ? (
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs h-fit">
              <h3 className="text-xl font-bold text-black mb-2">Invite Member</h3>
              <p className="text-xs text-neutral-500 mb-6">Create a login profile for a new team member and restrict their views.</p>
              
              <form onSubmit={handleAddMember} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="designer@youragency.com"
                    className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm outline-none focus:border-black"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-2">
                    Temporary Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm outline-none focus:border-black"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-2">
                    Role Description
                  </label>
                  <input
                    type="text"
                    value={roleDescription}
                    onChange={(e) => setRoleDescription(e.target.value)}
                    placeholder="Graphic Designer, Copywriter, etc."
                    className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm outline-none focus:border-black"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-3">
                    Permissions (Access Limits)
                  </label>
                  <div className="grid grid-cols-2 gap-3 bg-neutral-50/50 p-4 rounded-xl border border-neutral-200">
                    {permissionOptions.map((opt) => (
                      <label key={opt.id} className="flex items-center gap-2.5 text-xs font-semibold text-neutral-700 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={selectedPermissions.includes(opt.id)}
                          onChange={() => handlePermissionChange(opt.id)}
                          className="rounded border-neutral-300 text-black focus:ring-black h-4 w-4"
                        />
                        {opt.label}
                      </label>
                    ))}
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full py-3.5 mt-2 flex items-center justify-center gap-2"
                  disabled={loading}
                >
                  <Plus size={16} />
                  {loading ? "Adding Member..." : "Add Team Member"}
                </Button>
              </form>
            </div>
          ) : (
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs h-fit text-center">
              <Shield className="mx-auto text-neutral-400 mb-3" size={32} />
              <h4 className="font-bold text-black">Restricted Action</h4>
              <p className="text-xs text-neutral-500 mt-2">
                Only the main Agency Manager account can invite new team members or modify roles.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default TeamPage;
