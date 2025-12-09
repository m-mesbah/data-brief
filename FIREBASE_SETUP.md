# Firebase Client SDK Setup Guide

## Overview
Your backend uses **Firebase Admin SDK** (server-side), but your frontend needs **Firebase Client SDK** (browser-side) configuration. These are different credentials.

## How to Get Firebase Client SDK Configuration

### Option 1: Firebase Console (Recommended)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click the gear icon ⚙️ next to "Project Overview"
4. Select **Project Settings**
5. Scroll down to **Your apps** section
6. If you don't have a web app yet:
   - Click **Add app** → Select **Web** (</> icon)
   - Register your app (you can name it "DataPulse Frontend")
   - Copy the configuration values
7. If you already have a web app:
   - Click on the web app
   - Copy the configuration values

### Option 2: Extract from Firebase Admin Config

From your Firebase Admin config (`.env` file), you can extract:
- **project_id** → Use this for `VITE_FIREBASE_PROJECT_ID`
- **authDomain** → Usually `{project_id}.firebaseapp.com`
- **storageBucket** → Usually `{project_id}.appspot.com`

However, you'll still need to get these from Firebase Console:
- **apiKey** (Web API Key)
- **messagingSenderId**
- **appId**

## Configuration Values

Once you have the config, update `frontend/.env`:

```env
VITE_FIREBASE_API_KEY=AIzaSy... (Web API Key)
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id (same as project_id in Admin config)
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
```

## Quick Setup Script

If you have your Firebase Admin config's `project_id`, you can use this to auto-generate some values:

```bash
# In your backend .env, find the project_id from FIREBASE_ADMIN
# Then in frontend/.env:
VITE_FIREBASE_PROJECT_ID=<your-project-id>
VITE_FIREBASE_AUTH_DOMAIN=<your-project-id>.firebaseapp.com
VITE_FIREBASE_STORAGE_BUCKET=<your-project-id>.appspot.com
```

But you still need to get `apiKey`, `messagingSenderId`, and `appId` from Firebase Console.

## Important Notes

- **Never expose Firebase Admin credentials** in the frontend
- Firebase Admin SDK is for server-side only
- Firebase Client SDK is safe to use in the browser
- The `apiKey` in Client SDK is public and safe to expose (it's restricted by domain/auth settings)

