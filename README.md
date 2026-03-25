# 🚀 TaskFlow — Smart Task Manager

An AI-powered full-stack task management application built with **Node.js**, **Next.js**, **MongoDB**, and **Claude AI (Anthropic)**.

---

## ✨ Features

- **User Authentication** — Register & Login with JWT tokens
- **Full CRUD** — Create, Read, Update, Delete tasks
- **AI-Powered Generation** — Auto-generate task descriptions and subtasks using Claude AI
- **AI Productivity Summary** — Get an AI overview of your workload
- **Subtask Tracking** — Toggle subtask completion with live progress bar
- **Filters & Search** — Filter by status, priority, and keyword
- **Tags** — Organize tasks with custom tags
- **Due Dates** — Track deadlines per task

---

## 🧱 Tech Stack

| Layer      | Technology              |
|------------|-------------------------|
| Frontend   | Next.js 14, Tailwind CSS |
| Backend    | Node.js, Express.js     |
| Database   | MongoDB + Mongoose      |
| Auth       | JWT (jsonwebtoken)      |
| AI         | Claude API (Anthropic)  |

---

## 📁 Project Structure

```
smart-task-manager/
├── backend/
│   ├── config/
│   ├── controllers/      # authController, taskController, aiController
│   ├── middleware/        # JWT auth middleware
│   ├── models/            # User.js, Task.js (Mongoose)
│   ├── routes/            # auth.js, tasks.js, ai.js
│   ├── server.js
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── app/
│   │   ├── dashboard/     # Main task dashboard
│   │   ├── login/         # Login page
│   │   ├── register/      # Register page
│   │   └── tasks/
│   │       ├── new/       # Create task
│   │       └── [id]/      # View + Edit task
│   ├── components/        # Navbar, TaskCard, TaskForm
│   ├── lib/               # api.js, auth.js
│   └── package.json
└── README.md
```

---

## ⚙️ Setup & Installation

### Prerequisites

- Node.js v18+
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- Anthropic API Key — get one at [console.anthropic.com](https://console.anthropic.com)

---

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/smart-task-manager.git
cd smart-task-manager
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Create your `.env` file:

```bash
cp .env.example .env
```

Edit `.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/smart-task-manager
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d
ANTHROPIC_API_KEY=sk-ant-your-key-here
CLIENT_URL=http://localhost:3000
```

Start the backend server:

```bash
npm run dev
```

Server runs at: `http://localhost:5000`

---

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create your `.env.local` file:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

App runs at: `http://localhost:3000`

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint             | Description       | Auth Required |
|--------|----------------------|-------------------|---------------|
| POST   | /api/auth/register   | Register user     | ❌            |
| POST   | /api/auth/login      | Login user        | ❌            |
| GET    | /api/auth/me         | Get current user  | ✅            |

### Tasks
| Method | Endpoint                             | Description          | Auth Required |
|--------|--------------------------------------|----------------------|---------------|
| GET    | /api/tasks                           | Get all tasks        | ✅            |
| GET    | /api/tasks/:id                       | Get single task      | ✅            |
| POST   | /api/tasks                           | Create task          | ✅            |
| PUT    | /api/tasks/:id                       | Update task          | ✅            |
| DELETE | /api/tasks/:id                       | Delete task          | ✅            |
| PATCH  | /api/tasks/:id/subtasks/:subtaskId   | Toggle subtask       | ✅            |

### AI
| Method | Endpoint            | Description                       | Auth Required |
|--------|---------------------|-----------------------------------|---------------|
| POST   | /api/ai/generate    | Generate task description + subtasks | ✅        |
| POST   | /api/ai/summarize   | Summarize all tasks (productivity) | ✅          |

---

## 🤖 AI Features

### 1. Task AI Generation
- Enter a task title → click **"AI Generate"**
- Claude AI returns a description and 3–5 subtasks automatically

### 2. Productivity Summary
- On the dashboard, click **"Analyze my tasks"**
- Claude AI reads all your tasks and provides a personalized coaching summary

---

## 🧪 Testing the App

1. Register a new account at `http://localhost:3000/register`
2. Create a task at `http://localhost:3000/tasks/new`
3. Enter a title like "Build a REST API" and click "AI Generate"
4. Watch Claude fill in the description and subtasks
5. Save and view on the dashboard
6. Click "Analyze my tasks" for an AI productivity summary

---

## 📦 Deployment

For production:
- Set `NODE_ENV=production` in backend `.env`
- Use [MongoDB Atlas](https://www.mongodb.com/atlas) for cloud database
- Deploy backend to [Railway](https://railway.app) or [Render](https://render.com)
- Deploy frontend to [Vercel](https://vercel.com)
- Update `NEXT_PUBLIC_API_URL` in frontend to your deployed backend URL
