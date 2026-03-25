
A full-stack notes and task management application with user authentication, dashboard analytics, and real-time notifications.

## 🚀 Features

- **User Authentication**: Secure registration and login with JWT authentication
- **Notes Management**: Create, read, update, and delete notes with organization
- **Task Management**: Track and manage your daily tasks
- **Dashboard Analytics**: Visual insights into your productivity
- **Notifications**: Real-time notifications for important events
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Tailwind CSS**: Modern, utility-first styling
- **Type-Safe**: Full TypeScript support on both frontend and backend
- **Comprehensive Testing**: Unit tests, component tests, and E2E tests

## 📋 Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn** package manager
- **MongoDB** (local or Atlas connection string)
- **.env files** for configuration

## 🛠️ Installation

### 1. Clone or Extract the Project

```bash
cd CFSE-Nevindi
```

### 2. Backend Setup

#### Install Dependencies

```bash
cd backend
npm install
```

#### Configure Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/cfse-nevindi
# or use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cfse-nevindi

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d

# Server
PORT=5000
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

#### Start the Backend Server

```bash
npm start
```

The backend will run on `http://localhost:5000`

### 3. Frontend Setup

#### Install Dependencies

```bash
cd frontend
npm install
```

#### Configure Environment Variables

Create a `.env.local` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

#### Start the Development Server

```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## 📝 Available Scripts

### Backend

```bash
npm start          # Start the server in production mode
npm run dev        # Start the server with nodemon (auto-reload)
npm test           # Run backend tests
```

### Frontend

```bash
npm run dev        # Start development server with hot reload
npm run build      # Build for production
npm run preview    # Preview production build locally
npm run test       # Run unit and component tests
npm run test:e2e   # Run end-to-end tests with Playwright
npm run lint       # Run ESLint
```

## 🏗️ Project Structure

```
CFSE-Nevindi/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/      # Route controllers (authController, noteController)
│   ├── middleware/       # Express middleware (errorHandler, protect)
│   ├── models/          # MongoDB schemas (User, Note)
│   ├── routes/          # API routes (authRoutes, noteRoutes)
│   ├── tests/           # Backend tests
│   ├── server.js        # Entry point
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/       # React components
    │   │   ├── ui/          # Reusable UI components (Button, Input, Card, etc.)
    │   │   ├── layout/      # Layout components (Header, Sidebar, DashboardLayout)
    │   │   ├── auth/        # Authentication components
    │   │   ├── shared/      # Shared components (LoadingSpinner, ErrorBoundary)
    │   │   └── notes/       # Note-specific components
    │   ├── context/         # React Context (AuthContext)
    │   ├── pages/           # Page components
    │   │   ├── LoginPage
    │   │   ├── RegisterPage
    │   │   ├── DashboardPage
    │   │   ├── NotesPage
    │   │   ├── TasksPage
    │   │   ├── AnalyticsPage
    │   │   ├── ProfilePage
    │   │   └── NotificationsPage
    │   ├── services/        # API services
    │   │   ├── api.ts       # Axios instance
    │   │   ├── authService.ts
    │   │   └── noteService.ts
    │   ├── lib/             # Utility libraries
    │   ├── utils/           # Helper functions
    │   ├── tests/           # Test files
    │   │   ├── e2e/         # End-to-end tests
    │   │   ├── auth.test.ts
    │   │   ├── components.test.tsx
    │   │   ├── notes.test.ts
    │   │   └── setup.ts
    │   ├── App.tsx          # Root component
    │   └── main.tsx         # Entry point
    ├── public/              # Static assets
    ├── vite.config.ts       # Vite configuration
    ├── tsconfig.json        # TypeScript configuration
    ├── tailwind.config.js   # Tailwind CSS configuration
    ├── playwright.config.ts # Playwright E2E test configuration
    └── package.json
```

## 🔐 Authentication Flow

1. User registers with email and password
2. Backend validates and hashes password, creates JWT token
3. Frontend stores JWT in localStorage
4. All protected API requests include JWT in Authorization header
5. Backend middleware (`protect.js`) verifies token before processing requests
6. Token is automatically added to requests via axios interceptor

## 📲 API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - Login user
- `GET /me` - Get current user (requires authentication)

### Notes (`/api/notes`)
- `GET /` - Get all user notes
- `POST /` - Create new note
- `GET /:id` - Get specific note
- `PUT /:id` - Update note
- `DELETE /:id` - Delete note

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm run test         # Run unit/component tests
npm run test:e2e     # Run end-to-end tests
```

## 🎨 Styling & Components

The project uses **Tailwind CSS** for styling and provides reusable UI components:

- **Button** - Customizable button component
- **Input** - Form input with Tailwind styling
- **Card** - Container component for content grouping
- **Label** - Form label component
- **Select** - Dropdown select component
- **Textarea** - Multi-line text input
- **Modal** - Dialog component for modals

All components are in `frontend/src/components/ui/`

## 🚨 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running locally or check your Atlas connection string
- Verify the `MONGODB_URI` in your `.env` file

### Port Already in Use
- Backend (5000): Change `PORT` in `.env`
- Frontend (5173): Vite will automatically use the next available port

### CORS Errors
- Ensure `FRONTEND_URL` in backend `.env` matches your frontend URL
- Check that backend is running before starting frontend

### Tests Failing
- Clear node_modules and reinstall: `npm install`
- Ensure test environment is properly set up in `vite.config.ts` and `setup.ts`

## 📚 Additional Resources

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [TypeScript Documentation](https://www.typescriptlang.org/)

## 📝 License

This project is part of the CFSE curriculum.

## 👤 Developer

Built as a full-stack learning project.

---

**Happy coding! 🎉**
