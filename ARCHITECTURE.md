# Architecture Decision Record — TaskFlow

## Overview

TaskFlow is a full-stack task management application. This document explains key architectural decisions made during development.

---

## 1. Backend: Node.js + Express over Spring Boot

**Decision:** Node.js with Express.js

**Reasons:**
- JavaScript across both frontend and backend reduces context switching
- Lighter weight and faster to set up for a CRUD + AI application
- Non-blocking I/O is well-suited for AI API calls (which are I/O bound)
- Mongoose integrates naturally with Node.js for MongoDB

---

## 2. Database: MongoDB

**Decision:** MongoDB with Mongoose ODM

**Reasons:**
- Tasks have a flexible schema (subtasks array, optional tags, optional dueDate)
- Document model maps directly to JSON — no ORM translation needed
- Mongoose provides schema validation, middleware hooks (e.g. password hashing), and type safety
- Easy to scale horizontally if needed

**Schema Design:**
- `User` — stores hashed passwords (bcrypt), timestamps
- `Task` — belongs to a user via ObjectId reference, includes embedded subtask array for simplicity (avoids a separate collection for small subdocuments)

---

## 3. Authentication: JWT (Stateless)

**Decision:** JSON Web Tokens stored in HTTP cookies via `js-cookie`

**Reasons:**
- Stateless — no session store needed, scales easily
- Token contains user ID — backend verifies on every protected request
- 7-day expiry balances security and user experience
- Passwords hashed with bcrypt (salt rounds: 12)

---

## 4. Frontend: Next.js 14 (App Router)

**Decision:** Next.js with App Router + Tailwind CSS

**Reasons:**
- File-based routing makes the codebase easy to navigate
- App Router supports server components for future performance improvements
- Tailwind CSS enables rapid, consistent UI development without writing custom CSS files
- Axios interceptors centralize token attachment and 401 handling globally

---

## 5. AI Integration: Anthropic Claude API

**Decision:** Two AI endpoints — task generation and productivity summary

**Reasons:**
- `claude-sonnet-4-20250514` offers the best balance of speed and quality for structured JSON generation
- AI generation is triggered on-demand (not automatic) to respect API rate limits and costs
- Prompts instruct the model to respond with strict JSON — parsed and validated before returning to the client
- Fallback error handling ensures the app works even if the AI call fails

**AI Features:**
- `/api/ai/generate` — given a task title, returns a description + subtask list
- `/api/ai/summarize` — given all user tasks, returns a coaching-style productivity summary

---

## 6. Error Handling Strategy

- All controllers wrapped in try/catch
- Global Express error handler at the bottom of `server.js`
- Frontend uses `react-hot-toast` for user-friendly error/success messages
- Axios interceptor auto-redirects to `/login` on 401 responses

---

## 7. Code Structure: MVC Pattern

```
controllers/   ← Business logic
routes/        ← Route definitions + validation
models/        ← Mongoose schemas
middleware/    ← JWT verification
```

This separation keeps each file focused and makes the codebase easy to maintain and test.
