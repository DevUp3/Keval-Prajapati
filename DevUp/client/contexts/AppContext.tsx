import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

interface Question {
  id: number;
  title: string;
  description: string;
  author: string;
  tags: string[];
  votes: number;
  answers: number;
  views: number;
  timeAgo: string;
  hasAcceptedAnswer: boolean;
  isAnswered: boolean;
  authorId?: string;
  userVote?: number; // -1, 0, or 1
  isBookmarked?: boolean;
}

interface Answer {
  id: number;
  questionId: number;
  content: string;
  author: string;
  authorReputation: number;
  authorId: string;
  votes: number;
  timeAgo: string;
  isAccepted: boolean;
  userVote?: number;
}

interface Comment {
  id: number;
  content: string;
  author: string;
  authorId: string;
  timeAgo: string;
  votes: number;
  parentType: "question" | "answer";
  parentId: number; // questionId or answerId
  userVote?: number;
  mentions?: string[]; // mentioned usernames
}

interface Notification {
  id: string;
  type: "answer" | "comment" | "mention" | "vote" | "accepted";
  title: string;
  description: string;
  timeAgo: string;
  isRead: boolean;
  questionId?: number;
  answerId?: number;
  commentId?: number;
  fromUser?: string;
  content?: string;
  createdAt: Date;
}

