# DataPulse Frontend

React frontend application for the DataPulse Ad Data platform, built with Vite, TypeScript, Material-UI, and React Router.

## Features

- **Authentication**: Magic link login and user signup
- **Organization Management**: Create, view, and manage organizations
- **Domain Management**: Manage domains with CRUD operations
- **Platform Management**: View available platforms
- **Integration Management**: Connect with Google, Facebook, TikTok, and Snapchat
- **Event Management**: View webhook events
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Material-UI (MUI)** - Component library
- **React Router** - Routing
- **Axios** - HTTP client
- **React Hook Form** - Form handling
- **date-fns** - Date formatting

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the frontend directory:
```env
VITE_API_BASE_URL=http://localhost:8080
VITE_APP_NAME=DataPulse
```

3. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The production build will be in the `dist` folder.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
frontend/
├── src/
│   ├── api/              # API service layer
│   ├── components/       # Reusable components
│   ├── contexts/         # React Context providers
│   ├── pages/           # Page components
│   ├── hooks/           # Custom React hooks
│   ├── utils/           # Utility functions
│   ├── App.tsx          # Main app component
│   └── main.tsx         # Entry point
├── public/              # Static assets
└── package.json         # Dependencies
```

## API Integration

The frontend communicates with the backend API at the URL specified in `VITE_API_BASE_URL`. All API calls are handled through the service layer in `src/api/`.

### Authentication

The app uses Bearer token authentication. Tokens are stored in localStorage and automatically included in API requests via Axios interceptors.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Environment Variables

- `VITE_API_BASE_URL` - Backend API base URL (default: http://localhost:8080)
- `VITE_APP_NAME` - Application name (default: DataPulse)

## Development Notes

- The app uses React Context for state management
- Protected routes require authentication
- All API errors are handled globally via Axios interceptors
- Forms use Material-UI components with validation
