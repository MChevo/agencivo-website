import React, { useState } from "react";
import {
  Bell,
  Search,
  Key,
  Copy,
  Check,
  BriefcaseBusiness,
  Folder,
  CheckCircle2,
  Users,
  LogOut,
  Menu,
  X
} from "lucide-react";
import { useApp } from "../context/AppContext";
import Sidebar from "../components/Sidebar";
import Button from "../components/Button";
import DotField from "../components/DotField";
import Logo from "../components/Logo";

// Notification items component
const NotificationsList = ({ notifications, onNotifClick, onMarkAllRead }) => (
  <div className="rounded-2xl border border-neutral-200 bg-white p-6">
    <div className="flex justify-between items-center mb-5">
      <h3 className="text-xl font-bold text-black">Notifications</h3>
      <button onClick={onMarkAllRead} className="text-xs font-semibold text-neutral-500 hover:text-black focus:outline-none">
        Mark all read
      </button>
    </div>
    <div className="space-y-6 max-h-[350px] overflow-y-auto pr-1">
      {notifications.length === 0 ? (
        <div className="text-center py-10 text-neutral-400 text-xs font-medium">
          No new notifications
        </div>
      ) : (
        notifications.map((notif) => (
          <button
            key={notif.id}
            onClick={() => onNotifClick(notif)}
            className="flex gap-4 text-left w-full hover:bg-neutral-50 p-1.5 rounded-lg transition-all focus:outline-none focus:ring-1 focus:ring-black"
          >
            <span
              className={`mt-1 h-5 w-5 rounded-full border shrink-0 ${
                notif.unread
                  ? "border-[#ff6a00] bg-[#ff6a00]/10 flex items-center justify-center after:content-[''] after:w-2 after:h-2 after:bg-[#ff6a00] after:rounded-full"
                  : "border-neutral-300 bg-neutral-50"
              }`}
            />
            <div>
              <b className="text-sm font-semibold text-black">{notif.title}</b>
              <p className="text-xs text-neutral-600 mt-1">{notif.desc}</p>
              <p className="text-[10px] text-neutral-400 mt-1">{notif.time}</p>
            </div>
          </button>
        ))
      )}
    </div>
  </div>
);

// Dynamic Project Status Chart Component
const ProjectStatus = ({ briefs }) => {
  const total = briefs.length;
  const inProgress = briefs.filter(b => b.status === "In Progress").length;
  const completed = briefs.filter(b => b.status === "Completed").length;
  const inReview = briefs.filter(b => b.status === "Review").length;
  const isNew = briefs.filter(b => b.status === "New").length;
  const unused = briefs.filter(b => b.status === "Code Unused").length;

  // Calculations for donut chart gradient
  const totalWithFallbacks = total > 0 ? total : 1;
  const inProgressPct = Math.round((inProgress / totalWithFallbacks) * 100);
  const completedPct = Math.round((completed / totalWithFallbacks) * 100);
  const reviewPct = Math.round(((inReview + isNew) / totalWithFallbacks) * 100);
  const unusedPct = Math.round((unused / totalWithFallbacks) * 100);

  const gradient = `conic-gradient(
    #050505 0% ${inProgressPct}%, 
    #777777 ${inProgressPct}% ${inProgressPct + reviewPct}%, 
    #aaaaaa ${inProgressPct + reviewPct}% ${inProgressPct + reviewPct + completedPct}%, 
    #dddddd ${inProgressPct + reviewPct + completedPct}% 100%
  )`;

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-6 flex flex-col justify-between">
      <div>
        <h3 className="text-xl font-bold text-black">Project Status</h3>
        <div className="mt-6 flex items-center justify-between gap-6 flex-wrap md:flex-nowrap">
          <div
            className="flex h-36 w-36 shrink-0 items-center justify-center rounded-full"
            style={{ background: total > 0 ? gradient : "#eee" }}
          >
            <div className="flex h-24 w-24 flex-col items-center justify-center rounded-full bg-white shadow-inner">
              <b className="text-3xl font-black text-black">{total}</b>
              <span className="text-[10px] text-neutral-500 uppercase font-bold tracking-wider">Total Tasks</span>
            </div>
          </div>
          <div className="space-y-2 text-xs font-semibold text-neutral-800">
            <p className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-black block" />
              {inProgress} In Progress ({inProgressPct}%)
            </p>
            <p className="flex items-center gap-2 text-neutral-600">
              <span className="h-2.5 w-2.5 rounded-full bg-[#777] block" />
              {inReview + isNew} In Review ({reviewPct}%)
            </p>
            <p className="flex items-center gap-2 text-neutral-500">
              <span className="h-2.5 w-2.5 rounded-full bg-[#aaa] block" />
              {completed} Completed ({completedPct}%)
            </p>
            <p className="flex items-center gap-2 text-neutral-400">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ddd] block" />
              {unused} Unused Codes ({unusedPct}%)
            </p>
          </div>
        </div>
      </div>
      <Button variant="light" className="mt-5 w-full">
        View All Projects
      </Button>
    </div>
  );
};

