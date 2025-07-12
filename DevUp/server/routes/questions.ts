import { RequestHandler } from "express";

interface Question {
  id: number;
  title: string;
  description: string;
  author: string;
  authorId: string;
  tags: string[];
  votes: number;
  answers: number;
  views: number;
  timeAgo: string;
  hasAcceptedAnswer: boolean;
  isAnswered: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface Answer {
  id: number;
  questionId: number;
  content: string;
  author: string;
  authorId: string;
  authorReputation: number;
  votes: number;
  timeAgo: string;
  isAccepted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface Comment {
  id: number;
  content: string;
  author: string;
  authorId: string;
  votes: number;
  parentType: "question" | "answer";
  parentId: number;
  createdAt: Date;
  updatedAt: Date;
}

// Mock data storage (in production, this would be a database)
let questions: Question[] = [
  {
    id: 1,
    title: "How to implement authentication in React with JWT?",
    description:
      "I'm building a React application and I want to implement user authentication using JWT tokens. What's the best approach for handling login, logout, and protecting routes?",
    author: "john_doe",
    authorId: "1",
    tags: ["React", "JWT", "Authentication", "JavaScript"],
    votes: 15,
    answers: 2,
    views: 124,
    timeAgo: "2 hours ago",
    hasAcceptedAnswer: true,
    isAnswered: true,
    createdAt: new Date("2024-01-01T10:00:00Z"),
    updatedAt: new Date("2024-01-01T12:00:00Z"),
  },
];

let answers: Answer[] = [
  {
    id: 1,
    questionId: 1,
    content: `You're right to be concerned about storing JWT tokens in localStorage. Here are the main approaches and their trade-offs:

## 1. HttpOnly Cookies (Recommended)

This is generally the most secure approach.`,
    author: "security_expert",
    authorId: "6",
    authorReputation: 5678,
    votes: 12,
    timeAgo: "1 hour ago",
    isAccepted: true,
    createdAt: new Date("2024-01-01T11:00:00Z"),
    updatedAt: new Date("2024-01-01T11:00:00Z"),
  },
];

let comments: Comment[] = [
  {
    id: 1,
    content: "Great question! I've been wondering about this too.",
    author: "curious_dev",
    authorId: "8",
    votes: 2,
    parentType: "question",
    parentId: 1,
    createdAt: new Date("2024-01-01T11:30:00Z"),
    updatedAt: new Date("2024-01-01T11:30:00Z"),
  },
];

// Get all questions
export const getQuestions: RequestHandler = (req, res) => {
  const { filter, search, limit = 10, offset = 0 } = req.query;

  let filteredQuestions = [...questions];

  // Apply search filter
  if (search && typeof search === "string") {
    const searchLower = search.toLowerCase();
    filteredQuestions = filteredQuestions.filter(
      (q) =>
        q.title.toLowerCase().includes(searchLower) ||
        q.description.toLowerCase().includes(searchLower) ||
        q.tags.some((tag) => tag.toLowerCase().includes(searchLower)),
    );
  }

  // Apply category filter
  if (filter) {
    switch (filter) {
      case "unanswered":
        filteredQuestions = filteredQuestions.filter((q) => !q.isAnswered);
        break;
      case "votes":
        filteredQuestions.sort((a, b) => b.votes - a.votes);
        break;
      case "active":
        filteredQuestions.sort(
          (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime(),
        );
        break;
      case "newest":
      default:
        filteredQuestions.sort(
          (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
        );
        break;
    }
  }

  // Apply pagination
  const startIndex = Number(offset);
  const limitNum = Number(limit);
  const paginatedQuestions = filteredQuestions.slice(
    startIndex,
    startIndex + limitNum,
  );

  res.json({
    questions: paginatedQuestions,
    total: filteredQuestions.length,
    hasMore: startIndex + limitNum < filteredQuestions.length,
  });
};

// Get single question with answers
export const getQuestion: RequestHandler = (req, res) => {
  const { id } = req.params;
  const questionId = Number(id);

  const question = questions.find((q) => q.id === questionId);
  if (!question) {
    return res.status(404).json({ error: "Question not found" });
  }

  // Increment view count
  question.views += 1;

  const questionAnswers = answers.filter((a) => a.questionId === questionId);
  const questionComments = comments.filter(
    (c) => c.parentType === "question" && c.parentId === questionId,
  );

  res.json({
    question,
    answers: questionAnswers,
    comments: questionComments,
  });
};

// Create new question
export const createQuestion: RequestHandler = (req, res) => {
  const { title, description, tags, author, authorId } = req.body;

  if (!title || !description || !tags || !author) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const newQuestion: Question = {
    id: Date.now(),
    title: title.trim(),
    description: description.trim(),
    author,
    authorId,
    tags,
    votes: 0,
    answers: 0,
    views: 1,
    timeAgo: "just now",
    hasAcceptedAnswer: false,
    isAnswered: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  questions.unshift(newQuestion);

  res.status(201).json(newQuestion);
};

// Vote on question
export const voteQuestion: RequestHandler = (req, res) => {
  const { id } = req.params;
  const { vote } = req.body; // -1, 0, or 1
  const questionId = Number(id);

  const question = questions.find((q) => q.id === questionId);
  if (!question) {
    return res.status(404).json({ error: "Question not found" });
  }

  // In a real app, you'd track user votes in the database
  question.votes += vote;
  question.updatedAt = new Date();

  res.json({ votes: question.votes });
};

// Create answer
export const createAnswer: RequestHandler = (req, res) => {
  const { questionId, content, author, authorId, authorReputation } = req.body;

  if (!questionId || !content || !author) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const question = questions.find((q) => q.id === Number(questionId));
  if (!question) {
    return res.status(404).json({ error: "Question not found" });
  }

  const newAnswer: Answer = {
    id: Date.now(),
    questionId: Number(questionId),
    content: content.trim(),
    author,
    authorId,
    authorReputation: authorReputation || 1,
    votes: 0,
    timeAgo: "just now",
    isAccepted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  answers.push(newAnswer);

  // Update question stats
  question.answers += 1;
  question.isAnswered = true;
  question.updatedAt = new Date();

  res.status(201).json(newAnswer);
};

// Vote on answer
export const voteAnswer: RequestHandler = (req, res) => {
  const { id } = req.params;
  const { vote } = req.body;
  const answerId = Number(id);

  const answer = answers.find((a) => a.id === answerId);
  if (!answer) {
    return res.status(404).json({ error: "Answer not found" });
  }

  answer.votes += vote;
  answer.updatedAt = new Date();

  res.json({ votes: answer.votes });
};

// Accept answer
export const acceptAnswer: RequestHandler = (req, res) => {
  const { id } = req.params;
  const answerId = Number(id);

  const answer = answers.find((a) => a.id === answerId);
  if (!answer) {
    return res.status(404).json({ error: "Answer not found" });
  }

  // Unaccept all other answers for this question
  answers.forEach((a) => {
    if (a.questionId === answer.questionId) {
      a.isAccepted = a.id === answerId;
    }
  });

  // Update question
  const question = questions.find((q) => q.id === answer.questionId);
  if (question) {
    question.hasAcceptedAnswer = true;
    question.updatedAt = new Date();
  }

  res.json({ success: true });
};

// Create comment
export const createComment: RequestHandler = (req, res) => {
  const { content, author, authorId, parentType, parentId } = req.body;

  if (!content || !author || !parentType || !parentId) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const newComment: Comment = {
    id: Date.now(),
    content: content.trim(),
    author,
    authorId,
    votes: 0,
    parentType,
    parentId: Number(parentId),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  comments.push(newComment);

  res.status(201).json(newComment);
};

// Get comments for parent
export const getComments: RequestHandler = (req, res) => {
  const { parentType, parentId } = req.query;

  if (!parentType || !parentId) {
    return res.status(400).json({ error: "Missing parentType or parentId" });
  }

  const parentComments = comments.filter(
    (c) =>
      c.parentType === parentType && c.parentId === Number(parentId as string),
  );

  res.json(parentComments);
};

// Vote on comment
export const voteComment: RequestHandler = (req, res) => {
  const { id } = req.params;
  const { vote } = req.body;
  const commentId = Number(id);

  const comment = comments.find((c) => c.id === commentId);
  if (!comment) {
    return res.status(404).json({ error: "Comment not found" });
  }

  comment.votes += vote;
  comment.updatedAt = new Date();

  res.json({ votes: comment.votes });
};
