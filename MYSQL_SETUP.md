# MySQL Database Setup Guide for Planora

## Prerequisites

1. **Install MySQL**
   - Download MySQL Community Server from: https://dev.mysql.com/downloads/mysql/
   - Or install via package manager:
     - Windows: Use MySQL Installer
     - Mac: `brew install mysql`
     - Linux: `sudo apt-get install mysql-server`

2. **Start MySQL Service**
   - Windows: MySQL should start automatically
   - Mac: `brew services start mysql`
   - Linux: `sudo systemctl start mysql`

## Database Setup Steps

### Step 1: Access MySQL

Open terminal/PowerShell and login to MySQL:

```bash
mysql -u root -p
```

Enter your MySQL root password when prompted.

### Step 2: Create Database and Tables

Run the schema file:

```sql
source /path/to/server/schema.sql
```

Or manually copy and paste the contents of `schema.sql` into MySQL prompt.

Alternatively, from PowerShell:

```powershell
cd D:\Planora\smart-trip-planner-main\server
mysql -u root -p < schema.sql
```

### Step 3: Verify Database Creation

```sql
USE planora_db;
SHOW TABLES;
```

You should see:
- `users`
- `itineraries`

### Step 4: Check Table Structure

```sql
DESCRIBE users;
DESCRIBE itineraries;
```

## Configure Backend

### Step 1: Update .env file

Create `server/.env` file (copy from `.env.example`):

```env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=planora_db

JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

FRONTEND_URL=http://localhost:8080
```

**Important:** Replace `your_mysql_password` with your actual MySQL root password!

### Step 2: Install Dependencies

```powershell
cd D:\Planora\smart-trip-planner-main\server
npm install
```

This will install:
- `mysql2` - MySQL driver
- `bcrypt` - Password hashing
- `jsonwebtoken` - JWT authentication
- Other dependencies

### Step 3: Start the Server

```powershell
npm run dev
```

You should see:
```
✅ MySQL database connected successfully
🚀 Server running on http://localhost:3000
📝 Environment: development
📊 Database: MySQL
```

## Database Structure (As Per Mentor Requirements)

### Users Table
```sql
- id (VARCHAR 36, PRIMARY KEY)
- name (VARCHAR 255, NOT NULL)
- email (VARCHAR 255, UNIQUE, NOT NULL)
- password (VARCHAR 255, NOT NULL, hashed)
- role (ENUM: 'traveler', 'admin', DEFAULT 'traveler')
- contact_info (VARCHAR 255)
- created_at (TIMESTAMP)
```

### Itineraries Table
```sql
- id (VARCHAR 36, PRIMARY KEY)
- user_id (VARCHAR 36, FOREIGN KEY → users.id)
- destination (VARCHAR 255, NOT NULL)
- start_date (DATE, NOT NULL)
- end_date (DATE, NOT NULL)
- budget (DECIMAL 10,2, NOT NULL)
- activities (JSON) - stores all activities
- notes (TEXT, optional)
- media_paths (TEXT, optional)
- preferences (JSON)
- is_public (BOOLEAN, DEFAULT FALSE)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

## Testing the Setup

### 1. Test Health Endpoint

```powershell
# In browser or via curl:
http://localhost:3000/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2025-12-30T..."
}
```

### 2. Test User Registration

```powershell
curl -X POST http://localhost:3000/api/auth/signup `
  -H "Content-Type: application/json" `
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "fullName": "Test User",
    "role": "traveler"
  }'
```

### 3. Check Database

```sql
USE planora_db;
SELECT * FROM users;
SELECT * FROM itineraries;
```

## Troubleshooting

### Connection Error

If you see "MySQL connection failed":
1. Check MySQL service is running
2. Verify credentials in `.env` file
3. Ensure database `planora_db` exists
4. Check MySQL port (default 3306)

### Permission Issues

```sql
-- Grant all privileges
GRANT ALL PRIVILEGES ON planora_db.* TO 'root'@'localhost';
FLUSH PRIVILEGES;
```

### Reset Database

```sql
DROP DATABASE planora_db;
CREATE DATABASE planora_db;
USE planora_db;
-- Run schema.sql again
```

## Frontend Configuration

The frontend should work exactly as before. Just ensure Supabase client is still configured for auth session management:

```env
VITE_API_URL=http://localhost:3000
VITE_SUPABASE_URL=your_url  (still needed for session storage)
VITE_SUPABASE_ANON_KEY=your_key
```

## Summary

✅ **Max 2 Tables** - Users & Itineraries (as per mentor requirement)  
✅ **Simple Relation** - Users ↔ Itineraries via `user_id`  
✅ **Activities as JSON** - Stored in itineraries table  
✅ **MySQL Database** - Replaces Supabase  
✅ **Express Backend** - Node.js + TypeScript + Express  
✅ **Frontend Unchanged** - Same UI, functionality, and logic  

Everything works exactly the same from the user's perspective! 🎉