interface AppContextType {
  questions: Question[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  notifications: Notification[];
  unreadNotifications: number;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  addQuestion: (
    question: Omit<
      Question,
      | "id"
      | "votes"
      | "answers"
      | "views"
      | "timeAgo"
      | "hasAcceptedAnswer"
      | "isAnswered"
    >,
  ) => void;
  updateQuestionVote: (questionId: number, vote: number) => void;
  toggleBookmark: (questionId: number) => void;
  addAnswer: (
    answer: Omit<Answer, "id" | "votes" | "timeAgo" | "userVote">,
  ) => void;
  updateAnswerVote: (answerId: number, vote: number) => void;
  acceptAnswer: (answerId: number) => void;
  getQuestionById: (id: number) => Question | undefined;
  getAnswersByQuestionId: (questionId: number) => Answer[];
  filteredQuestions: Question[];
  currentFilter: string;
  setCurrentFilter: (filter: string) => void;
  comments: Comment[];
  addComment: (
    comment: Omit<Comment, "id" | "timeAgo" | "votes" | "userVote">,
  ) => void;
  getCommentsByParent: (
    parentType: "question" | "answer",
    parentId: number,
  ) => Comment[];
  updateCommentVote: (commentId: number, vote: number) => void;
  createNotification: (
    notification: Omit<Notification, "id" | "createdAt">,
  ) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}

interface AppProviderProps {
  children: ReactNode;
}

// Mock data
const initialQuestions: Question[] = [
  {
    id: 1,
    title: "How to implement authentication in React with JWT?",
    description:
      "I'm building a React application and I want to implement user authentication using JWT tokens. What's the best approach for handling login, logout, and protecting routes?",
    author: "john_doe",
    authorId: "1",
    tags: ["React", "JWT", "Authentication", "JavaScript"],
    votes: 15,
    answers: 3,
    views: 124,
    timeAgo: "2 hours ago",
    hasAcceptedAnswer: true,
    isAnswered: true,
    userVote: 0,
    isBookmarked: false,
  },
  {
    id: 2,
    title: "Understanding React Hooks: useEffect vs useLayoutEffect",
    description:
      "What's the difference between useEffect and useLayoutEffect? When should I use one over the other? I'm confused about the timing of when these hooks run.",
    author: "react_learner",
    authorId: "2",
    tags: ["React", "Hooks", "useEffect", "JavaScript"],
    votes: 8,
    answers: 2,
    views: 89,
    timeAgo: "4 hours ago",
    hasAcceptedAnswer: false,
    isAnswered: true,
    userVote: 0,
    isBookmarked: false,
  },
  {
    id: 3,
    title: "Best practices for state management in large React applications",
    description:
      "I'm working on a large React application with complex state requirements. Should I use Redux, Zustand, or Context API? What are the pros and cons of each approach?",
    author: "dev_senior",
    authorId: "3",
    tags: ["React", "State Management", "Redux", "Context API"],
    votes: 23,
    answers: 5,
    views: 312,
    timeAgo: "1 day ago",
    hasAcceptedAnswer: true,
    isAnswered: true,
    userVote: 0,
    isBookmarked: true,
  },
  {
    id: 4,
    title: "How to optimize React app performance?",
    description:
      "My React application is becoming slow as it grows. What are the best techniques for optimizing performance? Should I use React.memo, useMemo, or useCallback?",
    author: "performance_guru",
    authorId: "4",
    tags: ["React", "Performance", "Optimization", "Memoization"],
    votes: 12,
    answers: 0,
    views: 45,
    timeAgo: "6 hours ago",
    hasAcceptedAnswer: false,
    isAnswered: false,
    userVote: 0,
    isBookmarked: false,
  },
  {
    id: 5,
    title: "TypeScript with React: Interface vs Type for props",
    description:
      "When defining component props in TypeScript with React, should I use interface or type? What are the practical differences and when should I choose one over the other?",
    author: "typescript_dev",
    authorId: "5",
    tags: ["TypeScript", "React", "Interface", "Types"],
    votes: 7,
    answers: 1,
    views: 67,
    timeAgo: "3 hours ago",
    hasAcceptedAnswer: false,
    isAnswered: true,
    userVote: 0,
    isBookmarked: false,
  },
];

const initialAnswers: Answer[] = [
  {
    id: 1,
    questionId: 1,
    content: `You're right to be concerned about storing JWT tokens in localStorage. Here are the main approaches and their trade-offs:

## 1. HttpOnly Cookies (Recommended)

This is generally the most secure approach:

\`\`\`javascript
// Server sets httpOnly cookie
res.cookie('token', jwt, { 
  httpOnly: true, 
  secure: true, 
  sameSite: 'strict' 
});

// Client-side - no need to handle token manually
const fetchData = async () => {
  const response = await fetch('/api/data', {
    credentials: 'include' // Important for cookies
  });
  return response.json();
};
\`\`\`

## 2. In-Memory Storage

Store tokens in React state or context:

\`\`\`javascript
const AuthContext = createContext();

function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  
  return (
    <AuthContext.Provider value={{ token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
}
\`\`\`

The httpOnly cookie approach is recommended because:
- Prevents XSS attacks
- Automatically handled by the browser
- Can be combined with CSRF protection`,
    author: "security_expert",
    authorId: "6",
    authorReputation: 5678,
    votes: 12,
    timeAgo: "1 hour ago",
    isAccepted: true,
    userVote: 0,
  },
  {
    id: 2,
    questionId: 1,
    content: `Another option is to use a library like \`react-query\` or \`swr\` with automatic token refresh:

\`\`\`javascript
import { useQuery } from 'react-query';

const useAuth = () => {
  return useQuery('auth', checkAuthStatus, {
    retry: false,
    refetchOnWindowFocus: false,
  });
};
\`\`\`

This approach gives you:
- Automatic token refresh
- Better error handling
- Optimistic updates
- Caching`,
    author: "react_guru",
    authorId: "7",
    authorReputation: 3456,
    votes: 7,
    timeAgo: "30 minutes ago",
    isAccepted: false,
    userVote: 0,
  },
];

const initialComments: Comment[] = [
  {
    id: 1,
    content: "Great question! I've been wondering about this too.",
    author: "curious_dev",
    authorId: "8",
    timeAgo: "30 minutes ago",
    votes: 2,
    parentType: "question",
    parentId: 1,
    userVote: 0,
  },
  {
    id: 2,
    content:
      "This is exactly what I needed. Thanks for the detailed explanation! @security_expert this is very helpful.",
    author: "beginner_coder",
    authorId: "9",
    timeAgo: "15 minutes ago",
    votes: 5,
    parentType: "answer",
    parentId: 1,
    userVote: 0,
    mentions: ["security_expert"],
  },
  {
    id: 3,
    content:
      "Have you considered using refresh tokens as well? @john_doe might find this useful.",
    author: "security_minded",
    authorId: "10",
    timeAgo: "10 minutes ago",
    votes: 1,
    parentType: "answer",
    parentId: 1,
    userVote: 0,
    mentions: ["john_doe"],
  },
];

const initialNotifications: Notification[] = [
  {
    id: "1",
    type: "answer",
    title: "Someone answered your question",
    description: '"How to implement authentication in React?"',
    timeAgo: "2 minutes ago",
    isRead: false,
    questionId: 1,
    fromUser: "security_expert",
    content: "You're right to be concerned about storing JWT tokens...",
    createdAt: new Date(Date.now() - 2 * 60 * 1000),
  },
  {
    id: "2",
    type: "mention",
    title: "@john_doe mentioned you",
    description:
      'In a comment: "Have you considered using refresh tokens as well?"',
    timeAgo: "5 minutes ago",
    isRead: false,
    questionId: 1,
    answerId: 1,
    commentId: 3,
    fromUser: "security_minded",
    content:
      "Have you considered using refresh tokens as well? @john_doe might find this useful.",
    createdAt: new Date(Date.now() - 5 * 60 * 1000),
  },
  {
    id: "3",
    type: "comment",
    title: "New comment on your answer",
    description: 'Someone commented: "This is exactly what I needed..."',
    timeAgo: "15 minutes ago",
    isRead: false,
    questionId: 1,
    answerId: 1,
    fromUser: "beginner_coder",
    content:
      "This is exactly what I needed. Thanks for the detailed explanation!",
    createdAt: new Date(Date.now() - 15 * 60 * 1000),
  },
  {
    id: "4",
    type: "vote",
    title: "Your answer received an upvote",
    description: '"Understanding React Context API"',
    timeAgo: "1 hour ago",
    isRead: true,
    questionId: 2,
    answerId: 2,
    fromUser: "react_enthusiast",
    createdAt: new Date(Date.now() - 60 * 60 * 1000),
  },
  {
    id: "5",
    type: "accepted",
    title: "Your answer was accepted",
    description: '"Best practices for state management"',
    timeAgo: "2 hours ago",
    isRead: true,
    questionId: 3,
    answerId: 3,
    fromUser: "dev_senior",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
];

export function AppProvider({ children }: AppProviderProps) {
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [answers, setAnswers] = useState<Answer[]>(initialAnswers);
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] =
    useState<Notification[]>(initialNotifications);
  const [currentFilter, setCurrentFilter] = useState("newest");

  const unreadNotifications = notifications.filter(
    (notification) => !notification.isRead,
  ).length;

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id
          ? { ...notification, isRead: true }
          : notification,
      ),
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, isRead: true })),
    );
  };

  const createNotification = (
    notification: Omit<Notification, "id" | "createdAt">,
  ) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setNotifications((prev) => [newNotification, ...prev]);
  };

  const addQuestion = (
    newQuestion: Omit<
      Question,
      | "id"
      | "votes"
      | "answers"
      | "views"
      | "timeAgo"
      | "hasAcceptedAnswer"
      | "isAnswered"
    >,
  ) => {
    const question: Question = {
      ...newQuestion,
      id: Date.now(),
      votes: 0,
      answers: 0,
      views: 1,
      timeAgo: "just now",
      hasAcceptedAnswer: false,
      isAnswered: false,
      userVote: 0,
      isBookmarked: false,
    };
    setQuestions((prev) => [question, ...prev]);
  };

  const updateQuestionVote = (questionId: number, vote: number) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id === questionId) {
          const oldVote = q.userVote || 0;
          const newVotes = q.votes - oldVote + vote;

          // Create notification for vote (if it's an upvote)
          if (vote > oldVote && q.authorId !== "1") {
            // Don't notify self
            createNotification({
              type: "vote",
              title: "Your question received an upvote",
              description: `"${q.title}"`,
              timeAgo: "just now",
              isRead: false,
              questionId: q.id,
              fromUser: "current_user", // In real app, get from auth context
            });
          }

          return { ...q, votes: newVotes, userVote: vote };
        }
        return q;
      }),
    );
  };

  const toggleBookmark = (questionId: number) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId ? { ...q, isBookmarked: !q.isBookmarked } : q,
      ),
    );
  };

  const addAnswer = (
    newAnswer: Omit<Answer, "id" | "votes" | "timeAgo" | "userVote">,
  ) => {
    const answer: Answer = {
      ...newAnswer,
      id: Date.now(),
      votes: 0,
      timeAgo: "just now",
      userVote: 0,
    };
    setAnswers((prev) => [...prev, answer]);

    // Update question answer count
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id === newAnswer.questionId) {
          // Create notification for question author
          if (q.authorId !== newAnswer.authorId) {
            // Don't notify self
            createNotification({
              type: "answer",
              title: "Someone answered your question",
              description: `"${q.title}"`,
              timeAgo: "just now",
              isRead: false,
              questionId: q.id,
              answerId: answer.id,
              fromUser: newAnswer.author,
              content: newAnswer.content.substring(0, 100) + "...",
            });
          }

          return { ...q, answers: q.answers + 1, isAnswered: true };
        }
        return q;
      }),
    );
  };

  const updateAnswerVote = (answerId: number, vote: number) => {
    setAnswers((prev) =>
      prev.map((a) => {
        if (a.id === answerId) {
          const oldVote = a.userVote || 0;
          const newVotes = a.votes - oldVote + vote;

          // Create notification for vote (if it's an upvote)
          if (vote > oldVote && a.authorId !== "1") {
            // Don't notify self
            createNotification({
              type: "vote",
              title: "Your answer received an upvote",
              description: `"${a.content.substring(0, 50)}..."`,
              timeAgo: "just now",
              isRead: false,
              questionId: a.questionId,
              answerId: a.id,
              fromUser: "current_user",
            });
          }

          return { ...a, votes: newVotes, userVote: vote };
        }
        return a;
      }),
    );
  };

  const acceptAnswer = (answerId: number) => {
    setAnswers((prev) =>
      prev.map((a) => {
        if (a.id === answerId) {
          // Create notification for answer author
          if (a.authorId !== "1") {
            // Don't notify self
            createNotification({
              type: "accepted",
              title: "Your answer was accepted",
              description: `"${a.content.substring(0, 50)}..."`,
              timeAgo: "just now",
              isRead: false,
              questionId: a.questionId,
              answerId: a.id,
              fromUser: "question_author",
            });
          }

          return { ...a, isAccepted: true };
        }
        return { ...a, isAccepted: false };
      }),
    );

    // Update question to mark as having accepted answer
    const answer = answers.find((a) => a.id === answerId);
    if (answer) {
      setQuestions((prev) =>
        prev.map((q) =>
          q.id === answer.questionId ? { ...q, hasAcceptedAnswer: true } : q,
        ),
      );
    }
  };

  const addComment = (
    newComment: Omit<Comment, "id" | "timeAgo" | "votes" | "userVote">,
  ) => {
    // Extract mentions from comment content
    const mentionRegex = /@(\w+)/g;
    const mentions = [];
    let match;
    while ((match = mentionRegex.exec(newComment.content)) !== null) {
      mentions.push(match[1]);
    }

    const comment: Comment = {
      ...newComment,
      id: Date.now(),
      timeAgo: "just now",
      votes: 0,
      userVote: 0,
      mentions,
    };
    setComments((prev) => [...prev, comment]);

    // Create mention notifications
    mentions.forEach((mentionedUsername) => {
      createNotification({
        type: "mention",
        title: `@${mentionedUsername} mentioned you`,
        description: `In a comment: "${newComment.content.substring(0, 50)}..."`,
        timeAgo: "just now",
        isRead: false,
        questionId:
          newComment.parentType === "question"
            ? newComment.parentId
            : undefined,
        answerId:
          newComment.parentType === "answer" ? newComment.parentId : undefined,
        commentId: comment.id,
        fromUser: newComment.author,
        content: newComment.content,
      });
    });

    // Create comment notification for parent author (if not self and not already mentioned)
    if (newComment.parentType === "answer") {
      const parentAnswer = answers.find((a) => a.id === newComment.parentId);
      if (
        parentAnswer &&
        parentAnswer.authorId !== newComment.authorId &&
        !mentions.includes(parentAnswer.author)
      ) {
        createNotification({
          type: "comment",
          title: "New comment on your answer",
          description: `"${newComment.content.substring(0, 50)}..."`,
          timeAgo: "just now",
          isRead: false,
          questionId: parentAnswer.questionId,
          answerId: parentAnswer.id,
          commentId: comment.id,
          fromUser: newComment.author,
          content: newComment.content,
        });
      }
    } else if (newComment.parentType === "question") {
      const parentQuestion = questions.find(
        (q) => q.id === newComment.parentId,
      );
      if (
        parentQuestion &&
        parentQuestion.authorId !== newComment.authorId &&
        !mentions.includes(parentQuestion.author)
      ) {
        createNotification({
          type: "comment",
          title: "New comment on your question",
          description: `"${newComment.content.substring(0, 50)}..."`,
          timeAgo: "just now",
          isRead: false,
          questionId: parentQuestion.id,
          commentId: comment.id,
          fromUser: newComment.author,
          content: newComment.content,
        });
      }
    }
  };

  const getCommentsByParent = (
    parentType: "question" | "answer",
    parentId: number,
  ) => {
    return comments.filter(
      (comment) =>
        comment.parentType === parentType && comment.parentId === parentId,
    );
  };

  const updateCommentVote = (commentId: number, vote: number) => {
    setComments((prev) =>
      prev.map((c) => {
        if (c.id === commentId) {
          const oldVote = c.userVote || 0;
          const newVotes = c.votes - oldVote + vote;
          return { ...c, votes: newVotes, userVote: vote };
        }
        return c;
      }),
    );
  };

  const getQuestionById = (id: number) => {
    return questions.find((q) => q.id === id);
  };

  const getAnswersByQuestionId = (questionId: number) => {
    return answers.filter((a) => a.questionId === questionId);
  };

  const filteredQuestions = questions.filter((question) => {
    const matchesSearch =
      searchQuery === "" ||
      question.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      question.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      question.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase()),
      );

    if (!matchesSearch) return false;

    switch (currentFilter) {
      case "unanswered":
        return !question.isAnswered;
      case "votes":
        return true; // Will be sorted by votes
      case "active":
        return true; // Will be sorted by recent activity
      case "newest":
      default:
        return true;
    }
  });

  const value: AppContextType = {
    questions,
    searchQuery,
    setSearchQuery,
    notifications,
    unreadNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    addQuestion,
    updateQuestionVote,
    toggleBookmark,
    addAnswer,
    updateAnswerVote,
    acceptAnswer,
    getQuestionById,
    getAnswersByQuestionId,
    filteredQuestions,
    currentFilter,
    setCurrentFilter,
    comments,
    addComment,
    getCommentsByParent,
    updateCommentVote,
    createNotification,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
