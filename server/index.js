import express from "express";
import cors from "cors";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.resolve(__dirname, "data/db.json");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Helper: read JSON database
async function readDB() {
  try {
    const data = await fs.readFile(DB_PATH, "utf-8");
    const db = JSON.parse(data);
    
    // Schema sanitization for backwards compatibility
    if (!db.users) db.users = [];
    if (!db.briefs) db.briefs = [];
    if (!db.notifications) db.notifications = [];
    if (!db.messages) db.messages = {};
    if (!db.supportTickets) db.supportTickets = [];
    
    return db;
  } catch (error) {
    // If file doesn't exist, return default schema
    return {
      users: [
        {
          email: "admin@agencivo.com",
          password: "admin123",
          agencyName: "Agencivo Agency",
          role: "Manager",
          permissions: ["dashboard", "clients", "briefs", "projects", "team", "messages", "analytics", "templates", "settings"],
          dotColor: "#FF6A00"
        }
      ],
      briefs: [
        {
          id: "brief-default-1",
          code: "AC-7X9P-L2Q4",
          brandName: "Pending Client",
          projectType: "Brief Pending",
          status: "Code Unused",
          submittedAt: new Date().toISOString(),
          isCodeOnly: true,
          colors: [],
          requiredDesigns: [],
          identityVision: "",
          notes: "",
          ownerId: "admin@agencivo.com"
        }
      ],
      notifications: [],
      messages: {}, // key is briefId, value is list of messages
      supportTickets: []
    };
  }
}

// Helper: write JSON database
async function writeDB(data) {
  try {
    await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error("Database write error:", error);
  }
}

// Ensure database file is initialized on startup
(async () => {
  const db = await readDB();
  await writeDB(db);
  console.log("Database initialized at:", DB_PATH);
})();

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Middleware: Get active user from X-User-Email header
async function getAuthUser(req, res, next) {
  const email = req.headers["x-user-email"];
  if (!email) {
    req.user = null;
    return next();
  }

  const db = await readDB();
  const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  req.user = user || null;
  next();
}

app.use(getAuthUser);

// Helper: resolve ownerId (Manager's email) for a given user context
const getOwnerId = (user) => {
  if (!user) return "admin@agencivo.com";
  if (user.role === "Member") {
    return user.parentId;
  }
  return user.email;
};

// --- API Endpoints ---

// 1. Auth: Register
app.post("/api/auth/register", async (req, res) => {
  const { email, password, agencyName } = req.body;
  if (!email || !password || !agencyName) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
  if (!gmailRegex.test(email.trim().toLowerCase())) {
    return res.status(400).json({ error: "Only Gmail accounts are allowed (e.g. name@gmail.com)." });
  }

  const db = await readDB();
  const exists = db.users.some(u => u.email.toLowerCase() === email.toLowerCase());
  if (exists) {
    return res.status(400).json({ error: "Email already registered." });
  }

  const newUser = {
    email,
    password,
    agencyName,
    role: "Manager",
    permissions: ["dashboard", "clients", "briefs", "projects", "team", "messages", "analytics", "templates", "settings"],
    dotColor: "#FF6A00"
  };
  
  db.users.push(newUser);
  await writeDB(db);

  res.status(201).json({
    success: true,
    user: {
      email,
      agencyName,
      role: newUser.role,
      permissions: newUser.permissions,
      dotColor: newUser.dotColor
    }
  });
});

// 2. Auth: Login
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Missing email or password." });
  }

  const db = await readDB();
  const user = db.users.find(
    u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );

  if (!user) {
    return res.status(401).json({ error: "Invalid email or password." });
  }

  res.json({
    success: true,
    user: {
      email: user.email,
      agencyName: user.agencyName,
      role: user.role,
      permissions: user.permissions || [],
      dotColor: user.dotColor || "#FF6A00",
      parentId: user.parentId
    }
  });
});

