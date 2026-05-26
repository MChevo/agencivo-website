import React, { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { useApp } from "../context/AppContext";
import Logo from "./Logo";
import DotField from "./DotField";

export const Footer = ({ compact = false }) => {
  const { go, triggerInfoModal, setSupportModalOpen } = useApp();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  const handleLinkClick = (action) => {
    if (action === "about") triggerInfoModal("about");
    else if (action === "overview") triggerInfoModal("overview");
    else if (action === "features") triggerInfoModal("features");
    else if (action === "help") triggerInfoModal("help");
    else if (action === "pricing") go("pricing");
    else if (action === "support") setSupportModalOpen(true);
  };

  return (
    <footer className="relative overflow-hidden border-t border-neutral-200 bg-[#fbfbfa] px-8 py-10 lg:px-12 animate-fade-in">
      <DotField className="-bottom-20 right-0 h-52 w-72" />
      <div className="mx-auto grid max-w-[1760px] gap-10 lg:grid-cols-[2fr_1fr_1.2fr_1.8fr]">
        <div>
          <Logo />
          <p className="mt-7 max-w-[200px] text-sm leading-6 text-neutral-600">
            The operating system for modern design agencies and their clients.
          </p>
          <div className="mt-8 flex gap-5 text-xl font-semibold">
            <span className="cursor-pointer hover:text-[#ff6a00] transition-colors">𝕏</span>
            <span className="cursor-pointer hover:text-[#ff6a00] transition-colors">in</span>
            <span className="cursor-pointer hover:text-[#ff6a00] transition-colors">◎</span>
          </div>
        </div>

        {/* Simplified functional links columns */}
        <div className="text-sm">
          <h4 className="font-bold text-black uppercase tracking-wider text-xs mb-5">Agencivo</h4>
          <div className="flex flex-col gap-3 text-neutral-600">
            <button onClick={() => handleLinkClick("about")} className="w-fit hover:text-[#ff6a00] text-left focus:outline-none transition-colors">
              About Us
            </button>
            <button onClick={() => handleLinkClick("overview")} className="w-fit hover:text-[#ff6a00] text-left focus:outline-none transition-colors">
              Overview
            </button>
            <button onClick={() => handleLinkClick("features")} className="w-fit hover:text-[#ff6a00] text-left focus:outline-none transition-colors">
              Features
            </button>
          </div>
        </div>

        <div className="text-sm">
          <h4 className="font-bold text-black uppercase tracking-wider text-xs mb-5">Support & Resources</h4>
          <div className="flex flex-col gap-3 text-neutral-600">
            <button onClick={() => handleLinkClick("pricing")} className="w-fit hover:text-[#ff6a00] text-left focus:outline-none transition-colors">
              Pricing Plans
            </button>
            <button onClick={() => handleLinkClick("support")} className="w-fit hover:text-[#ff6a00] text-left focus:outline-none transition-colors">
              Support Desk
            </button>
            <button onClick={() => handleLinkClick("help")} className="w-fit hover:text-[#ff6a00] text-left focus:outline-none transition-colors">
              Help Center & FAQs
            </button>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-bold">Stay in the loop</h4>
          <p className="mt-5 max-w-[260px] text-sm leading-6 text-neutral-600">
            Get product updates and insights straight to your inbox.
          </p>
          <form onSubmit={handleSubmit} className="mt-6 flex max-w-[300px] overflow-hidden rounded-xl border border-neutral-300 bg-white focus-within:border-black">
            <input
              className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm outline-none"
              placeholder={subscribed ? "Subscribed!" : "Enter your email"}
              disabled={subscribed}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              type="email"
              aria-label="Email address for newsletter"
            />
            <button
              type="submit"
              disabled={subscribed}
              className="m-1 rounded-lg bg-black px-4 text-white flex items-center justify-center hover:bg-neutral-800 focus:outline-none"
              aria-label="Subscribe to newsletter"
            >
              {subscribed ? <Check size={16} /> : <ArrowRight size={16} />}
            </button>
          </form>
        </div>
      </div>
      {!compact && (
        <div className="mx-auto mt-10 flex max-w-[1760px] justify-between border-t border-neutral-200 pt-6 text-xs text-neutral-500">
          <p>© 2026 Agencivo. All rights reserved.</p>
          <div className="flex gap-10">
            <span className="cursor-pointer hover:underline">Privacy Policy</span>
            <span className="cursor-pointer hover:underline">Terms of Service</span>
            <span className="cursor-pointer hover:underline">Security</span>
          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;
