# Blog Platform Client

A React + TypeScript frontend for the blog platform built with Vite.

## Features

- React 18 with TypeScript
- Vite for fast development and building
- React Router for client-side routing
- Modern CSS with responsive design
- ESLint configuration for code quality

## Installation

```bash
npm install
```

## Development

To start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Building for Production

To build the application for production:

```bash
npm run build
```

To preview the production build:

```bash
npm run preview
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
client/
├── src/
│   ├── components/
│   │   ├── Layout.tsx
│   │   └── Layout.css
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Home.css
│   │   ├── About.tsx
│   │   ├── About.css
│   │   ├── Blog.tsx
│   │   ├── Blog.css
│   │   ├── NotFound.tsx
│   │   └── NotFound.css
│   ├── App.tsx
│   ├── App.css
│   ├── main.tsx
│   └── index.css
├── public/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## API Proxy

The development server is configured to proxy API requests to the backend server running on port 4000. API calls to `/api/*` will be forwarded to `http://localhost:4000/*`.

## Routing

The application uses React Router with the following routes:

- `/` - Home page
- `/about` - About page
- `/blog` - Blog posts page
- `/*` - 404 Not Found page
