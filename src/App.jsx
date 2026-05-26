import React, { useMemo } from "react";
import { AppContextProvider, useApp } from "./context/AppContext";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import PricingPage from "./pages/PricingPage";
import AccessPage from "./pages/AccessPage";
import BriefFormPage from "./pages/BriefFormPage";
import SubmittedPage from "./pages/SubmittedPage";
import DashboardPage from "./pages/DashboardPage";
import BriefDetailsPage from "./pages/BriefDetailsPage";
import ClientsPage from "./pages/ClientsPage";
import BriefsPage from "./pages/BriefsPage";
import ProjectsPage from "./pages/ProjectsPage";
import TeamPage from "./pages/TeamPage";
import MessagesPage from "./pages/MessagesPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import TemplatesPage from "./pages/TemplatesPage";
import SettingsPage from "./pages/SettingsPage";
import {
  Modal,
  DemoModalContent,
  SalesModalContent,
  SupportModalContent,
  LoginModalContent,
  InfoModalContent
} from "./components/Modal";
import "./styles.css";

function AgencivoRoutes() {
  const {
    page,
    go,
    dotColor,
    loginModalOpen,
    setLoginModalOpen,
    demoModalOpen,
    setDemoModalOpen,
    salesModalOpen,
    setSalesModalOpen,
    supportModalOpen,
    setSupportModalOpen,
    infoModalOpen,
    setInfoModalOpen
  } = useApp();

  const PageComponent = useMemo(() => {
    switch (page) {
      case "pricing":
        return PricingPage;
      case "access":
        return AccessPage;
      case "brief":
        return BriefFormPage;
      case "submitted":
        return SubmittedPage;
      case "dashboard":
        return DashboardPage;
      case "details":
        return BriefDetailsPage;
      case "clients":
        return ClientsPage;
      case "briefs":
        return BriefsPage;
      case "projects":
        return ProjectsPage;
      case "team":
        return TeamPage;
      case "messages":
        return MessagesPage;
      case "analytics":
        return AnalyticsPage;
      case "templates":
        return TemplatesPage;
      case "settings":
        return SettingsPage;
      case "home":
      default:
        return HomePage;
    }
  }, [page]);

  const dashboardPages = [
    "dashboard",
    "details",
    "clients",
    "briefs",
    "projects",
    "team",
    "messages",
    "analytics",
    "templates",
    "settings"
  ];
  const hasNav = !dashboardPages.includes(page);

  const style = useMemo(() => ({
    "--brand-accent": dotColor || "#FF6A00"
  }), [dotColor]);

  return (
    <div style={style} className="min-h-screen bg-[#fbfbfa] text-[#050505] antialiased selection:bg-black selection:text-white flex flex-col justify-between">
      <div>
        {hasNav && <Navbar />}
        <PageComponent />
      </div>

      {/* Quick Demo page switcher at the bottom (hidden on mobile, useful for reviews) */}
      <div className="fixed bottom-5 left-1/2 z-40 hidden -translate-x-1/2 gap-2 rounded-full border border-neutral-200 bg-white/90 p-2 shadow-xl backdrop-blur-xl lg:flex">
        {[
          ["home", "Home"],
          ["pricing", "Subscription"],
          ["access", "Access"],
          ["brief", "Brief"],
          ["submitted", "Submitted"],
          ["dashboard", "Dashboard"],
          ["details", "Details"]
        ].map(([id, label]) => (
          <button
            key={id}
            onClick={() => go(id)}
            className={`rounded-full px-4 py-2 text-xs font-bold transition-all focus:outline-none ${
              page === id ? "bg-black text-white" : "text-neutral-700 hover:bg-neutral-100"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Global Modals */}
      <Modal isOpen={loginModalOpen} onClose={() => setLoginModalOpen(false)} title="Agency Log In">
        <LoginModalContent onClose={() => setLoginModalOpen(false)} />
      </Modal>

      <Modal isOpen={demoModalOpen} onClose={() => setDemoModalOpen(false)} title="Book a Custom Demo">
        <DemoModalContent onClose={() => setDemoModalOpen(false)} />
      </Modal>

      <Modal isOpen={salesModalOpen} onClose={() => setSalesModalOpen(false)} title="Contact Enterprise Sales">
        <SalesModalContent onClose={() => setSalesModalOpen(false)} />
      </Modal>

      <Modal isOpen={supportModalOpen} onClose={() => setSupportModalOpen(false)} title="Contact Customer Support">
        <SupportModalContent onClose={() => setSupportModalOpen(false)} />
      </Modal>

      <Modal isOpen={infoModalOpen} onClose={() => setInfoModalOpen(false)}>
        <InfoModalContent />
      </Modal>
    </div>
  );
}

export function App() {
  return (
    <AppContextProvider>
      <AgencivoRoutes />
    </AppContextProvider>
  );
}

export default App;
