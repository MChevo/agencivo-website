import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { useApp } from "../context/AppContext";
import Logo from "./Logo";
import Button from "./Button";

export const Navbar = () => {
  const { go, page, setLoginModalOpen, triggerInfoModal, setSupportModalOpen, isAuthenticated, logout } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNavClick = (action) => {
    setMobileOpen(false);
    if (action === "pricing") {
      go("pricing");
    } else if (action === "overview") {
      triggerInfoModal("overview");
    } else if (action === "features") {
      triggerInfoModal("features");
    } else if (action === "about") {
      triggerInfoModal("about");
    } else if (action === "contact") {
      setSupportModalOpen(true);
    }
  };

  const handleGetStarted = () => {
    setMobileOpen(false);
    if (page === "home") {
      document.getElementById("role-selection")?.scrollIntoView({ behavior: "smooth" });
    } else {
      go("home");
      setTimeout(() => {
        document.getElementById("role-selection")?.scrollIntoView({ behavior: "smooth" });
      }, 200);
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-100 bg-[#fbfbfa]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-[1840px] items-center justify-between px-8 lg:px-12">
        <button onClick={() => go("home")} className="cursor-pointer focus:outline-none" aria-label="Go to homepage">
          <Logo />
        </button>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-12 text-sm font-semibold text-neutral-900 lg:flex">
          <button onClick={() => handleNavClick("overview")} className="hover:text-[#ff6a00] transition-colors focus:outline-none">
            Overview
          </button>
          <button onClick={() => handleNavClick("features")} className="hover:text-[#ff6a00] transition-colors focus:outline-none">
            Features
          </button>
          <button onClick={() => handleNavClick("pricing")} className="hover:text-[#ff6a00] transition-colors focus:outline-none">
            Pricing
          </button>
          <button onClick={() => handleNavClick("about")} className="hover:text-[#ff6a00] transition-colors focus:outline-none">
            About Us
          </button>
          <button onClick={() => handleNavClick("contact")} className="hover:text-[#ff6a00] transition-colors focus:outline-none">
            Contact
          </button>
        </nav>

        {/* Desktop CTA */}
        <div className="hidden items-center gap-5 text-sm font-semibold lg:flex">
          {isAuthenticated ? (
            <>
              <button
                onClick={() => go("dashboard")}
                className="hover:text-neutral-500 focus:outline-none focus:underline"
              >
                Dashboard
              </button>
              <button
                onClick={logout}
                className="hover:text-neutral-500 focus:outline-none focus:underline text-neutral-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setLoginModalOpen(true)}
                className="hover:text-neutral-500 focus:outline-none focus:underline"
              >
                Log in
              </button>
              <Button onClick={handleGetStarted} className="px-5 py-2.5">
                Get Started
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-3 lg:hidden">
          <Button onClick={handleGetStarted} className="px-4 py-2 text-xs">
            Get Started
          </Button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-lg p-2 text-neutral-600 hover:bg-neutral-100 focus:outline-none"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="border-b border-neutral-200 bg-[#fbfbfa] px-8 py-6 lg:hidden shadow-md">
          <nav className="flex flex-col gap-4 text-sm font-semibold text-neutral-900">
            <button onClick={() => handleNavClick("overview")} className="text-left py-2 hover:text-[#ff6a00] focus:outline-none">
              Overview
            </button>
            <button onClick={() => handleNavClick("features")} className="text-left py-2 hover:text-[#ff6a00] focus:outline-none">
              Features
            </button>
            <button onClick={() => handleNavClick("pricing")} className="text-left py-2 hover:text-[#ff6a00] focus:outline-none">
              Pricing
            </button>
            <button onClick={() => handleNavClick("about")} className="text-left py-2 hover:text-[#ff6a00] focus:outline-none">
              About Us
            </button>
            <button onClick={() => handleNavClick("contact")} className="text-left py-2 hover:text-[#ff6a00] focus:outline-none">
              Contact
            </button>
            <div className="h-px bg-neutral-200 my-2" />
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    go("dashboard");
                  }}
                  className="text-left py-2 hover:text-neutral-500 font-bold"
                >
                  Dashboard
                </button>
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    logout();
                  }}
                  className="text-left py-2 text-neutral-500 hover:text-black font-semibold"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setMobileOpen(false);
                  setLoginModalOpen(true);
                }}
                className="text-left py-2 hover:text-neutral-500 focus:outline-none font-bold"
              >
                Log in
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
