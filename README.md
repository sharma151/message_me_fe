# ChatsApp - Real-Time Messaging Application

A modern, WhatsApp-like real-time messaging application built with React, TypeScript, Vite, and Socket.IO.

![ChatsApp](./public/logo192.png)

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the App](#running-the-app)
- [Scripts](#scripts)
- [Architecture](#architecture)
  - [Routing](#routing)
  - [State Management](#state-management)
  - [API Integration](#api-integration)
  - [Real-time Communication](#real-time-communication)
- [Key Components](#key-components)
- [Authentication](#authentication)
- [Contributing](#contributing)

## Overview

ChatsApp is a feature-rich messaging platform that enables users to:
- Send and receive real-time messages via WebSockets
- Create individual and group chat rooms
- Search and manage contacts
- Edit and delete messages
- Upload and manage user avatars
- Authenticate with JWT tokens

The application follows a WhatsApp-inspired design with a dark theme and intuitive user interface.

## Features

- **Real-time Messaging**: Instant message delivery using Socket.IO
- **Group Chats**: Create and manage group conversations
- **User Authentication**: Secure login/register with JWT tokens
- **Message Management**: Edit and delete sent messages
- **User Search**: Find and connect with other users
- **Responsive Design**: WhatsApp-like interface with resizable panels
- **Toast Notifications**: Real-time feedback for user actions
- **Form Validation**: Robust form handling with Zod and React Hook Form

## Tech Stack

### Core Framework
- **React 19** - UI library with latest features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server

### Routing & State Management
- **TanStack Router** - Type-safe file-based routing
- **TanStack Query (React Query)** - Server state management
- **Zustand** - Client state management with persistence

### Styling & UI
- **Tailwind CSS v4** - Utility-first CSS framework
- **Shadcn/UI** - Accessible component primitives
- **Ant Design** - Enterprise-class UI components
- **Lucide React** - Icon library

### Real-time Communication
- **Socket.IO Client** - Bidirectional event-based communication

### Form Handling
- **React Hook Form** - Performant form validation
- **Zod** - TypeScript-first schema validation

### Development Tools
- **ESLint** - Code linting with TanStack config
- **Prettier** - Code formatting
- **Vitest** - Unit testing framework

## Project Structure

```
message-me-fe/
├── public/                  # Static assets
├── src/
│   ├── @types/              # TypeScript type definitions
│   │   ├── forms/           # Form interfaces
│   │   └── response/        # API response types
│   ├── assets/              # Images and static files
│   ├── components/          # Reusable UI components
│   │   ├── UI/              # Shadcn UI components (button, card, form, etc.)
│   │   ├── ActionBar/       # Left sidebar action bar
│   │   ├── CustomDropdown/  # Custom dropdown component
│   │   ├── ProgressLoader/  # Loading spinner
│   │   └── Users/           # User-related components
│   ├── core/                # Core application logic
│   │   ├── hooks/           # Custom React hooks
│   │   │   ├── api/         # API-related hooks (useAuth, useChat)
│   │   │   └── common/      # Common utility hooks (useToast, useActiveChat)
│   │   └── services/        # API service classes
│   ├── features/            # Feature-based modules
│   │   ├── chat/            # Chat functionality
│   │   │   └── components/  # Chat UI components (ChatRoomPage, ChatInputBar, etc.)
│   │   ├── sidebar/         # Sidebar functionality
│   │   │   └── components/  # Sidebar components (SideBar, AvailableUsers, etc.)
│   │   └── user/            # User-related features
│   │       └── components/  # User profile components
│   ├── Layout/              # Layout components (AppLayout.tsx)
│   ├── lib/                 # Utility libraries (utils.ts)
│   ├── routes/              # TanStack Router routes
│   │   ├── auth/            # Authentication routes (login, register, forgotPassword)
│   │   ├── chats/           # Chat routes (index, $chatId)
│   │   ├── __root.tsx       # Root route with auth guards
│   │   └── index.tsx        # Home redirect
│   ├── socket/              # Socket.IO configuration (socket.ts)
│   ├── store/               # Zustand stores (auth.store.ts, modal.store.ts)
│   ├── utils/               # Helper utilities (http.utils.ts, helper.utils.ts)
│   ├── main.tsx             # Application entry point
│   ├── routeTree.gen.ts     # Auto-generated route tree
│   ├── styles.css           # Global styles with Tailwind
│   └── reportWebVitals.ts   # Performance monitoring
├── .env                     # Environment variables (not in git)
├── index.html               # HTML entry point
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite configuration
├── eslint.config.js         # ESLint configuration
└── prettier.config.js       # Prettier configuration
```

## Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager
- **Backend API** running (see [Backend Setup](#backend-setup))

### Installation

1. Clone the repository:

```bash
git clone https://github.com/sharma151/message_me_fe.git
cd message_me_fe
```

2. Install dependencies:

```bash
npm install
```

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_REACT_APP_API_URL=http://localhost:8888
```

> **Note:** The application also expects a Socket.IO server running on `http://localhost:3002`. Update the socket URL in `src/socket/socket.ts` if your backend uses a different port.

### Running the App

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (port 3000) |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run test` | Run Vitest tests |
| `npm run lint` | Run ESLint |
| `npm run format` | Run Prettier |
| `npm run check` | Format and lint fix |

## Architecture

### Routing

The application uses **TanStack Router** with file-based routing:

- Routes are defined in `src/routes/` directory
- File-based routing automatically generates `routeTree.gen.ts`
- Nested routes follow the folder structure

**Route Structure:**
- `/` → Redirects to `/chats` or `/auth/login`
- `/auth/login` → Login page
- `/auth/register` → Registration page
- `/auth/forgotPassword` → Password reset
- `/chats` → Chat home (empty state)
- `/chats/$chatId` → Specific chat room

**Route Guards:**
- Unauthenticated users are redirected to `/auth/login`
- Authenticated users accessing auth pages are redirected to `/chats`

### State Management

**Zustand Stores:**

1. **Auth Store** (`src/store/auth.store.ts`):
   - Manages authentication state
   - Persists user data and tokens
   - Provides `login()` and `logout()` actions

2. **Modal Store** (`src/store/modal.store.ts`):
   - Controls modal visibility states

**TanStack Query:**
- Manages server-side state
- Caches API responses
- Handles loading and error states

### API Integration

**HTTP Client** (`src/core/services/httpBase.ts`):
- Axios instance with interceptors
- Automatically attaches Bearer tokens
- Handles 401 responses with global logout

**Service Classes:**
- `AuthService` - Authentication operations
- `ChatService` - Chat-related operations

**Custom Hooks:**
- `useAuth()` - Authentication mutations
- `useChat(chatId)` - Chat queries and mutations

### Real-time Communication

**Socket Service** (`src/socket/socket.ts`):
- Singleton pattern for Socket.IO client
- Room-based messaging with join/leave functionality
- Automatic reconnection handling

**Usage:**
```typescript
import { socketService } from '@/socket/socket'

// Connect to socket
socketService.connect(chatId)

// Listen for events
socketService.on('newMessage', (message) => {
  // Handle new message
})

// Emit events
socketService.emit('sendMessage', { content, chatId })
```

## Key Components

### AppLayout (`src/Layout/AppLayout.tsx`)
Main application layout with:
- Resizable panels (react-resizable-panels)
- ActionBar (left sidebar)
- Sidebar (chat list)
- Main content area

### Chat Components

**ChatRoomPage** - Main chat interface with:
- Message history display
- Message input with emoji picker
- Edit/delete message actions

**ChatInputBar** - Message composition with:
- Text input
- Emoji picker integration
- Send message handling

### Sidebar Components

**SideBar** - Left panel containing:
- Navigation tabs
- User search
- Chat list

**AvailableUsers** - User discovery with:
- Search functionality
- User list with online status
- Chat initiation

### Authentication Components

**LoginPage** - User login with:
- Email/username and password fields
- Form validation with Zod
- Error handling and loading states

**RegisterPage** - User registration with:
- Username, email, password fields
- Avatar upload
- Validation

## Authentication

The app uses JWT-based authentication:

1. User logs in with credentials
2. Backend returns access token and user data
3. Token is stored in Zustand with persistence
4. HTTP client automatically attaches Bearer token
5. On 401 response, user is logged out globally

**Protected Routes:**
```typescript
// Root route guard
beforeLoad: ({ location }) => {
  const isAuthenticated = useAuthStore.getState().isAuthenticated

  if (!isAuthenticated && !location.pathname.startsWith('/auth')) {
    throw redirect({ to: '/auth/login' })
  }
}
```

## Backend Setup

This frontend requires a backend API. The application expects:

1. **REST API** running at `VITE_REACT_APP_API_URL`
   - Authentication endpoints (`/auth/login`, `/auth/signup`, etc.)
   - Chat endpoints (`/chats`, `/messages`, etc.)
   - User endpoints (`/users`, etc.)

2. **Socket.IO Server** running on port 3002
   - Events: `joinChat`, `leaveChat`, `sendMessage`, `newMessage`

> The backend repository can be found at: `https://github.com/sharma151/message_me_be` (if available)

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

Please ensure your code:
- Passes ESLint checks (`npm run lint`)
- Is properly formatted (`npm run format`)
- Follows the existing code style

---

Built with ❤️ using React, TypeScript, and TanStack
