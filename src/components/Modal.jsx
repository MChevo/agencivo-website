import React, { useEffect, useRef, useState } from "react";
import { X, Check } from "lucide-react";
import { useApp } from "../context/AppContext";
import Button from "./Button";
import DotField from "./DotField";

export const Modal = ({ isOpen, onClose, title, children }) => {
  const modalRef = useRef();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  return (
    <div
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-[540px] overflow-hidden rounded-2xl border border-neutral-300 bg-white p-8 shadow-2xl transition-all md:p-10"
      >
        <DotField className="-right-10 top-0 h-40 w-56" dense />
        <button
          onClick={onClose}
          className="absolute right-6 top-6 rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-black focus:outline-none focus:ring-2 focus:ring-black"
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        {title && (
          <h3 className="pr-8 text-2xl font-black tracking-[-0.03em] text-black">
            {title}
          </h3>
        )}

        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
};

export const LoginModalContent = ({ onClose }) => {
  const { login, registerUser } = useApp();
  const [activeTab, setActiveTab] = useState("login"); // login, signup
  
  // Login Form State
  const [loginEmail, setLoginEmail] = useState("admin@agencivo.com");
  const [loginPassword, setLoginPassword] = useState("admin123");
  const [loginError, setLoginError] = useState("");

  // Signup Form State
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupAgencyName, setSignupAgencyName] = useState("");
  const [signupError, setSignupError] = useState("");
  const [signupSuccess, setSignupSuccess] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError("");
    const res = await login(loginEmail, loginPassword);
    if (res.success) {
      onClose();
    } else {
      setLoginError(res.error);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setSignupError("");
    if (!signupEmail || !signupPassword || !signupAgencyName) {
      setSignupError("All fields are required.");
      return;
    }
    
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!gmailRegex.test(signupEmail.trim().toLowerCase())) {
      setSignupError("يجب التسجيل باستخدام حساب Gmail حقيقي (مثال: name@gmail.com).");
      return;
    }

    const res = await registerUser(signupEmail, signupPassword, signupAgencyName);
    if (res.success) {
      setSignupSuccess(true);
      setTimeout(() => {
        setSignupSuccess(false);
        onClose();
      }, 2000);
    } else {
      setSignupError(res.error);
    }
  };

  return (
    <div>
      {/* Tabs */}
      <div className="flex border-b border-neutral-200 mb-6 text-sm font-semibold">
        <button
          onClick={() => {
            setActiveTab("login");
            setLoginError("");
          }}
          className={`flex-1 pb-3 text-center border-b-2 transition-all focus:outline-none ${
            activeTab === "login"
              ? "border-black text-black"
              : "border-transparent text-neutral-400 hover:text-black"
          }`}
        >
          Sign In
        </button>
        <button
          onClick={() => {
            setActiveTab("signup");
            setSignupError("");
          }}
          className={`flex-1 pb-3 text-center border-b-2 transition-all focus:outline-none ${
            activeTab === "signup"
              ? "border-black text-black"
              : "border-transparent text-neutral-400 hover:text-black"
          }`}
        >
          Create Account
        </button>
      </div>

      {activeTab === "login" ? (
        /* Login Form */
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          {loginError && (
            <div className="text-xs font-semibold text-red-500 bg-red-50 border border-red-200 rounded-lg p-3">
              {loginError}
            </div>
          )}
          <div className="border-b border-neutral-100 pb-3 text-xs text-neutral-500">
            <p>Demo agency credentials:</p>
            <p className="mt-1 font-bold text-black">Email: admin@agencivo.com</p>
            <p className="font-bold text-black">Password: admin123</p>
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 block mb-1.5">
              Email Address *
            </label>
            <input
              type="email"
              required
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-black"
            />
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 block mb-1.5">
              Password *
            </label>
            <input
              type="password"
              required
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-black"
            />
          </div>
          <Button type="submit" className="w-full py-3.5 mt-2">
            Log in to Dashboard
          </Button>
        </form>
      ) : (
        /* Signup Form */
        <form onSubmit={handleSignupSubmit} className="space-y-4">
          {signupError && (
            <div className="text-xs font-semibold text-red-500 bg-red-50 border border-red-200 rounded-lg p-3">
              {signupError}
            </div>
          )}
          {signupSuccess && (
            <div className="text-xs font-semibold text-green-700 bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
              <Check size={14} /> Account created! Redirecting...
            </div>
          )}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 block mb-1.5">
              Agency Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Acme Studio"
              value={signupAgencyName}
              onChange={(e) => setSignupAgencyName(e.target.value)}
              className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-black"
            />
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 block mb-1.5">
              Email Address *
            </label>
            <input
              type="email"
              required
              placeholder="name@agency.com"
              value={signupEmail}
              onChange={(e) => setSignupEmail(e.target.value)}
              className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-black"
            />
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 block mb-1.5">
              Password *
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={signupPassword}
              onChange={(e) => setSignupPassword(e.target.value)}
              className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-black"
            />
          </div>
          <Button type="submit" className="w-full py-3.5 mt-2" disabled={signupSuccess}>
            Create Agency Account
          </Button>
        </form>
      )}
    </div>
  );
};