// 3. User Settings: Update Theme Dot Color / Agency Name
app.put("/api/user/settings", async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized." });
  }

  const { dotColor, agencyName } = req.body;
  const db = await readDB();
  const userIndex = db.users.findIndex(u => u.email.toLowerCase() === req.user.email.toLowerCase());

  if (userIndex === -1) {
    return res.status(404).json({ error: "User not found." });
  }

  if (dotColor) db.users[userIndex].dotColor = dotColor;
  if (agencyName) db.users[userIndex].agencyName = agencyName;

  // If this is a Manager, sync dotColor/agencyName to team members
  if (db.users[userIndex].role === "Manager") {
    db.users = db.users.map(u => {
      if (u.parentId === db.users[userIndex].email) {
        return {
          ...u,
          dotColor: dotColor || u.dotColor,
          agencyName: agencyName || u.agencyName
        };
      }
      return u;
    });
  }

  await writeDB(db);
  res.json({
    success: true,
    user: {
      email: db.users[userIndex].email,
      agencyName: db.users[userIndex].agencyName,
      role: db.users[userIndex].role,
      permissions: db.users[userIndex].permissions,
      dotColor: db.users[userIndex].dotColor,
      parentId: db.users[userIndex].parentId
    }
  });
});

// 4. Briefs: Generate Code
app.post("/api/briefs/generate-code", async (req, res) => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const segment = (len) => {
    let s = "";
    for (let i = 0; i < len; i++) {
      s += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return s;
  };
  
  const code = `AC-${segment(4)}-${segment(4)}`;
  const id = `brief-${Date.now()}`;
  const ownerId = getOwnerId(req.user);
  
  const { projectType, requiredDesigns } = req.body || {};

  const newPlaceholder = {
    id,
    code,
    brandName: "Pending Client",
    projectType: projectType || "Brief Pending",
    status: "Code Unused",
    submittedAt: new Date().toISOString(),
    isCodeOnly: true,
    colors: [],
    requiredDesigns: requiredDesigns || [],
    identityVision: "",
    notes: "",
    ownerId
  };

  const db = await readDB();
  db.briefs.unshift(newPlaceholder);
  await writeDB(db);

  res.status(201).json({ code, briefId: id });
});

// 5. Briefs: Validate Code (Public)
app.get("/api/briefs/validate-code/:code", async (req, res) => {
  const codeParam = req.params.code.trim().toUpperCase();
  const db = await readDB();
  const brief = db.briefs.find(b => b.code === codeParam);

  if (brief) {
    const agencyUser = db.users.find(u => u.email.toLowerCase() === brief.ownerId.toLowerCase());
    const agencyDotColor = agencyUser ? agencyUser.dotColor : "#FF6A00";
    res.json({ valid: true, briefId: brief.id, brief: { ...brief, agencyDotColor } });
  } else {
    res.json({ valid: false });
  }
});

// 6. Briefs: Client Submission (Public)
app.post("/api/briefs/submit/:briefId", async (req, res) => {
  const briefId = req.params.briefId;
  const formData = req.body;

  const db = await readDB();
  const briefIndex = db.briefs.findIndex(b => b.id === briefId);

  if (briefIndex === -1) {
    return res.status(404).json({ error: "Brief placeholder not found." });
  }

  const existingBrief = db.briefs[briefIndex];

  // Update brief details
  db.briefs[briefIndex] = {
    ...existingBrief,
    brandName: formData.brandName,
    projectType: formData.requiredDesigns?.[0]?.name 
      ? `${formData.requiredDesigns[0].name} Package` 
      : "Design Services",
    status: "In Progress",
    submittedAt: new Date().toISOString(),
    colors: formData.colors,
    targetAgeMin: formData.targetAgeMin,
    targetAgeMax: formData.targetAgeMax,
    requiredDesigns: formData.requiredDesigns,
    notes: formData.notes,
    isCodeOnly: false
  };

  // Push notification for the agency owner
  const notifId = `notif-${Date.now()}`;
  const newNotif = {
    id: notifId,
    title: "New brief received",
    desc: `${formData.brandName} submitted brief for code ${existingBrief.code}.`,
    time: "Just now",
    unread: true,
    briefId,
    ownerId: existingBrief.ownerId
  };
  db.notifications.unshift(newNotif);

  // Initialize messaging logs for this brief
  db.messages[briefId] = [
    {
      id: "msg-init",
      sender: "system",
      text: `Chat initialized. Welcome to your collaborative workspace for brand: ${formData.brandName}.`,
      time: new Date().toISOString()
    }
  ];

  await writeDB(db);

  res.json({ success: true, briefId });
});