export const DashboardPage = () => {
  const {
    go,
    briefs,
    setSelectedBriefId,
    notifications,
    setNotifications,
    generateProjectCode,
    markAllNotificationsRead,
    user
  } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Project code generator banner state
  const [generatedCode, setGeneratedCode] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGenerateCode = async () => {
    const code = await generateProjectCode();
    setGeneratedCode(code);
    setCopied(false);
  };

  const handleCopyCode = () => {
    if (!generatedCode) return;
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Mark a specific notification as read and open brief
  const handleNotifClick = (notif) => {
    setNotifications(
      notifications.map((n) => (n.id === notif.id ? { ...n, unread: false } : n))
    );
    if (notif.briefId) {
      setSelectedBriefId(notif.briefId);
      go("details");
    }
  };

  const handleMarkAllRead = () => {
    markAllNotificationsRead();
  };

  const handleBriefClick = (brief) => {
    setSelectedBriefId(brief.id);
    go("details");
  };

  // Filter briefs based on search query
  const filteredBriefs = briefs.filter(
    (b) =>
      b.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.projectType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.code && b.code.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Computations
  const activeCount = briefs.filter((b) => b.status === "In Progress" || b.status === "Review").length;
  const inProgressCount = briefs.filter((b) => b.status === "In Progress").length;
  const completedCount = briefs.filter((b) => b.status === "Completed").length;
  const unusedCount = briefs.filter((b) => b.status === "Code Unused").length;
  const unreadNotifCount = notifications.filter((n) => n.unread).length;

  // Real satisfaction rate from client voting feedback
  const submittedBriefs = briefs.filter((b) => !b.isCodeOnly);
  const briefsWithFeedback = submittedBriefs.filter((b) => b.feedback);
  let satisfactionIndex = 98.4; // Default baseline if no reviews
  if (briefsWithFeedback.length > 0) {
    const totalDesign = briefsWithFeedback.reduce((sum, b) => sum + b.feedback.designRating, 0);
    const totalService = briefsWithFeedback.reduce((sum, b) => sum + b.feedback.serviceRating, 0);
    const totalPossibleStars = briefsWithFeedback.length * 10;
    const totalReceivedStars = totalDesign + totalService;
    satisfactionIndex = Number(((totalReceivedStars / totalPossibleStars) * 100).toFixed(1));
  }

  return (
    <div className="flex min-h-screen bg-[#fbfbfa] w-full">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden bg-black/50 backdrop-blur-xs">
          <aside className="w-[260px] bg-[#fbfbfa] p-8 border-r border-neutral-200 relative h-full flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex justify-between items-center mb-10">
                <Logo />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-lg border hover:bg-neutral-100 focus:outline-none"
                  aria-label="Close menu"
                >
                  <X size={18} />
                </button>
              </div>
              <nav className="space-y-3">
                {[
                  { label: "Dashboard", target: "dashboard" },
                  { label: "Clients", target: "clients" },
                  { label: "Briefs", target: "briefs" },
                  { label: "Projects", target: "projects" },
                  { label: "Team", target: "team" },
                  { label: "Messages", target: "messages" },
                  { label: "Analytics", target: "analytics" },
                  { label: "Templates", target: "templates" },
                  { label: "Settings", target: "settings" }
                ].filter(item => {
                  if (user && user.role === "Member") {
                    if (item.target === "dashboard") return true;
                    return user.permissions?.includes(item.target);
                  }
                  return true;
                }).map(({ label, target }) => (
                  <button
                    key={label}
                    onClick={() => {
                      setMobileMenuOpen(false);
                      go(target);
                    }}
                    className="flex w-full items-center gap-4 rounded-xl px-4 py-3 text-left text-sm font-semibold text-neutral-700 hover:bg-white focus:outline-none"
                  >
                    {label}
                  </button>
                ))}
              </nav>
            </div>
            <div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  go("home");
                }}
                className="flex items-center gap-3 text-sm font-semibold text-neutral-600 hover:text-black py-4 border-t w-full"
              >
                <LogOut size={17} /> Log out
              </button>
            </div>
          </aside>
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}

      {/* Main Content Area */}
      <section className="relative flex-1 overflow-x-hidden p-6 md:p-10">
        <DotField className="right-0 top-20 h-80 w-72" dense />

        {/* Mobile Header Bar */}
        <div className="flex items-center justify-between lg:hidden mb-6 bg-white border border-neutral-200 rounded-xl px-4 py-3 shadow-xs">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-1.5 rounded-lg border hover:bg-neutral-50"
            aria-label="Open navigation menu"
          >
            <Menu size={20} />
          </button>
          <Logo compact />
          <div className="relative">
            <Bell size={18} />
            {unreadNotifCount > 0 && (
              <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-[#ff6a00]" />
            )}
          </div>
        </div>

        {/* Header Search & User Menu */}
        <div className="hidden lg:flex items-center justify-between gap-8">
          <div className="flex-1 max-w-[560px] rounded-xl border border-neutral-300 bg-white px-5 py-3 flex items-center focus-within:border-black">
            <Search className="mr-3 text-neutral-400 shrink-0" size={18} />
            <input
              className="w-full outline-none text-sm text-neutral-800"
              placeholder="Search briefs, clients, projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search briefs, clients, and projects"
            />
          </div>
          <div className="flex items-center gap-5">
            <div className="relative cursor-pointer hover:opacity-80">
              <Bell />
              {unreadNotifCount > 0 && (
                <span className="absolute -right-1 -top-2 rounded-full bg-[#ff6a00] px-1.5 text-[9px] font-bold text-white">
                  {unreadNotifCount}
                </span>
              )}
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-black font-bold text-sm bg-white select-none">
              AV
            </div>
          </div>
        </div>

        {/* Search Bar for Mobile layout */}
        <div className="flex lg:hidden rounded-xl border border-neutral-300 bg-white px-4 py-2.5 items-center mb-6 focus-within:border-black">
          <Search className="mr-2 text-neutral-400 shrink-0" size={16} />
          <input
            className="w-full outline-none text-sm text-neutral-800"
            placeholder="Search briefs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search briefs"
          />
        </div>

        {/* Welcome Section */}
        <div className="mt-6 lg:mt-10 flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-black tracking-[-0.04em] text-black">Dashboard</h1>
            <p className="mt-3 text-xl text-neutral-800">Welcome back, Alex.</p>
            <p className="text-neutral-500 text-sm">Here’s what’s happening with your agency.</p>
          </div>
          <p className="hidden text-base leading-6 text-neutral-700 text-right lg:block">
            Built for agencies.
            <br />
            Designed for clarity.
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            [BriefcaseBusiness, activeCount, "Active Projects", "Submitted briefs in reviews"],
            [Folder, inProgressCount, "In Progress", "Currently in production"],
            [CheckCircle2, completedCount, "Completed", "Successfully delivered"],
            [Users, unusedCount, "Unused Codes", "Generated codes pending client setup"]
          ].map(([Icon, n, t, s], idx) => (
            <div key={idx} className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-black text-white">
                <Icon size={20} />
              </div>
              <div className="mt-4 text-3xl font-black text-black">{n}</div>
              <div className="text-base font-semibold text-neutral-900 mt-1">{t}</div>
              <p className="mt-2 text-xs text-neutral-500">• {s}</p>
            </div>
          ))}
        </div>

        {/* Middle Activity Layout */}
        <div className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          {/* Recent Briefs / Tasks Table */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-xl font-bold text-black">Recent Tasks & Codes</h3>
                <span className="text-xs font-semibold text-neutral-400">
                  Showing {filteredBriefs.length}
                </span>
              </div>
              <div className="divide-y divide-neutral-100 max-h-[350px] overflow-y-auto pr-1">
                {filteredBriefs.length === 0 ? (
                  <div className="text-center py-16 text-neutral-500 text-sm">
                    <p className="font-semibold text-neutral-800">No tasks or briefs created yet.</p>
                    <p className="text-xs text-neutral-500 mt-1">Use the code generator to generate an active project code for clients.</p>
                  </div>
                ) : (
                  filteredBriefs.map((brief) => {
                    const dateFormatted = new Date(brief.submittedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric"
                    });
                    return (
                      <button
                        key={brief.id}
                        onClick={() => handleBriefClick(brief)}
                        className="grid w-full grid-cols-[1fr_auto_auto] items-center gap-4 py-4 text-left hover:bg-neutral-50/50 transition-all focus:outline-none focus:bg-neutral-50 px-2 rounded-lg"
                      >
                        <div>
                          <b className="text-sm text-black block">
                            {brief.brandName === "Pending Client" ? `Pending Client (Code: ${brief.code})` : brief.brandName}
                          </b>
                          <p className="text-xs text-neutral-600 mt-0.5">{brief.projectType}</p>
                        </div>
                        <span className="text-xs text-neutral-500">{dateFormatted}</span>
                        <span
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                            brief.status === "Code Unused"
                              ? "bg-neutral-100 text-neutral-600 border border-neutral-200"
                              : brief.status === "New" || brief.status === "Review"
                              ? "bg-[#ff6a00]/10 text-[#ff6a00]"
                              : brief.status === "In Progress"
                              ? "bg-blue-50 text-blue-600 border border-blue-100"
                              : "bg-green-50 text-green-600 border border-green-100"
                          }`}
                        >
                          {brief.status}
                        </span>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
            <div className="mt-5 border-t border-neutral-100 pt-4">
              <Button variant="light" className="w-full py-2.5 text-xs">
                View all tasks
              </Button>
            </div>
          </div>

          {/* Notifications Side */}
          <NotificationsList
            notifications={notifications}
            onNotifClick={handleNotifClick}
            onMarkAllRead={handleMarkAllRead}
          />
        </div>

        {/* Bottom charts & Info */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr_1fr]">
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 flex flex-col justify-between">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-xl font-bold text-black">Agency Overview</h3>
              <span className="rounded-lg border border-neutral-300 px-3 py-1.5 text-xs font-semibold">
                This Month
              </span>
            </div>
            <div className="grid grid-cols-3 gap-4 border-b border-neutral-100 pb-5">
              <div>
                <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">Received</p>
                <b className="text-2xl font-black text-black">{briefs.filter(b => !b.isCodeOnly).length}</b>
              </div>
              <div>
                <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">Completed</p>
                <b className="text-2xl font-black text-black">{completedCount}</b>
              </div>
              <div>
                <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">Satisfaction</p>
                <b className="text-2xl font-black text-black">{Math.round(satisfactionIndex)}%</b>
              </div>
            </div>
            {/* SVG line chart representing activity */}
            <svg viewBox="0 0 420 120" className="mt-4 h-28 w-full select-none" aria-label="Agency productivity graph">
              <polyline
                points="0,90 35,82 70,60 105,72 140,50 175,45 210,28 245,42 280,54 315,67 350,50 385,42 420,14"
                fill="none"
                stroke="var(--brand-accent)"
                strokeWidth="4"
              />
              <circle cx="420" cy="14" r="6" fill="var(--brand-accent)" />
            </svg>
            <Button variant="light" className="mt-4 w-full">
              View Analytics
            </Button>
          </div>

          <ProjectStatus briefs={briefs} />

          {/* Project Code Generator Card (Replaces static announcements) */}
          <div className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-white p-7 flex flex-col justify-between">
            <DotField className="-bottom-14 right-0 h-44 w-64" dense />
            <div>
              <div className="h-10 w-10 flex items-center justify-center bg-neutral-100 rounded-lg text-black mb-4">
                <Key size={18} />
              </div>
              <h3 className="text-xl font-bold text-black">Client Code Generator</h3>
              <p className="mt-2 text-xs leading-5 text-neutral-600">
                Generate project codes to give to your clients. Client inputs map directly to custom agency briefs.
              </p>

              {generatedCode && (
                <div className="mt-5 p-4 rounded-xl border border-neutral-200 bg-neutral-50 flex items-center justify-between">
                  <span className="font-mono text-base font-black tracking-wider text-black select-all">
                    {generatedCode}
                  </span>
                  <button
                    onClick={handleCopyCode}
                    className="p-2 rounded-lg border border-neutral-300 hover:bg-neutral-100 text-neutral-600 hover:text-black focus:outline-none"
                    aria-label="Copy code to clipboard"
                  >
                    {copied ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                  </button>
                </div>
              )}
            </div>

            <Button onClick={handleGenerateCode} className="mt-6 w-full py-3.5">
              {generatedCode ? "Generate Another Code" : "Generate Project Code"}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
