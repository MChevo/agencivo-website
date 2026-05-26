import React, { createContext, useContext, useState, useEffect } from "react";

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [page, setPage] = useState(() => {
    return localStorage.getItem("agencivo_page") || "home";
  });

  const [subscription, setSubscription] = useState(() => {
    return localStorage.getItem("agencivo_subscription") || "professional";
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("agencivo_auth") === "true";
  });

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("agencivo_auth_user");
    return saved ? JSON.parse(saved) : null;
  });

  const [dotColor, setDotColor] = useState(() => {
    return localStorage.getItem("agencivo_dot_color") || "#FF6A00";
  });

  const [clientAgencyDotColor, setClientAgencyDotColor] = useState(() => {
    return localStorage.getItem("agencivo_client_agency_dot_color") || "#FF6A00";
  });

  const activeDotColor = React.useMemo(() => {
    if (isAuthenticated && user) {
      return user.dotColor || "#FF6A00";
    }
    if (["home", "pricing", "access"].includes(page)) {
      return "#FF6A00";
    }
    return clientAgencyDotColor || "#FF6A00";
  }, [isAuthenticated, user, page, clientAgencyDotColor]);

  const [briefs, setBriefs] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [team, setTeam] = useState([]);
  const [messages, setMessages] = useState([]);

  const [selectedBriefId, setSelectedBriefId] = useState(() => {
    return localStorage.getItem("agencivo_selected_brief_id") || "";
  });

  const [activeCode, setActiveCode] = useState(() => {
    return localStorage.getItem("agencivo_active_code") || "";
  });

  // Track draft state
  const [draftBrief, setDraftBrief] = useState(() => {
    const saved = localStorage.getItem("agencivo_draft_brief");
    return saved ? JSON.parse(saved) : {
      brandName: "",
      colors: [
        { hex: "#111111", name: "bg-black" },
        { hex: "#FF6A00", name: "bg-[#ff6a00]" },
        { hex: "#E6E6E6", name: "bg-neutral-200" }
      ],
      identityVision: "",
      targetAgeMin: 25,
      targetAgeMax: 40,
      requiredDesigns: [
        { name: "Logo Design", quantity: 1 },
        { name: "Brand Guidelines", quantity: 1 },
        { name: "Business Card", quantity: 2 },
        { name: "Social Media Kit", quantity: 6 }
      ],
      notes: ""
    };
  });

  // Modals state
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [salesModalOpen, setSalesModalOpen] = useState(false);
  const [supportModalOpen, setSupportModalOpen] = useState(false);

  // Info popups
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [infoModalType, setInfoModalType] = useState("about"); // about, overview, features, help

  // API Call Helpers
  const fetchBriefs = async () => {
    if (!isAuthenticated || !user) return;
    try {
      const res = await fetch("/api/briefs", {
        headers: { "X-User-Email": user.email }
      });
      if (res.ok) {
        const data = await res.json();
        setBriefs(data);
      }
    } catch (e) {
      console.error("Failed to fetch briefs:", e);
    }
  };

  const fetchNotifications = async () => {
    if (!isAuthenticated || !user) return;
    try {
      const res = await fetch("/api/notifications", {
        headers: { "X-User-Email": user.email }
      });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (e) {
      console.error("Failed to fetch notifications:", e);
    }
  };

  const fetchTeam = async () => {
    if (!isAuthenticated || !user) return;
    try {
      const res = await fetch("/api/team", {
        headers: { "X-User-Email": user.email }
      });
      if (res.ok) {
        const data = await res.json();
        setTeam(data);
      }
    } catch (e) {
      console.error("Failed to fetch team:", e);
    }
  };

  const fetchMessages = async (briefId) => {
    if (!briefId) return;
    try {
      const res = await fetch(`/api/messages/${briefId}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (e) {
      console.error("Failed to fetch messages:", e);
    }
  };

  // Sync state loops
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchBriefs();
      fetchNotifications();
      fetchTeam();
      if (selectedBriefId) {
        fetchMessages(selectedBriefId);
      }
    }
  }, [isAuthenticated, user, selectedBriefId]);

  useEffect(() => {
    // Poll the backend every 5 seconds for real-time dashboard updates
    const interval = setInterval(() => {
      if (isAuthenticated && user) {
        fetchBriefs();
        fetchNotifications();
        fetchTeam();
        if (selectedBriefId) {
          fetchMessages(selectedBriefId);
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isAuthenticated, user, selectedBriefId]);

  useEffect(() => {
    localStorage.setItem("agencivo_page", page);
  }, [page]);

  useEffect(() => {
    localStorage.setItem("agencivo_subscription", subscription);
  }, [subscription]);

  useEffect(() => {
    localStorage.setItem("agencivo_auth", isAuthenticated ? "true" : "false");
  }, [isAuthenticated]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("agencivo_auth_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("agencivo_auth_user");
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem("agencivo_selected_brief_id", selectedBriefId);
  }, [selectedBriefId]);

  useEffect(() => {
    localStorage.setItem("agencivo_active_code", activeCode);
  }, [activeCode]);

  useEffect(() => {
    localStorage.setItem("agencivo_draft_brief", JSON.stringify(draftBrief));
  }, [draftBrief]);

  useEffect(() => {
    localStorage.setItem("agencivo_dot_color", dotColor);
  }, [dotColor]);

  useEffect(() => {
    localStorage.setItem("agencivo_client_agency_dot_color", clientAgencyDotColor);
  }, [clientAgencyDotColor]);

  const go = (targetPage) => {
    if (["dashboard", "details"].includes(targetPage) && !isAuthenticated) {
      setPage("home");
      setLoginModalOpen(true);
      return;
    }
    
    // RBAC: Check if the user is a team member and has page permissions
    if (user && user.role === "Member" && ["clients", "team", "analytics", "templates", "settings"].includes(targetPage)) {
      if (!user.permissions.includes(targetPage)) {
        alert("Access Denied: You do not have permissions to access this page.");
        return;
      }
    }
    
    setPage(targetPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Auth operations
  const registerUser = async (email, password, agencyName) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, agencyName })
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        setDotColor(data.user.dotColor || "#FF6A00");
        setIsAuthenticated(true);
        go("dashboard");
        return { success: true };
      } else {
        return { success: false, error: data.error || "Registration failed." };
      }
    } catch (e) {
      return { success: false, error: "Network error occurred." };
    }
  };

  const login = async (email, password) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        setDotColor(data.user.dotColor || "#FF6A00");
        setIsAuthenticated(true);
        go("dashboard");
        return { success: true };
      } else {
        return { success: false, error: data.error || "Invalid credentials." };
      }
    } catch (e) {
      return { success: false, error: "Network error occurred." };
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setDotColor("#FF6A00");
    setSubscription("professional");
    setBriefs([]);
    setNotifications([]);
    setTeam([]);
    setMessages([]);
    setSelectedBriefId("");
    setActiveCode("");
    go("home");
  };

  const updateUserSettings = async (settings) => {
    if (!user) return { success: false, error: "Not logged in." };
    try {
      const res = await fetch("/api/user/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-User-Email": user.email
        },
        body: JSON.stringify(settings)
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        if (data.user.dotColor) {
          setDotColor(data.user.dotColor);
        }
        return { success: true };
      }
      return { success: false, error: data.error || "Failed to update settings." };
    } catch (e) {
      return { success: false, error: "Network error occurred." };
    }
  };

  const validateCode = async (code) => {
    try {
      const formattedCode = code.trim().toUpperCase();
      const res = await fetch(`/api/briefs/validate-code/${formattedCode}`);
      const data = await res.json();
      if (data.valid) {
        setActiveCode(formattedCode);
        setSelectedBriefId(data.briefId);
        setClientAgencyDotColor(data.brief?.agencyDotColor || "#FF6A00");
        if (data.brief && data.brief.requiredDesigns && data.brief.requiredDesigns.length > 0) {
          setDraftBrief({
            brandName: "",
            colors: [
              { hex: "#111111", name: "bg-black" },
              { hex: "#FF6A00", name: "bg-[#ff6a00]" },
              { hex: "#E6E6E6", name: "bg-neutral-200" }
            ],
            identityVision: "",
            targetAgeMin: 25,
            targetAgeMax: 40,
            requiredDesigns: data.brief.requiredDesigns,
            notes: data.brief.notes || ""
          });
        }
        return data.brief || true;
      }
      return null;
    } catch (e) {
      console.error("Code validation error:", e);
      return false;
    }
  };

  const generateProjectCode = async (projectType = "", requiredDesigns = []) => {
    if (!user) return "";
    try {
      const res = await fetch("/api/briefs/generate-code", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "X-User-Email": user.email 
        },
        body: JSON.stringify({ projectType, requiredDesigns })
      });
      const data = await res.json();
      if (res.ok) {
        await fetchBriefs(); // Pull latest tasks
        setSelectedBriefId(data.briefId);
        return data.code;
      }
      return "";
    } catch (e) {
      console.error("Code generation error:", e);
      return "";
    }
  };

  const submitBrief = async (formData) => {
    try {
      const res = await fetch(`/api/briefs/submit/${selectedBriefId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        clearDraft();
        return true;
      }
      return false;
    } catch (e) {
      console.error("Submit brief error:", e);
      return false;
    }
  };

  const submitBriefFeedback = async (briefId, feedbackData) => {
    try {
      const res = await fetch(`/api/briefs/${briefId}/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(feedbackData)
      });
      if (res.ok) {
        // Refresh details or briefs list
        await fetchBriefs();
        return true;
      }
      return false;
    } catch (e) {
      console.error("Submit feedback error:", e);
      return false;
    }
  };

  const updateBriefStatus = async (id, status) => {
    if (!user) return;
    try {
      const res = await fetch(`/api/briefs/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-User-Email": user.email
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        await fetchBriefs();
      }
    } catch (e) {
      console.error("Update status error:", e);
    }
  };

  const markAllNotificationsRead = async () => {
    if (!user) return;
    try {
      const res = await fetch("/api/notifications/read-all", {
        method: "POST",
        headers: { "X-User-Email": user.email }
      });
      if (res.ok) {
        await fetchNotifications();
      }
    } catch (e) {
      console.error("Mark read error:", e);
    }
  };

  // Team management operations
  const addTeamMember = async (email, password, permissions, roleDescription) => {
    if (!user) return { success: false, error: "Not logged in." };
    try {
      const res = await fetch("/api/team/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-User-Email": user.email
        },
        body: JSON.stringify({ email, password, permissions, roleDescription })
      });
      const data = await res.json();
      if (res.ok) {
        await fetchTeam();
        return { success: true };
      } else {
        return { success: false, error: data.error || "Failed to add member." };
      }
    } catch (e) {
      return { success: false, error: "Network error occurred." };
    }
  };

  // Messaging operations
  const sendChatMessage = async (sender, text) => {
    if (!selectedBriefId) return false;
    try {
      const res = await fetch(`/api/messages/${selectedBriefId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sender, text })
      });
      if (res.ok) {
        await fetchMessages(selectedBriefId);
        return true;
      }
      return false;
    } catch (e) {
      console.error("Send message error:", e);
      return false;
    }
  };

  const saveDraft = (formData) => {
    setDraftBrief(formData);
  };

  const clearDraft = () => {
    setDraftBrief({
      brandName: "",
      colors: [
        { hex: "#111111", name: "bg-black" },
        { hex: "#FF6A00", name: "bg-[#ff6a00]" },
        { hex: "#E6E6E6", name: "bg-neutral-200" }
      ],
      identityVision: "",
      targetAgeMin: 25,
      targetAgeMax: 40,
      requiredDesigns: [
        { name: "Logo Design", quantity: 1 },
        { name: "Brand Guidelines", quantity: 1 },
        { name: "Business Card", quantity: 2 },
        { name: "Social Media Kit", quantity: 6 }
      ],
      notes: ""
    });
  };

  const subscribe = (plan) => {
    setSubscription(plan);
    setIsAuthenticated(true);
  };

  const triggerInfoModal = (type) => {
    setInfoModalType(type);
    setInfoModalOpen(true);
  };

  return (
    <AppContext.Provider
      value={{
        page,
        go,
        subscription,
        subscribe,
        isAuthenticated,
        user,
        dotColor: activeDotColor,
        updateUserSettings,
        login,
        registerUser,
        logout,
        briefs,
        submitBrief,
        submitBriefFeedback,
        updateBriefStatus,
        notifications,
        markAllNotificationsRead,
        selectedBriefId,
        setSelectedBriefId,
        activeCode,
        validateCode,
        generateProjectCode,
        draftBrief,
        saveDraft,
        clearDraft,
        // Modals
        loginModalOpen,
        setLoginModalOpen,
        demoModalOpen,
        setDemoModalOpen,
        salesModalOpen,
        setSalesModalOpen,
        supportModalOpen,
        setSupportModalOpen,
        // Info popups
        infoModalOpen,
        setInfoModalOpen,
        infoModalType,
        triggerInfoModal,
        // Team
        team,
        addTeamMember,
        // Messages
        messages,
        sendChatMessage,
        fetchMessages
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppContextProvider");
  }
  return context;
};