// 7. Briefs: Get Briefs filtered by owner context
app.get("/api/briefs", async (req, res) => {
  const db = await readDB();
  const ownerId = getOwnerId(req.user);
  const filtered = db.briefs.filter(b => b.ownerId === ownerId);
  res.json(filtered);
});

// 8. Briefs: Update Status
app.put("/api/briefs/:briefId/status", async (req, res) => {
  const briefId = req.params.briefId;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ error: "Missing status field." });
  }

  const db = await readDB();
  const briefIndex = db.briefs.findIndex(b => b.id === briefId);

  if (briefIndex === -1) {
    return res.status(404).json({ error: "Brief not found." });
  }

  db.briefs[briefIndex].status = status;
  await writeDB(db);

  res.json({ success: true });
});

// 9. Notifications: Get Notifications
app.get("/api/notifications", async (req, res) => {
  const db = await readDB();
  const ownerId = getOwnerId(req.user);
  const filtered = db.notifications.filter(n => n.ownerId === ownerId);
  res.json(filtered);
});

// 10. Notifications: Mark All Read
app.post("/api/notifications/read-all", async (req, res) => {
  const db = await readDB();
  const ownerId = getOwnerId(req.user);
  db.notifications = db.notifications.map(n => {
    if (n.ownerId === ownerId) {
      return { ...n, unread: false };
    }
    return n;
  });
  await writeDB(db);
  res.json({ success: true });
});

// --- Team Management Endpoints ---

// 11. Team: Get all team members of this agency
app.get("/api/team", async (req, res) => {
  const db = await readDB();
  const ownerId = getOwnerId(req.user);

  // Return the manager plus any members of this manager
  const team = db.users.filter(
    u => u.email.toLowerCase() === ownerId.toLowerCase() || u.parentId === ownerId
  ).map(u => ({
    email: u.email,
    agencyName: u.agencyName,
    role: u.role,
    permissions: u.permissions || [],
    dotColor: u.dotColor
  }));

  res.json(team);
});

// 12. Team: Add Team Member
app.post("/api/team/add", async (req, res) => {
  if (!req.user || req.user.role !== "Manager") {
    return res.status(403).json({ error: "Only managers can add team members." });
  }

  const { email, password, permissions, roleDescription } = req.body;
  if (!email || !password || !permissions) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  const db = await readDB();
  const exists = db.users.some(u => u.email.toLowerCase() === email.toLowerCase());
  if (exists) {
    return res.status(400).json({ error: "User email already exists." });
  }

  const newMember = {
    email: email.trim(),
    password: password.trim(),
    agencyName: req.user.agencyName,
    role: "Member",
    roleDescription: roleDescription || "Team Member",
    parentId: req.user.email,
    permissions: permissions, // array of page paths
    dotColor: req.user.dotColor || "#FF6A00"
  };

  db.users.push(newMember);
  await writeDB(db);

  res.status(201).json({ success: true, member: { email: newMember.email, roleDescription: newMember.roleDescription } });
});

