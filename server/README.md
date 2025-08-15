# Blog Platform Server

A Node.js Express backend with TypeScript and Prisma ORM for the blog platform.

## Features

- Express.js server with TypeScript
- Prisma ORM with SQLite database
- CORS enabled for cross-origin requests
- Body parser middleware for JSON and URL-encoded data
- RESTful API for blog posts and users
- Health check endpoint
- Development and production build scripts

## Installation

```bash
npm install
```

## Database Setup

1. **Initialize Prisma** (already done):
   ```bash
   npx prisma init
   ```

2. **Run migrations**:
   ```bash
   npx prisma migrate dev --name init
   ```

3. **Generate Prisma client**:
   ```bash
   npx prisma generate
   ```

4. **Seed the database** (optional):
   ```bash
   npm run seed
   ```

## Development

To run the server in development mode with hot reload:

```bash
npm run dev
```

## Production

To build and run the server in production:

```bash
npm run build
npm start
```

## Available Scripts

- `npm run dev` - Start development server with ts-node
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Start production server
- `npm run watch` - Watch for changes and recompile
- `npm run seed` - Seed the database with sample data

## API Endpoints

### Health & Status
- `GET /` - Welcome message and server status
- `GET /health` - Health check endpoint

### Blog Posts
- `GET /api/posts` - Get all published posts
- `GET /api/posts/:id` - Get a specific post by ID
- `POST /api/posts` - Create a new post
- `PUT /api/posts/:id` - Update a post
- `DELETE /api/posts/:id` - Delete a post

### Users
- `GET /api/users` - Get all users
- `POST /api/users` - Create a new user

## Database Schema

### User Model
```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  posts     Post[]
}
```

### Post Model
```prisma
model Post {
  id          String   @id @default(cuid())
  title       String
  content     String
  excerpt     String?
  published   Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  authorId    String
  author      User     @relation(fields: [authorId], references: [id], onDelete: Cascade)
}
```

## Environment Variables

- `PORT` - Server port (default: 4000)
- `DATABASE_URL` - Database connection string (default: SQLite file)

## Prisma Commands

- `npx prisma studio` - Open Prisma Studio (database GUI)
- `npx prisma migrate dev` - Create and apply migrations
- `npx prisma generate` - Generate Prisma client
- `npx prisma db push` - Push schema changes to database
- `npx prisma db seed` - Run seed script

## Project Structure

```
server/
├── src/
│   ├── lib/
│   │   └── prisma.ts      # Prisma client instance
│   └── index.ts           # Server entry point
├── prisma/
│   ├── schema.prisma      # Database schema
│   ├── seed.ts           # Database seed script
│   └── migrations/       # Database migrations
├── package.json          # Dependencies and scripts
└── tsconfig.json         # TypeScript configuration
```
