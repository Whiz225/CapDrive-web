# CapDrive - Frontend

The frontend application for CapDrive - a comprehensive car marketplace and ride booking platform built with Next.js, Tailwind CSS, and React.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [Routing](#routing)
- [State Management](#state-management)
- [API Integration](#api-integration)
- [Styling](#styling)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## 🚀 Features

- **Authentication**

  - Email/Password registration and login
  - Google OAuth 2.0 integration
  - JWT token-based authentication
  - Protected routes with middleware
  - Email and phone verification
  - Password reset functionality

- **Car Marketplace**

  - Browse cars with advanced search and filters
  - Car detail pages with images and features
  - Favorites system with red heart indicator
  - Dealer listings management
  - Car listing creation and editing

- **Ride Booking**

  - Request rides with multiple ride types
  - Real-time ride tracking
  - Ride history
  - Fare calculation

- **User Features**

  - Profile management with avatar upload
  - Account settings with dark/light mode
  - Verification status with percentage
  - User dashboard with stats

- **Admin & Dealer Dashboards**

  - Admin dashboard with analytics
  - Dealer dashboard with listing management
  - Subscription management

- **UI/UX**
  - Dark/Light mode support
  - Fully responsive design
  - Professional styling with Tailwind CSS
  - Toast notifications
  - Loading states

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **UI Library**: React 18
- **Styling**: Tailwind CSS 3
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Forms**: React Hook Form
- **Icons**: Heroicons
- **HTTP Client**: Axios
- **UI Components**: Headless UI
- **Notifications**: React Hot Toast
- **Charts**: Recharts
- **Animations**: Framer Motion
- **Authentication**: JWT, Google OAuth

## 📦 Installation

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Steps

```bash
# Clone the repository
git clone https://github.com/yourusername/capdrive.git
cd capdrive/frontend

# Install dependencies
npm install

# Create environment file
cp .env.local.example .env.local

# Update environment variables
nano .env.local

# Run the development server
npm run dev
```
