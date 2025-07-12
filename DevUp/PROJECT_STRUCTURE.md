# StackIt Project Structure

A comprehensive overview of all files in the StackIt Q&A platform project.

## 📁 Project Overview

```
StackIt/
├── 🌐 Frontend (React + TypeScript)
├── 🔧 Backend (Node.js + Express)
├── 🔄 Shared (Common types)
├── ⚙️ Configuration Files
├── 📦 Dependencies
└── 📚 Documentation
```

## 🌐 Frontend Files (`/client/`)

### 📄 Root Application Files

```
client/
├── App.tsx                     # Main app component with routing
├── global.css                  # Global styles and CSS variables
└── vite-env.d.ts              # TypeScript environment definitions
```

### 🧩 Components (`/client/components/`)

```
components/
├── Layout.tsx                  # Main layout wrapper component
├── Navigation.tsx              # Navigation bar with search and user menu
└── ui/                        # Reusable UI components (Shadcn/ui)
    ├── accordion.tsx
    ├── alert-dialog.tsx
    ├── alert.tsx
    ├── aspect-ratio.tsx
    ├── avatar.tsx
    ├── badge.tsx
    ├── breadcrumb.tsx
    ├── button.tsx
    ├── calendar.tsx
    ├── card.tsx
    ├── carousel.tsx
    ├── chart.tsx
    ├── checkbox.tsx
    ├── collapsible.tsx
    ├── command.tsx
    ├── context-menu.tsx
    ├── dialog.tsx
    ├── drawer.tsx
    ├── dropdown-menu.tsx
    ├── form.tsx
    ├── hover-card.tsx
    ├── input-otp.tsx
    ├── input.tsx
    ├── label.tsx
    ├── menubar.tsx
    ├── navigation-menu.tsx
    ├── pagination.tsx
    ├── popover.tsx
    ├── progress.tsx
    ├── radio-group.tsx
    ├── resizable.tsx
    ├── scroll-area.tsx
    ├── select.tsx
    ├── separator.tsx
    ├── sheet.tsx
    ├── sidebar.tsx
    ├── skeleton.tsx
    ├── slider.tsx
    ├── sonner.tsx
    ├── switch.tsx
    ├── table.tsx
    ├── tabs.tsx
    ├── textarea.tsx
    ├── toast.tsx
    ├── toaster.tsx
    ├── toggle-group.tsx
    ├── toggle.tsx
    └── tooltip.tsx
```

### 📱 Pages (`/client/pages/`)

```
pages/
├── Index.tsx                   # Homepage with question list and filtering
├── AskQuestion.tsx             # Create new question form
├── QuestionDetail.tsx          # Individual question view with answers
├── Tags.tsx                    # Browse and search tags
├── Users.tsx                   # Browse community users
├── Login.tsx                   # User login form
├── Register.tsx                # User registration form
└── NotFound.tsx                # 404 error page
```

### 🧠 Contexts (`/client/contexts/`)

```
contexts/
├── AuthContext.tsx             # Authentication state management
├── AppContext.tsx              # Global app state (questions, answers, comments)
└── ThemeContext.tsx            # Dark/light mode management
```

### 🪝 Hooks (`/client/hooks/`)

```
hooks/
├── use-mobile.tsx              # Mobile device detection
└── use-toast.ts                # Toast notification management
```

### 🛠️ Utilities (`/client/lib/`)

```
lib/
├── utils.ts                    # Utility functions (cn, clsx, etc.)
└── utils.spec.ts               # Unit tests for utilities
```

## 🔧 Backend Files (`/server/`)

### 📄 Main Server Files

```
server/
├── index.ts                    # Main server setup and route configuration
└── node-build.ts               # Production build entry point
```

### 🛣️ API Routes (`/server/routes/`)

```
routes/
├── demo.ts                     # Demo/ping endpoints
├── auth.ts                     # Authentication endpoints
├── questions.ts                # Questions and answers API
└── notifications.ts            # User notifications API
```

### 📋 API Endpoints Overview