export const InfoModalContent = () => {
  const { infoModalType } = useApp();

  const getInfoData = () => {
    switch (infoModalType) {
      case "overview":
        return {
          title: "Agencivo Workflow",
          content: (
            <div className="space-y-4 text-sm text-neutral-700 leading-relaxed">
              <p>Agencivo functions as a seamless operational bridge between design agencies and clients:</p>
              <ol className="list-decimal list-inside space-y-2 font-semibold">
                <li>Agency registers a subscription and accesses the Dashboard.</li>
                <li>Agency clicks "Generate Code" to reserve a unique ticket code.</li>
                <li>Agency copies and sends the code to their client.</li>
                <li>Client enters the code, designs the brief form, and submits.</li>
                <li>The unused code task updates automatically into an active dashboard project.</li>
              </ol>
            </div>
          )
        };
      case "features":
        return {
          title: "Platform Core Features",
          content: (
            <div className="space-y-4 text-sm text-neutral-700 leading-relaxed">
              <p>Designed with zero broken links and high visual standard:</p>
              <ul className="list-disc list-inside space-y-2">
                <li><span className="font-bold">Project Code Tracker:</span> Generate codes and map client inputs directly to the matching task records.</li>
                <li><span className="font-bold">Color Swatch & Deliverable Builder:</span> Interactive color palette and project items addition controls.</li>
                <li><span className="font-bold">Dynamic Analytics:</span> Charts and statistics update automatically as actions take place.</li>
                <li><span className="font-bold">Text Brief Exporting:</span> Download completed briefs as clean structured files locally.</li>
              </ul>
            </div>
          )
        };
      case "help":
        return {
          title: "Help Center & FAQs",
          content: (
            <div className="space-y-4 text-sm text-neutral-700 leading-relaxed">
              <div>
                <h4 className="font-bold text-black mb-1">Where is my data saved?</h4>
                <p>Everything is saved securely within the Express JSON file database (`server/data/db.json`), ensuring it persists across different browsers and computers.</p>
              </div>
              <div>
                <h4 className="font-bold text-black mb-1">How can I test the code entry?</h4>
                <p>Use the pre-filled default code `AC-7X9P-L2Q4` on the Client Access page, or generate a custom code on the Agency Dashboard.</p>
              </div>
              <div>
                <h4 className="font-bold text-black mb-1">Can I reset the site state?</h4>
                <p>Yes, clearing the JSON file (`server/data/db.json`) will restore Agencivo to its initial empty configuration.</p>
              </div>
            </div>
          )
        };
      case "about":
      default:
        return {
          title: "About Agencivo",
          content: (
            <div className="space-y-4 text-sm text-neutral-700 leading-relaxed">
              <p>
                Agencivo is the modern Operating System for design agencies. Our mission is to eliminate friction, lost documents, and email thread confusion by unifying requirements gathering into structured client briefs.
              </p>
              <p>
                Built using state-of-the-art minimalist design, large layout headers, and clear borders, Agencivo prioritizes visual aesthetics alongside robust functionality.
              </p>
            </div>
          )
        };
    }
  };

  const info = getInfoData();

  return (
    <div className="space-y-4">
      <h4 className="text-xl font-bold border-b pb-3 text-black">{info.title}</h4>
      <div className="pt-2">{info.content}</div>
    </div>
  );
};

export const DemoModalContent = ({ onClose }) => {
  const [submitted, setSubmitted] = React.useState(false);
  const [formData, setFormData] = React.useState({ name: "", email: "", agency: "", message: "" });
  const [error, setError] = React.useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.agency) {
      setError("Please fill out all required fields.");
      return;
    }
    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, message: `Demo Request from ${formData.name} at ${formData.agency}. Message: ${formData.message}` })
      });
      if (res.ok) {
        setSubmitted(true);
        setTimeout(() => onClose(), 2500);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch (err) {
      setError("Network error occurred.");
    }
  };

  if (submitted) {
    return (
      <div className="py-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-black bg-neutral-50 mb-4">
          <Check size={20} />
        </div>
        <h4 className="text-xl font-bold">Demo Request Sent!</h4>
        <p className="mt-2 text-sm text-neutral-600">
          Thank you. One of our team members will reach out to you within 24 hours to schedule a custom walkthrough.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && <div className="text-xs font-semibold text-red-500">{error}</div>}
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 block mb-2">Name *</label>
        <input
          type="text"
          required
          placeholder="e.g. John Doe"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-black"
        />
      </div>
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 block mb-2">Work Email *</label>
        <input
          type="email"
          required
          placeholder="e.g. john@agency.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-black"
        />
      </div>
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 block mb-2">Agency Name *</label>
        <input
          type="text"
          required
          placeholder="e.g. Apex Creative"
          value={formData.agency}
          onChange={(e) => setFormData({ ...formData, agency: e.target.value })}
          className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-black"
        />
      </div>
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 block mb-2">Message</label>
        <textarea
          placeholder="How can we help your agency?"
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="h-24 w-full rounded-xl border border-neutral-300 p-4 text-sm outline-none resize-none focus:border-black"
        />
      </div>
      <Button type="submit" className="w-full py-3.5">Request Custom Demo</Button>
    </form>
  );
};