// 13. Team: Update Permissions
app.put("/api/team/:memberEmail/permissions", async (req, res) => {
  if (!req.user || req.user.role !== "Manager") {
    return res.status(403).json({ error: "Only managers can modify team permissions." });
  }

  const memberEmail = req.params.memberEmail.toLowerCase();
  const { permissions } = req.body;

  if (!permissions) {
    return res.status(400).json({ error: "Missing permissions array." });
  }

  const db = await readDB();
  const memberIndex = db.users.findIndex(
    u => u.email.toLowerCase() === memberEmail && u.parentId === req.user.email
  );

  if (memberIndex === -1) {
    return res.status(404).json({ error: "Team member not found under your agency." });
  }

  db.users[memberIndex].permissions = permissions;
  await writeDB(db);

  res.json({ success: true });
});

// --- Chat Messaging Endpoints ---

// 14. Messages: Get messages for a brief/client
app.get("/api/messages/:briefId", async (req, res) => {
  const briefId = req.params.briefId;
  const db = await readDB();
  const chatLog = db.messages[briefId] || [];
  res.json(chatLog);
});

// 15. Messages: Send Message
app.post("/api/messages/:briefId", async (req, res) => {
  const briefId = req.params.briefId;
  const { sender, text } = req.body;

  if (!text || !sender) {
    return res.status(400).json({ error: "Missing sender or text." });
  }

  const db = await readDB();
  if (!db.messages[briefId]) {
    db.messages[briefId] = [];
  }

  const newMessage = {
    id: `msg-${Date.now()}`,
    sender,
    text,
    time: new Date().toISOString()
  };

  db.messages[briefId].push(newMessage);
  await writeDB(db);

  res.status(201).json({ success: true, message: newMessage });

  // If agency sent a message, simulate client reply after 1.5 seconds
  if (sender === "agency") {
    setTimeout(async () => {
      const refreshedDb = await readDB();
      const brief = refreshedDb.briefs.find(b => b.id === briefId);
      const brand = brief ? brief.brandName : "Client";
      
      const clientReplies = [
        `Thanks for the update! Let me know if you need anything else for the designs.`,
        `That sounds great. I'll discuss this with our product team and get back to you shortly.`,
        `Perfect. Can you let me know what the current status is?`,
        `We really like the direction. I've uploaded additional assets to our team drive.`,
        `Yes, we agree with this approach. Looking forward to reviewing the first drafts!`
      ];
      
      const randomReply = clientReplies[Math.floor(Math.random() * clientReplies.length)];

      const clientReplyMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: "client",
        text: `[${brand}] ${randomReply}`,
        time: new Date().toISOString()
      };

      refreshedDb.messages[briefId].push(clientReplyMessage);
      await writeDB(refreshedDb);
      console.log(`[SIMULATED REPLY] Sent reply to brief ${briefId}`);
    }, 1500);
  }
});

// 17. Briefs: Submit Feedback (Public)
app.post("/api/briefs/:briefId/feedback", async (req, res) => {
  const briefId = req.params.briefId;
  const { designRating, serviceRating, comments } = req.body;

  if (!designRating || !serviceRating) {
    return res.status(400).json({ error: "Missing design or service rating." });
  }

  const db = await readDB();
  const briefIndex = db.briefs.findIndex(b => b.id === briefId);

  if (briefIndex === -1) {
    return res.status(404).json({ error: "Brief not found." });
  }

  db.briefs[briefIndex].feedback = {
    designRating: Number(designRating),
    serviceRating: Number(serviceRating),
    comments: comments || "",
    submittedAt: new Date().toISOString()
  };

  await writeDB(db);
  res.json({ success: true });
});

// 16. Support: Submit Ticket
app.post("/api/support", async (req, res) => {
  const { email, message } = req.body;
  if (!email || !message) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  const db = await readDB();
  const ticket = {
    id: `ticket-${Date.now()}`,
    email,
    message,
    submittedAt: new Date().toISOString()
  };
  db.supportTickets.push(ticket);
  await writeDB(db);

  res.status(201).json({ success: true });
});

// Serve React static assets
const distPath = path.resolve(__dirname, "../dist");
app.use(express.static(distPath));

app.get("/{*splat}", (req, res, next) => {
  if (req.path.startsWith("/api")) {
    return next();
  }
  res.sendFile(path.resolve(distPath, "index.html"));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});
