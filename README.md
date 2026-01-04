# Planora - Smart Trip Planner 🗺️

A full-stack travel itinerary planning application with budget-optimized activity generation.

**Developed by:** Dhiyanesh

## 🌐 Live Demo

**[Click here!!](https://planora--web.vercel.app)** to see the live website.

## 🏗️ Architecture

This project uses a modern, fully cloud-based architecture with **100% free hosting**:

- **Frontend:** Deployed on [Vercel](https://vercel.com) - React + Vite application with automatic deployments on every GitHub push
- **Backend:** Hosted on [Render.com](https://render.com) - Node.js + Express RESTful API server
- **Database:** MySQL database hosted on [Aiven](https://aiven.io) with SSL encryption

**Data Flow:**
1. User interacts with the React frontend (Vercel)
2. Frontend makes API calls to the Express backend (Render)
3. Backend queries/updates the MySQL database (Aiven)
4. Data flows back to the user

All services communicate securely over HTTPS with environment-based configuration.

## 🚀 Features

- ✨ Create and manage travel itineraries
- 💰 Budget-based activity generation
- 📅 Day-by-day trip planning
- 🔐 Secure JWT authentication
- 🎨 Beautiful UI with shadcn/ui components
- 📱 Responsive design

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Beautiful UI components
- **Framer Motion** - Animations
- **React Router v6** - Navigation
- **React Query** - Data fetching

### Backend
- **Node.js** with Express
- **TypeScript** - Type safety
- **MySQL** - Database
- **JWT** - Authentication
- **bcrypt** - Password hashing

## 📋 Prerequisites

- Node.js (v18 or higher) - [Install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- MySQL (v8.0 or higher)
- npm or yarn

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/Dhiyanesh40/Planora--Web.git
cd Planora--Web
```

### 2. Database Setup

See [MYSQL_SETUP.md](./MYSQL_SETUP.md) for complete MySQL setup instructions.

**Quick setup:**

```bash
# Create database
mysql -u root -p
CREATE DATABASE planora_db;

# Run schema
mysql -u root -p planora_db < server/schema.sql
```

### 3. Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your MySQL credentials
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=your_mysql_password
# DB_NAME=planora_db
# JWT_SECRET=your-secret-key

# Start backend server
npm run dev
```

Backend will run on: `http://localhost:3000`

### 4. Frontend Setup

```bash
# Navigate back to root directory
cd ..

# Install dependencies
npm install

# Create .env file (optional)
cp .env.example .env

# Start frontend development server
npm run dev
```

Frontend will run on: `http://localhost:8080`

## 🏗️ Project Structure

```
├── server/               # Backend (Express + MySQL)
│   ├── src/
│   │   ├── config/      # Database configuration
│   │   ├── middleware/  # Auth & error handling
│   │   ├── routes/      # API routes
│   │   └── server.ts    # Express app
│   ├── schema.sql       # MySQL database schema
│   └── package.json
│
├── src/                 # Frontend (React)
│   ├── components/      # UI components
│   ├── pages/          # Page components
│   ├── contexts/       # React contexts
│   ├── hooks/          # Custom hooks
│   └── utils/          # Utility functions
│
└── public/             # Static assets
```

## 🗄️ Database Schema

The application uses a 2-table structure:

- **users** - User accounts with authentication
- **itineraries** - Trip itineraries with activities stored as JSON

Activities are stored as a JSON array within the itineraries table for optimal performance.

## 🔑 Environment Variables

### Backend (.env in server/)
```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=planora_db
JWT_SECRET=your-secret-jwt-key
FRONTEND_URL=http://localhost:8080
```

### Frontend (.env in root/)
```env
VITE_API_URL=http://localhost:3000
```

## 🚢 Deployment

1. Build frontend:
```bash
npm run build
```

2. Build backend:
```bash
cd server
npm run build
```

3. Deploy to your hosting service (Vercel, Heroku, AWS, etc.)

## 📝 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create account
- `POST /api/auth/signin` - Login
- `POST /api/auth/signout` - Logout
- `GET /api/auth/user` - Get current user

### Itineraries
- `GET /api/itineraries` - Get all itineraries
- `GET /api/itineraries/:id` - Get single itinerary
- `POST /api/itineraries` - Create itinerary
- `PUT /api/itineraries/:id` - Update itinerary
- `DELETE /api/itineraries/:id` - Delete itinerary

### Activities
- `GET /api/activities/itinerary/:id` - Get activities for itinerary
- `POST /api/activities` - Create activity
- `POST /api/activities/bulk` - Bulk create activities
- `PUT /api/activities/:id` - Update activity
- `DELETE /api/activities/:id` - Delete activity

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is built from scratch using modern web technologies.

## 👨‍💻 Developer

**Dhiyanesh**
- GitHub: [@Dhiyanesh40](https://github.com/Dhiyanesh40)
- Email: nivashinidhiyanesh@gmail.com

---

© 2026 Planora. Crafted with ❤️ for travelers.