export const SalesModalContent = ({ onClose }) => {
  const [submitted, setSubmitted] = React.useState(false);
  const [formData, setFormData] = React.useState({ name: "", email: "", size: "5-15", message: "" });
  const [error, setError] = React.useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      setError("Please fill out all required fields.");
      return;
    }
    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, message: `Sales Inquiry from ${formData.name} (Agency size: ${formData.size}). Message: ${formData.message}` })
      });
      if (res.ok) {
        setSubmitted(true);
        setTimeout(() => onClose(), 2500);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch (err) {
      setError("Network error occurred.");
    }
  };

  if (submitted) {
    return (
      <div className="py-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-black bg-neutral-50 mb-4">
          <Check size={20} />
        </div>
        <h4 className="text-xl font-bold">Message Received!</h4>
        <p className="mt-2 text-sm text-neutral-600">
          Thank you for contacting sales. We'll be in touch soon with custom pricing options.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && <div className="text-xs font-semibold text-red-500">{error}</div>}
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 block mb-2">Name *</label>
        <input
          type="text"
          required
          placeholder="e.g. Jane Smith"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-black"
        />
      </div>
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 block mb-2">Work Email *</label>
        <input
          type="email"
          required
          placeholder="e.g. jane@company.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-black"
        />
      </div>
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 block mb-2">Agency Size</label>
        <select
          value={formData.size}
          onChange={(e) => setFormData({ ...formData, size: e.target.value })}
          className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm outline-none focus:border-black"
        >
          <option value="1-5">1-5 members</option>
          <option value="5-15">5-15 members</option>
          <option value="15-50">15-50 members</option>
          <option value="50+">50+ members</option>
        </select>
      </div>
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 block mb-2">Custom Requirements</label>
        <textarea
          placeholder="Let us know what special integration, SLA, or support needs you have..."
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="h-24 w-full rounded-xl border border-neutral-300 p-4 text-sm outline-none resize-none focus:border-black"
        />
      </div>
      <Button type="submit" className="w-full py-3.5">Contact Enterprise Sales</Button>
    </form>
  );
};

export const SupportModalContent = ({ onClose }) => {
  const [submitted, setSubmitted] = React.useState(false);
  const [formData, setFormData] = React.useState({ email: "", message: "" });
  const [error, setError] = React.useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.message) {
      setError("Please fill out all required fields.");
      return;
    }
    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setSubmitted(true);
        setTimeout(() => onClose(), 2500);
      } else {
        setError("Submission failed. Please try again.");
      }
    } catch (err) {
      setError("Network error occurred.");
    }
  };

  if (submitted) {
    return (
      <div className="py-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-black bg-neutral-50 mb-4">
          <Check size={20} />
        </div>
        <h4 className="text-xl font-bold">Support Request Sent</h4>
        <p className="mt-2 text-sm text-neutral-600">
          Our support desk has received your ticket. We'll reply within a few hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && <div className="text-xs font-semibold text-red-500">{error}</div>}
      <div className="border-b border-neutral-200 pb-4 text-sm text-neutral-600">
        <p className="mb-2">Need immediate assistance?</p>
        <p>Email: <a href="mailto:support@agencivo.com" className="font-semibold text-[#ff6a00] hover:underline">support@agencivo.com</a></p>
      </div>
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 block mb-2">Your Email *</label>
        <input
          type="email"
          required
          placeholder="e.g. john@agency.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-black"
        />
      </div>
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 block mb-2">Message *</label>
        <textarea
          required
          placeholder="Describe your issue or question..."
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="h-24 w-full rounded-xl border border-neutral-300 p-4 text-sm outline-none resize-none focus:border-black"
        />
      </div>
      <Button type="submit" className="w-full py-3.5">Submit Support Ticket</Button>
    </form>
  );
};
