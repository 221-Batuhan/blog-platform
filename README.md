# Blog Platform

A full-stack blog platform built with React + TypeScript frontend and Node.js + Express backend.

## 🚀 Features

### Frontend (React + TypeScript)
- Modern React 18 with TypeScript
- Vite for fast development and building
- React Router for client-side routing
- Responsive design with modern CSS
- ESLint configuration for code quality

### Backend (Node.js + Express)
- Express.js server with TypeScript
- CORS enabled for cross-origin requests
- Body parser middleware for JSON and URL-encoded data
- Health check endpoint
- Development and production build scripts

## 📁 Project Structure

```
blog-platform/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── App.tsx        # Main app component
│   │   └── main.tsx       # Entry point
│   ├── public/            # Static assets
│   ├── package.json       # Frontend dependencies
│   └── vite.config.ts     # Vite configuration
├── server/                # Node.js backend
│   ├── src/
│   │   └── index.ts       # Server entry point
│   ├── package.json       # Backend dependencies
│   └── tsconfig.json      # TypeScript config
├── package.json           # Root package.json
└── README.md             # This file
```

## 🛠️ Installation

### Prerequisites
- Node.js (v16 or higher)
- npm

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd blog-platform
   ```

2. **Install all dependencies**
   ```bash
   npm run install:all
   ```

   Or install individually:
   ```bash
   # Install root dependencies
   npm install
   
   # Install frontend dependencies
   cd client && npm install
   
   # Install backend dependencies
   cd ../server && npm install
   ```

## 🚀 Development

### Start Both Servers (Recommended)
```bash
npm run dev
```

This will start both the backend server (port 4000) and frontend development server (port 3000) concurrently.

### Start Servers Individually

**Backend Server:**
```bash
npm run dev:server
# or
cd server && npm run dev
```

**Frontend Server:**
```bash
npm run dev:client
# or
cd client && npm run dev
```

## 🌐 Access Points

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000
- **Backend Health Check**: http://localhost:4000/health

## 📝 Available Scripts

### Root Level
- `npm run dev` - Start both frontend and backend in development mode
- `npm run dev:client` - Start only the frontend development server
- `npm run dev:server` - Start only the backend development server
- `npm run build` - Build both frontend and backend for production
- `npm run install:all` - Install dependencies for all packages

### Frontend (client/)
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Backend (server/)
- `npm run dev` - Start development server with ts-node
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Start production server
- `npm run watch` - Watch for changes and recompile

## 🛣️ API Routes

### Backend Endpoints
- `GET /` - Welcome message and server status
- `GET /health` - Health check endpoint

### Frontend Routes
- `/` - Home page
- `/about` - About page
- `/blog` - Blog posts page
- `/*` - 404 Not Found page

## 🔧 Configuration

### Frontend Proxy
The frontend development server is configured to proxy API requests to the backend:
- API calls to `/api/*` are forwarded to `http://localhost:4000/*`

### Environment Variables
- `PORT` - Backend server port (default: 4000)
- Frontend runs on port 3000 by default

## 🏗️ Building for Production

### Build Both Applications
```bash
npm run build
```

### Build Individually
```bash
# Build frontend
npm run build:client

# Build backend
npm run build:server
```

## 🧪 Testing

The project includes:
- ESLint configuration for code quality
- TypeScript strict mode for type safety
- Proper error handling and logging

## 📦 Technologies Used

### Frontend
- React 18
- TypeScript
- Vite
- React Router DOM
- Modern CSS

### Backend
- Node.js
- Express.js
- TypeScript
- CORS
- Body Parser

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run linting: `npm run lint`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
