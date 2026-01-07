# Cross-Device Sync Setup Guide

## 🔄 Enable Cross-Device Content Sync

Your church website now supports automatic syncing of content changes across all devices using GitHub.

### Step 1: Create GitHub Personal Access Token

1. Go to [GitHub.com](https://github.com) → Settings → Developer settings
2. Click "Personal access tokens" → "Tokens (classic)"
3. Click "Generate new token (classic)"
4. Give it a name: `Church Website Content`
5. Select these permissions:
   - ✅ **repo** (Full control of private repositories)
6. Click "Generate token"
7. **COPY THE TOKEN** (you won't see it again!)

### Step 2: Configure Your Website

1. Go to your website's admin panel: `/admin`
2. Click "Dashboard" in the sidebar
3. Paste your GitHub token in the "GitHub Sync" section
4. Click "Save to GitHub" after making any changes

### Step 3: Update Repository Settings

In your `src/services/githubSync.ts` file, replace:
```typescript
const REPO_OWNER = 'YOUR_USERNAME'; // Replace with your actual GitHub username
```

### How It Works

- **Make Changes**: Edit content in the admin panel on any device
- **Save to GitHub**: Click "Save to GitHub" button
- **Auto-Sync**: Other devices automatically check for updates every 30 seconds
- **Cross-Device**: Changes appear on all devices automatically within 30 seconds

### Usage Instructions

#### On Device 1 (Making Changes):
1. Edit content in admin panel
2. Click "Save to GitHub"
3. Changes are uploaded to GitHub

#### On Device 2 (Getting Updates):
1. Updates load automatically every 30 seconds
2. No manual action needed
3. Changes appear seamlessly

### Automatic Sync Features

✅ **Auto-Detection**: Checks for updates every 30 seconds
✅ **Silent Updates**: Content updates without page refresh
✅ **Smart Sync**: Only downloads when changes are detected
✅ **Background Process**: Works while you browse the site

### Troubleshooting

- **Token Error**: Make sure your token has "repo" permissions
- **Not Syncing**: Check your GitHub username in the code
- **Permission Denied**: Ensure the repository is public or token has access

### Security Notes

- Keep your GitHub token private
- Don't share your token with others
- You can revoke the token anytime in GitHub settings