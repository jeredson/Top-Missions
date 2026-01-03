# Firebase Setup Instructions

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: `church-portfolio`
4. Enable Google Analytics (optional)
5. Click "Create project"

## Step 2: Enable Services

### Enable Firestore Database
1. Go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode"
4. Select location (closest to your users)

### Enable Storage
1. Go to "Storage"
2. Click "Get started"
3. Choose "Start in test mode"
4. Select location

### Enable Authentication (Optional)
1. Go to "Authentication"
2. Click "Get started"
3. Enable "Email/Password" provider

## Step 3: Get Configuration

1. Go to Project Settings (gear icon)
2. Scroll to "Your apps"
3. Click "Web app" icon (</>)
4. Register app name: `church-website`
5. Copy the config object

## Step 4: Update Firebase Config

Replace the config in `src/config/firebase.ts`:

```typescript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};
```

## Step 5: Security Rules

### Firestore Rules
Go to Firestore > Rules and update:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read access to published content
    match /content/{document} {
      allow read: if resource.data.status == 'published';
      allow write: if request.auth != null;
    }
    
    // Allow read access to photos
    match /photos/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Allow read access to events
    match /events/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### Storage Rules
Go to Storage > Rules and update:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /images/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## Step 6: Environment Variables

Create `.env.local`:

```
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=your-app-id
```

## Step 7: Test the Setup

1. Start your development server: `npm run dev`
2. Go to admin page and try:
   - Creating content
   - Uploading photos
   - Viewing content/photos

## Firebase Free Tier Limits

- **Firestore**: 50,000 reads, 20,000 writes, 20,000 deletes per day
- **Storage**: 5GB storage, 1GB/day downloads
- **Authentication**: Unlimited users

Perfect for a church website! 🎉