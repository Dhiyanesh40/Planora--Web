-- Planora Database Schema
-- MySQL Database for Smart Trip Planner

-- Create database if not exists
CREATE DATABASE IF NOT EXISTS planora_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE planora_db;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('traveler', 'admin') DEFAULT 'traveler',
  contact_info VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Itineraries Table
CREATE TABLE IF NOT EXISTS itineraries (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  user_id VARCHAR(36) NOT NULL,
  destination VARCHAR(255) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  budget DECIMAL(10,2) NOT NULL CHECK (budget > 0),
  activities JSON,
  notes TEXT,
  media_paths TEXT,
  preferences JSON,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_destination (destination),
  INDEX idx_is_public (is_public),
  INDEX idx_dates (start_date, end_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default admin user (password: admin123)
-- Password is hashed with bcrypt
INSERT INTO users (id, name, email, password, role, contact_info) VALUES
('admin-001', 'Admin User', 'admin@planora.com', '$2b$10$YourHashedPasswordHere', 'admin', 'admin@planora.com')
ON DUPLICATE KEY UPDATE id=id;
