# Planora - Smart Trip Planner with Node.js + TypeScript + Express Backend

This project now includes a **Node.js + TypeScript + Express** backend server that sits between the React frontend and Supabase database.

## Architecture

```
React Frontend (Vite + TypeScript)
         ↓
Express Backend (Node.js + TypeScript)
         ↓
Supabase (PostgreSQL + Auth)
```

## Setup Instructions

### 1. Frontend Setup

```bash
# Install frontend dependencies
npm install

# Create frontend .env file
cp .env.example .env

# Edit .env and add your configuration:
# VITE_API_URL=http://localhost:3000
# VITE_SUPABASE_URL=your_supabase_url
# VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. Backend Setup

```bash
# Navigate to server directory
cd server

# Install backend dependencies
npm install

# Create backend .env file
cp .env.example .env

# Edit server/.env and add your configuration:
# PORT=3000
# NODE_ENV=development
# SUPABASE_URL=your_supabase_url
# SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
# FRONTEND_URL=http://localhost:8080
```

### 3. Running the Application

**Terminal 1 - Backend Server:**
```bash
cd server
npm run dev
```
The Express server will start on http://localhost:3000

**Terminal 2 - Frontend:**
```bash
npm run dev
```
The React app will start on http://localhost:8080

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/signin` - Sign in user
- `POST /api/auth/signout` - Sign out user
- `GET /api/auth/user` - Get current user
- `GET /api/auth/session` - Get current session

### Itineraries
- `GET /api/itineraries` - Get user's itineraries (authenticated)
- `GET /api/itineraries/public` - Get public itineraries
- `GET /api/itineraries/:id` - Get single itinerary
- `POST /api/itineraries` - Create itinerary (authenticated)
- `PUT /api/itineraries/:id` - Update itinerary (authenticated)
- `DELETE /api/itineraries/:id` - Delete itinerary (authenticated)

### Activities
- `GET /api/activities/itinerary/:itineraryId` - Get activities for itinerary
- `POST /api/activities` - Create activity (authenticated)
- `POST /api/activities/bulk` - Create multiple activities (authenticated)
- `PUT /api/activities/:id` - Update activity (authenticated)
- `DELETE /api/activities/:id` - Delete activity (authenticated)
- `DELETE /api/activities/itinerary/:itineraryId` - Delete all activities for itinerary

### Profiles
- `GET /api/profiles/me` - Get current user's profile (authenticated)
- `GET /api/profiles/:id` - Get profile by ID
- `PUT /api/profiles/me` - Update profile (authenticated)

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** - Build tool
- **Tailwind CSS** + shadcn/ui - Styling
- **React Router** - Navigation
- **React Query** - Data fetching
- **Framer Motion** - Animations

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **TypeScript** - Type safety
- **Supabase Client** - Database & Auth
- **CORS** - Cross-origin support
- **Helmet** - Security headers
- **Morgan** - Request logging

### Database
- **Supabase** (PostgreSQL)
- Row Level Security (RLS)
- Real-time capabilities
- Built-in authentication

## Development

### Backend Development
```bash
cd server
npm run dev        # Start with hot reload
npm run build      # Build for production
npm run start      # Run production build
```

### Frontend Development
```bash
npm run dev        # Start dev server
npm run build      # Build for production
npm run preview    # Preview production build
```

## Project Structure

```
├── src/                      # Frontend React code
│   ├── pages/               # Route components
│   ├── components/          # UI components
│   ├── contexts/            # React contexts
│   ├── hooks/               # Custom hooks
│   ├── lib/                 # Utilities (including API client)
│   └── integrations/        # Supabase client
├── server/                   # Backend Express server
│   ├── src/
│   │   ├── server.ts        # Main Express app
│   │   ├── config/          # Configuration (Supabase)
│   │   ├── middleware/      # Auth, error handling
│   │   └── routes/          # API route handlers
│   ├── package.json
│   └── tsconfig.json
└── package.json             # Frontend dependencies
```

## Notes

- The UI, design, and user experience remain exactly the same
- All frontend functionality is preserved
- The Express backend acts as an API layer between frontend and Supabase
- Authentication still uses Supabase Auth, but through the Express API
- All database operations go through Express endpoints
