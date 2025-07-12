import { RequestHandler } from "express";

interface Notification {
  id: string;
  userId: string;
  type: "answer" | "comment" | "mention" | "vote" | "accepted";
  title: string;
  description: string;
  isRead: boolean;
  questionId?: number;
  answerId?: number;
  commentId?: number;
  createdAt: Date;
  updatedAt: Date;
}

// Mock notifications storage (in production, this would be a database)
let notifications: Notification[] = [
  {
    id: "1",
    userId: "1",
    type: "answer",
    title: "Someone answered your question",
    description: '"How to implement authentication in React?"',
    isRead: false,
    questionId: 1,
    createdAt: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
    updatedAt: new Date(Date.now() - 2 * 60 * 1000),
  },
  {
    id: "2",
    userId: "1",
    type: "mention",
    title: "@john_doe mentioned you",
    description: 'In the answer to "Best practices for React hooks"',
    isRead: false,
    questionId: 2,
    answerId: 3,
    createdAt: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    updatedAt: new Date(Date.now() - 5 * 60 * 1000),
  },
  {
    id: "3",
    userId: "1",
    type: "comment",
    title: "New comment on your answer",
    description: '"Understanding React Context API"',
    isRead: false,
    questionId: 3,
    answerId: 2,
    commentId: 5,
    createdAt: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
    updatedAt: new Date(Date.now() - 60 * 60 * 1000),
  },
  {
    id: "4",
    userId: "1",
    type: "vote",
    title: "Your answer received an upvote",
    description: '"How to optimize React performance?"',
    isRead: true,
    questionId: 4,
    answerId: 4,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: "5",
    userId: "1",
    type: "accepted",
    title: "Your answer was accepted",
    description: '"TypeScript with React: Interface vs Type"',
    isRead: true,
    questionId: 5,
    answerId: 6,
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    updatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
  },
];

// Get user notifications
export const getNotifications: RequestHandler = (req, res) => {
  const { userId } = req.params;
  const { limit = 10, offset = 0, unreadOnly } = req.query;

  let userNotifications = notifications.filter((n) => n.userId === userId);

  // Filter unread only if requested
  if (unreadOnly === "true") {
    userNotifications = userNotifications.filter((n) => !n.isRead);
  }

  // Sort by creation date (newest first)
  userNotifications.sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
  );

  // Apply pagination
  const startIndex = Number(offset);
  const limitNum = Number(limit);
  const paginatedNotifications = userNotifications.slice(
    startIndex,
    startIndex + limitNum,
  );

  // Format notifications with relative time
  const formattedNotifications = paginatedNotifications.map((notification) => {
    const now = new Date();
    const diff = now.getTime() - notification.createdAt.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    let timeAgo = "just now";
    if (days > 0) {
      timeAgo = `${days} day${days > 1 ? "s" : ""} ago`;
    } else if (hours > 0) {
      timeAgo = `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else if (minutes > 0) {
      timeAgo = `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    }

    return {
      ...notification,
      timeAgo,
    };
  });

  const unreadCount = notifications.filter(
    (n) => n.userId === userId && !n.isRead,
  ).length;

  res.json({
    notifications: formattedNotifications,
    total: userNotifications.length,
    unreadCount,
    hasMore: startIndex + limitNum < userNotifications.length,
  });
};

// Mark notification as read
export const markAsRead: RequestHandler = (req, res) => {
  const { id } = req.params;

  const notification = notifications.find((n) => n.id === id);
  if (!notification) {
    return res.status(404).json({ error: "Notification not found" });
  }

  notification.isRead = true;
  notification.updatedAt = new Date();

  res.json({ success: true });
};

// Mark all notifications as read for user
export const markAllAsRead: RequestHandler = (req, res) => {
  const { userId } = req.params;

  const userNotifications = notifications.filter((n) => n.userId === userId);
  userNotifications.forEach((notification) => {
    notification.isRead = true;
    notification.updatedAt = new Date();
  });

  res.json({ success: true, markedCount: userNotifications.length });
};

// Create notification (internal endpoint)
export const createNotification: RequestHandler = (req, res) => {
  const { userId, type, title, description, questionId, answerId, commentId } =
    req.body;

  if (!userId || !type || !title || !description) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const newNotification: Notification = {
    id: Date.now().toString(),
    userId,
    type,
    title,
    description,
    isRead: false,
    questionId: questionId ? Number(questionId) : undefined,
    answerId: answerId ? Number(answerId) : undefined,
    commentId: commentId ? Number(commentId) : undefined,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  notifications.unshift(newNotification);

  res.status(201).json(newNotification);
};

// Delete notification
export const deleteNotification: RequestHandler = (req, res) => {
  const { id } = req.params;

  const notificationIndex = notifications.findIndex((n) => n.id === id);
  if (notificationIndex === -1) {
    return res.status(404).json({ error: "Notification not found" });
  }

  notifications.splice(notificationIndex, 1);

  res.json({ success: true });
};

// Get notification statistics
export const getStats: RequestHandler = (req, res) => {
  const { userId } = req.params;

  const userNotifications = notifications.filter((n) => n.userId === userId);
  const unreadCount = userNotifications.filter((n) => !n.isRead).length;
  const totalCount = userNotifications.length;

  const typeStats = userNotifications.reduce(
    (acc, notification) => {
      acc[notification.type] = (acc[notification.type] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  res.json({
    totalCount,
    unreadCount,
    typeStats,
  });
};
