# Blogged - Full-Stack Blog Platform

A modern, feature-rich blog platform built with React, TypeScript, Node.js, and PostgreSQL. This project demonstrates full-stack development skills with a focus on user experience, performance, and scalability.

![Blogged Platform](https://img.shields.io/badge/React-18.2.0-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)
![Node.js](https://img.shields.io/badge/Node.js-18.0-green?logo=node.js)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue?logo=postgresql)
![Prisma](https://img.shields.io/badge/Prisma-5.0-black?logo=prisma)

## 🚀 Live Demo

**Frontend:** http://localhost:3000  
**Backend API:** http://localhost:4000  
**API Documentation:** http://localhost:4000/health

## ✨ Features

### 🔐 Authentication & User Management
- **JWT-based authentication** with secure token management
- **User registration and login** with password hashing
- **Profile management** with avatar uploads and bio editing
- **Password change functionality** with validation
- **Public user profiles** accessible via username

### 📝 Blog Post Management
- **Rich text editor** for creating and editing posts
- **Image upload support** with local file storage
- **Tagging system** with custom colors and categories
- **Draft and publish workflow** for content management
- **SEO-friendly URLs** and meta descriptions
- **View count tracking** and analytics

### 💬 Social Features
- **Comment system** with threaded discussions
- **Like/unlike posts** with real-time updates
- **User mentions** and notifications
- **Comment moderation** (delete own comments)
- **Social sharing** capabilities

### 🔍 Search & Discovery
- **Advanced search** across posts and content
- **Tag-based filtering** with visual tag cloud
- **Author filtering** to find specific writers
- **Sorting options** (newest, most popular, most viewed)
- **Pagination** for large content libraries

### 📊 Analytics Dashboard
- **Personal analytics** showing post performance
- **View count tracking** and engagement metrics
- **Comment statistics** and user interaction data
- **Popular posts** and trending content
- **User activity insights**

### 🎨 Modern UI/UX
- **Responsive design** that works on all devices
- **Dark/light theme** support (planned)
- **Professional typography** and spacing
- **Smooth animations** and transitions
- **Accessibility features** (WCAG compliant)
- **Mobile-first approach**

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript for type safety
- **Vite** for fast development and building
- **React Router DOM** for client-side routing
- **Context API** for state management
- **Modern CSS** with Flexbox and Grid
- **Responsive design** with mobile-first approach

### Backend
- **Node.js** with Express.js framework
- **TypeScript** for type-safe server code
- **Prisma ORM** for database management
- **PostgreSQL** for robust data storage
- **JWT** for secure authentication
- **bcrypt** for password hashing
- **CORS** enabled for cross-origin requests

### Database
- **PostgreSQL** for production-ready data storage
- **Prisma Schema** with relationships and constraints
- **Database migrations** for version control
- **Seed data** for development and testing

### Development Tools
- **ESLint** and **Prettier** for code quality
- **TypeScript** for type safety across the stack
- **Hot reload** for development efficiency
- **Concurrent development** servers

## 📁 Project Structure

```
blog-platform/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── contexts/      # React contexts
│   │   └── styles/        # CSS files
│   ├── public/            # Static assets
│   └── package.json       # Frontend dependencies
├── server/                # Node.js backend
│   ├── src/
│   │   ├── routes/        # API route handlers
│   │   ├── middleware/    # Custom middleware
│   │   ├── lib/          # Utility functions
│   │   └── index.ts      # Server entry point
│   ├── prisma/           # Database schema and migrations
│   └── package.json      # Backend dependencies
└── README.md             # Project documentation
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- PostgreSQL (or SQLite for development)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd blog-platform
   ```

2. **Install dependencies**
   ```bash
   # Install all dependencies (frontend + backend)
   npm run install:all
   ```

3. **Set up the database**
   ```bash
   cd server
   # Copy environment variables
   cp .env.example .env
   
   # Update DATABASE_URL in .env
   DATABASE_URL="file:./dev.db"  # For SQLite development
   
   # Initialize database
   npx prisma generate
   npx prisma db push
   npx prisma db seed
   ```

4. **Start the development servers**
   ```bash
   # Start both frontend and backend
   npm run dev
   
   # Or start individually:
   npm run dev:client  # Frontend on http://localhost:3000
   npm run dev:server  # Backend on http://localhost:4000
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:4000
   - Health Check: http://localhost:4000/health

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/password` - Change password

### Posts Endpoints
- `GET /api/posts` - Get all posts with filtering
- `GET /api/posts/:id` - Get specific post
- `POST /api/posts` - Create new post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post
- `POST /api/posts/:id/like` - Like/unlike post

### Comments Endpoints
- `GET /api/comments` - Get comments for a post
- `POST /api/comments` - Create new comment
- `PUT /api/comments/:id` - Update comment
- `DELETE /api/comments/:id` - Delete comment

## 🎯 Key Features Implemented

### User Experience
- **Intuitive navigation** with breadcrumbs and clear hierarchy
- **Real-time feedback** for user actions
- **Loading states** and error handling
- **Form validation** with helpful error messages
- **Responsive design** that works on all devices

### Performance
- **Optimized database queries** with Prisma
- **Efficient state management** with React Context
- **Lazy loading** for better initial load times
- **Image optimization** and compression
- **Caching strategies** for frequently accessed data

### Security
- **JWT authentication** with secure token storage
- **Password hashing** with bcrypt
- **Input validation** and sanitization
- **CORS configuration** for API security
- **Environment variable** management

### Code Quality
- **TypeScript** for type safety across the stack
- **ESLint** and **Prettier** for consistent code style
- **Modular architecture** with clear separation of concerns
- **Comprehensive error handling** and logging
- **Well-documented code** with JSDoc comments

## 🔧 Development

### Available Scripts

```bash
# Install all dependencies
npm run install:all

# Start development servers
npm run dev

# Start frontend only
npm run dev:client

# Start backend only
npm run dev:server

# Build for production
npm run build

# Run tests
npm run test

# Database operations
npm run db:generate    # Generate Prisma client
npm run db:push        # Push schema to database
npm run db:seed        # Seed database with sample data
```

### Environment Variables

Create a `.env` file in the server directory:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-key"
PORT=4000
NODE_ENV="development"
```

## 🚀 Deployment

### Frontend Deployment
- **Vercel** or **Netlify** for static hosting
- **Build optimization** with Vite
- **Environment variables** configuration
- **Custom domain** setup

### Backend Deployment
- **Railway** or **Heroku** for Node.js hosting
- **PostgreSQL** database setup
- **Environment variables** configuration
- **SSL certificate** setup

### Database Migration
```bash
# Generate migration
npx prisma migrate dev --name init

# Deploy to production
npx prisma migrate deploy
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team** for the amazing frontend framework
- **Vercel** for the excellent development tools
- **Prisma** for the modern database toolkit
- **Unsplash** for beautiful stock photography
- **Open source community** for inspiration and support

---

**Built with ❤️ and modern web technologies**

*This project demonstrates full-stack development skills including frontend design, backend API development, database design, authentication systems, and deployment strategies.*
