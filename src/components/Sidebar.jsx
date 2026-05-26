import React from "react";
import {
  Home,
  Users,
  BriefcaseBusiness,
  Folder,
  MessageSquare,
  LineChart,
  Layers3,
  Settings,
  LogOut
} from "lucide-react";
import { useApp } from "../context/AppContext";
import Logo from "./Logo";
import Button from "./Button";

export const Sidebar = () => {
  const { go, page, subscription, user, logout } = useApp();

  const getPlanDetails = () => {
    switch (subscription) {
      case "starter":
        return { name: "Starter Plan", price: "$29", sub: "/mo", renew: "Renews next month" };
      case "enterprise":
        return { name: "Enterprise Plan", price: "Custom", sub: "", renew: "Continuous support" };
      case "none":
        return { name: "No Active Plan", price: "$0", sub: "", renew: "Subscribe to start" };
      case "professional":
      default:
        return { name: "Professional Plan", price: "$79", sub: "/mo", renew: "Renews next month" };
    }
  };

  const plan = getPlanDetails();

  const navItems = [
    { Icon: Home, label: "Dashboard", target: "dashboard" },
    { Icon: Users, label: "Clients", target: "clients" },
    { Icon: BriefcaseBusiness, label: "Briefs", target: "briefs" },
    { Icon: Folder, label: "Projects", target: "projects" },
    { Icon: Users, label: "Team", target: "team" },
    { Icon: MessageSquare, label: "Messages", target: "messages" },
    { Icon: LineChart, label: "Analytics", target: "analytics" },
    { Icon: Layers3, label: "Templates", target: "templates" },
    { Icon: Settings, label: "Settings", target: "settings" }
  ];

  // RBAC: Filter items for team members
  const filteredNavItems = navItems.filter((item) => {
    if (user && user.role === "Member") {
      const pageId = item.target;
      if (pageId === "dashboard") return true;
      return user.permissions?.includes(pageId);
    }
    return true; // Manager sees all
  });

  return (
    <aside className="relative hidden w-[250px] shrink-0 border-r border-neutral-200 bg-[#fbfbfa] p-8 lg:block">
      <button onClick={() => go("home")} className="cursor-pointer focus:outline-none" aria-label="Go home">
        <Logo />
      </button>

      <nav className="mt-10 space-y-3">
        {filteredNavItems.map(({ Icon, label, target }) => {
          const isActive = page === target;
          return (
            <button
              key={label}
              onClick={() => go(target)}
              className={`flex w-full items-center gap-4 rounded-xl px-4 py-3 text-left text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-black ${
                isActive ? "bg-black text-white" : "text-neutral-700 hover:bg-white"
              }`}
            >
              <Icon size={18} />
              {label}
            </button>
          );
        })}
      </nav>

      <div className="absolute bottom-8 left-8 right-8 space-y-5">
        <button
          onClick={logout}
          className="flex items-center gap-3 text-sm font-semibold text-neutral-600 hover:text-black focus:outline-none w-full"
        >
          <LogOut size={17} /> Log out
        </button>

        <div className="rounded-2xl border border-neutral-300 bg-white p-5">
          <h4 className="font-bold text-sm">
            {user?.role === "Member" ? "Team License" : plan.name}
          </h4>
          <p className="mt-4 text-2xl font-black">
            {user?.role === "Member" ? "Shared" : plan.price}{" "}
            <span className="text-sm font-medium">
              {user?.role === "Member" ? "" : plan.sub}
            </span>
          </p>
          <p className="mt-2 text-xs text-neutral-500">
            {user?.role === "Member" ? `Under ${user.parentId}` : plan.renew}
          </p>
          {user?.role !== "Member" && (
            <Button
              variant="light"
              onClick={() => go("pricing")}
              className="mt-5 w-full py-2 text-xs"
            >
              Manage Plan
            </Button>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
