import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";

// Import question routes
import {
  getQuestions,
  getQuestion,
  createQuestion,
  voteQuestion,
  createAnswer,
  voteAnswer,
  acceptAnswer,
  createComment,
  getComments,
  voteComment,
} from "./routes/questions";

// Import auth routes
import {
  login,
  register,
  logout,
  getCurrentUser,
  getUserProfile,
  updateReputation,
} from "./routes/auth";

// Import notification routes
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  createNotification,
  deleteNotification,
  getStats,
} from "./routes/notifications";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health check endpoints
  app.get("/api/ping", (_req, res) => {
    res.json({ message: "StackIt API Server Running", version: "1.0.0" });
  });

  app.get("/api/demo", handleDemo);

  // Question endpoints
  app.get("/api/questions", getQuestions);
  app.get("/api/questions/:id", getQuestion);
  app.post("/api/questions", createQuestion);
  app.post("/api/questions/:id/vote", voteQuestion);

  // Answer endpoints
  app.post("/api/answers", createAnswer);
  app.post("/api/answers/:id/vote", voteAnswer);
  app.post("/api/answers/:id/accept", acceptAnswer);

  // Comment endpoints
  app.get("/api/comments", getComments);
  app.post("/api/comments", createComment);
  app.post("/api/comments/:id/vote", voteComment);

  // Authentication endpoints
  app.post("/api/auth/login", login);
  app.post("/api/auth/register", register);
  app.post("/api/auth/logout", logout);
  app.get("/api/auth/me", getCurrentUser);
  app.get("/api/users/:id", getUserProfile);
  app.post("/api/users/:id/reputation", updateReputation);

  // Notification endpoints
  app.get("/api/notifications/:userId", getNotifications);
  app.post("/api/notifications/:id/read", markAsRead);
  app.post("/api/notifications/:userId/read-all", markAllAsRead);
  app.post("/api/notifications", createNotification);
  app.delete("/api/notifications/:id", deleteNotification);
  app.get("/api/notifications/:userId/stats", getStats);

  // Search endpoint
  app.get("/api/search", (req, res) => {
    const { q, type = "all" } = req.query;

    if (!q || typeof q !== "string") {
      return res.status(400).json({ error: "Search query is required" });
    }

    // This would integrate with the questions search in a real app
    res.json({
      query: q,
      type,
      results: [],
      message: "Search functionality integrated with questions endpoint",
    });
  });

  // Tags endpoint
  app.get("/api/tags", (_req, res) => {
    const popularTags = [
      { name: "React", count: 1234 },
      { name: "JavaScript", count: 2345 },
      { name: "TypeScript", count: 987 },
      { name: "Node.js", count: 876 },
      { name: "Express", count: 654 },
      { name: "MongoDB", count: 543 },
      { name: "Authentication", count: 432 },
      { name: "JWT", count: 321 },
      { name: "Hooks", count: 234 },
      { name: "State Management", count: 198 },
    ];

    res.json(popularTags);
  });

  // Stats endpoint
  app.get("/api/stats", (_req, res) => {
    res.json({
      totalQuestions: 1234,
      totalAnswers: 3456,
      totalUsers: 789,
      totalComments: 2345,
      questionsToday: 23,
      answersToday: 67,
      activeUsersToday: 145,
    });
  });

  return app;
}