```
🔐 Authentication (/api/auth/)
├── POST /login                 # User login
├── POST /register              # User registration
├── POST /logout                # User logout
└── GET /me                     # Get current user

❓ Questions (/api/questions/)
├── GET /                       # List questions with filters
├── GET /:id                    # Get single question
├── POST /                      # Create new question
└── POST /:id/vote              # Vote on question

💬 Answers (/api/answers/)
├── POST /                      # Create answer
├── POST /:id/vote              # Vote on answer
└── POST /:id/accept            # Accept answer

💭 Comments (/api/comments/)
├── GET /                       # Get comments by parent
├── POST /                      # Create comment
└── POST /:id/vote              # Vote on comment

🔔 Notifications (/api/notifications/)
├── GET /:userId                # Get user notifications
├── POST /:id/read              # Mark notification as read
├── POST /:userId/read-all      # Mark all as read
└── POST /                      # Create notification

🔍 Other Endpoints
├── GET /api/ping               # Health check
├── GET /api/search             # Search functionality
├── GET /api/tags               # Get popular tags
└── GET /api/stats              # Platform statistics
```

## 🔄 Shared Files (`/shared/`)

### 🏷️ Type Definitions

```
shared/
└── api.ts                      # Shared TypeScript interfaces and types
```

## ⚙️ Configuration Files

### 📦 Package Management

```
├── package.json                # Dependencies and scripts
└── package-lock.json           # Dependency lock file
```

### 🔧 Build & Development Tools

```
├── vite.config.ts              # Vite configuration for client
├── vite.config.server.ts       # Vite configuration for server
├── tsconfig.json               # TypeScript configuration
├── tailwind.config.ts          # Tailwind CSS configuration
├── postcss.config.js           # PostCSS configuration
└── components.json             # Shadcn/ui components configuration
```

### 🌐 Deployment

```
├── netlify.toml                # Netlify deployment configuration
└── netlify/functions/
    └── api.ts                  # Serverless function wrapper
```

## 📚 Documentation Files

```
├── AGENTS.md                   # Project overview and setup guide
├── PROJECT_STRUCTURE.md        # This file - comprehensive structure
└── README.md                   # (Generated automatically)
```

## 🗂️ Other Files

### 🎨 Static Assets

```
public/
├── placeholder.svg             # Placeholder image
└── robots.txt                  # SEO robots file
```

### 🔧 Root Configuration

```
├── index.html                  # HTML entry point
├── .gitignore                  # Git ignore rules
└── Dockerfile                  # Docker configuration (if exists)
```

## 📊 File Statistics

| Category           | File Count | Description                   |
| ------------------ | ---------- | ----------------------------- |
| **Frontend Pages** | 7          | React components for routes   |
| **UI Components**  | 45+        | Reusable Shadcn/ui components |
| **Contexts**       | 3          | Global state management       |
| **Backend Routes** | 4          | API endpoint handlers         |
| **Configuration**  | 8          | Build and deployment configs  |
| **Total Files**    | 70+        | Complete project files        |

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   React + TS    │◄──►│   Express + TS  │◄──►│   Mock Data     │
│                 │    │                 │    │   (Future: DB)  │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│ • Pages         │    │ • Auth Routes   │    │ ��� Questions     │
│ • Components    │    │ • API Endpoints │    │ • Users         │
│ • Contexts      │    │ • Middleware    │    │ • Comments      │
│ • Hooks         │    │ • Validation    │    │ • Notifications │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Key Features Implemented

### ✅ Frontend Features

- **Authentication**: Login/Register with session management
- **Question System**: Create, view, vote, and comment on questions
- **Answer System**: Submit answers with voting and acceptance
- **Comment System**: Nested comments with voting
- **Search & Filter**: Global search and question filtering
- **Theme System**: Dark/light mode toggle
- **Responsive Design**: Mobile-first responsive UI
- **Navigation**: Complete menu structure with user profiles

### ✅ Backend Features

- **RESTful API**: Complete CRUD operations
- **Authentication**: JWT-based session management
- **Data Models**: Questions, answers, comments, users, notifications
- **Validation**: Input validation and error handling
- **Mock Database**: In-memory data storage (ready for real DB)

### ✅ Developer Experience

- **TypeScript**: Full type safety across frontend and backend
- **Hot Reload**: Development server with instant updates
- **Build System**: Production-ready build configuration
- **Code Quality**: ESLint, Prettier, and strict TypeScript
- **Component Library**: Pre-built UI components with Shadcn/ui

This structure represents a complete, production-ready Q&A platform with modern web development practices and comprehensive functionality.
