# Ticket Management System

## 📋 Overview

SupportSphere is a comprehensive ticket management system designed to streamline support workflows. The system helps organizations manage customer support requests efficiently with a user-friendly interface.

**The system consists of three main components:**

- **Client Portal** - Where users submit and track support tickets
- **Admin Dashboard** - Where support staff manage and resolve tickets
- **Backend API** - Handles data processing, authentication, and email notifications

**Live Demo**: [https://ticket-client.vercel.app](https://ticketing-delta-eight.vercel.app)
  **Admin** :https://adminticketing-managment.vercel.app
  **awagger** :https://ticket-server-production-d4c5.up.railway.app/api-docs

## ✨ Features

### User Management

- **User registration with email verification** - New users receive an OTP (one-time password) via email to verify their account
- **Secure authentication with JWT** - JSON Web Tokens ensure secure access to the application
- **Role-based access control** - Different permission levels for Admin, Support Staff, and Regular Users
- **User profile management** - Users can update their information and preferences

### Ticket Management

- **Create, view, and track support tickets** - Users can submit new tickets and monitor progress
- **Categorize tickets by priority and type** - Helps in organizing and prioritizing support requests
- **Upload attachments to tickets** - Users can attach relevant files to provide context
- **Real-time status updates** - Ticket status changes are displayed immediately
- **Email notifications** - Users receive email alerts when their ticket status changes

### Admin Capabilities

- **Comprehensive dashboard with analytics** - Visual representation of ticket statistics and trends
- **Assign tickets to support staff** - Efficiently distribute workload among team members
- **Bulk actions for ticket management** - Process multiple tickets simultaneously
- **User administration** - Manage user accounts, roles, and permissions

## 🛠️ Technology Stack

### Frontend (Client & Admin)

- **React** with TypeScript - For building interactive user interfaces with type safety
- **TanStack Query** - For efficient data fetching, caching, and state management
- **React Router** - For handling navigation and routing
- **Axios** - For making HTTP requests to the backend
- **React Hook Form** - For efficient form handling and validation
- **Tailwind CSS** - For responsive and customizable styling

### Backend

- **Node.js with Express** - Fast, unopinionated web framework for building APIs
- **TypeScript** - For adding static type definitions and enhancing code quality
- **MongoDB with Mongoose ODM** - Flexible document database with elegant object modeling
- **JWT** - For secure authentication and authorization
- **Zod** - For robust schema validation
- **EJS** - For generating HTML email templates
- **Nodemailer** - For sending email notifications
- **Sentry** - For error tracking and monitoring

## 🚀 Getting Started

### Prerequisites

- **Node.js (v16+)** - JavaScript runtime environment
- **MongoDB instance** - Database for storing application data
- **Gmail account or other email provider** - For sending notification emails
- **Git** - Version control system

### Server Setup

1. Clone the repository

```bash
git clone https://github.com/yourusername/supportsphere.git
cd supportsphere/server
```

2. Install dependencies

```bash
pnpm install
```

3. Set up environment variables

# Create a .env file with the following variables

MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ticketing
JWT_SECRET=your_jwt_secret_key
GMAIL_EMAIL=your-email@gmail.com
GMAIL_APP_PASSWORD=your-app-password
SMTP_EMAIL=noreply@yourdomain.com
FRONTEND_URL=http://localhost:5173

## By :Esmael Abdlkadr - Lead Developer
