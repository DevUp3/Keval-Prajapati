import { RequestHandler } from "express";

interface User {
  id: string;
  username: string;
  email: string;
  reputation: number;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Mock user storage (in production, this would be a database)
let users: User[] = [
  {
    id: "1",
    username: "john_doe",
    email: "demo@stackit.com",
    reputation: 1234,
    createdAt: new Date("2024-01-01T00:00:00Z"),
    updatedAt: new Date("2024-01-01T00:00:00Z"),
  },
  {
    id: "6",
    username: "security_expert",
    email: "security@stackit.com",
    reputation: 5678,
    createdAt: new Date("2024-01-01T00:00:00Z"),
    updatedAt: new Date("2024-01-01T00:00:00Z"),
  },
];

// Mock sessions storage (in production, use Redis or database)
let sessions: { [key: string]: string } = {};

// Login endpoint
export const login: RequestHandler = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  // Mock authentication - in production, hash and compare passwords
  if (email === "demo@stackit.com" && password === "password") {
    const user = users.find((u) => u.email === email);
    if (user) {
      // Create session token
      const sessionToken = `session_${Date.now()}_${Math.random()}`;
      sessions[sessionToken] = user.id;

      res.json({
        success: true,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          reputation: user.reputation,
        },
        token: sessionToken,
      });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
};

// Register endpoint
export const register: RequestHandler = (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ error: "Username, email, and password are required" });
  }

  // Check if user exists
  const existingUser = users.find(
    (u) => u.email === email || u.username === username,
  );
  if (existingUser) {
    return res.status(409).json({ error: "User already exists" });
  }

  // Create new user
  const newUser: User = {
    id: Date.now().toString(),
    username: username.trim(),
    email: email.trim().toLowerCase(),
    reputation: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  users.push(newUser);

  // Create session token
  const sessionToken = `session_${Date.now()}_${Math.random()}`;
  sessions[sessionToken] = newUser.id;

  res.status(201).json({
    success: true,
    user: {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      reputation: newUser.reputation,
    },
    token: sessionToken,
  });
};

// Logout endpoint
export const logout: RequestHandler = (req, res) => {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (token && sessions[token]) {
    delete sessions[token];
  }

  res.json({ success: true });
};

// Get current user endpoint
export const getCurrentUser: RequestHandler = (req, res) => {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token || !sessions[token]) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const userId = sessions[token];
  const user = users.find((u) => u.id === userId);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.json({
    id: user.id,
    username: user.username,
    email: user.email,
    reputation: user.reputation,
  });
};

// Get user profile endpoint
export const getUserProfile: RequestHandler = (req, res) => {
  const { id } = req.params;

  const user = users.find((u) => u.id === id);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.json({
    id: user.id,
    username: user.username,
    reputation: user.reputation,
    createdAt: user.createdAt,
  });
};

// Update user reputation (internal endpoint)
export const updateReputation: RequestHandler = (req, res) => {
  const { userId, change } = req.body;

  const user = users.find((u) => u.id === userId);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  user.reputation += change;
  user.updatedAt = new Date();

  res.json({ reputation: user.reputation });
};
