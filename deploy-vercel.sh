#!/bin/bash

echo "🚀 Deploying to Vercel..."

# Build the project
echo "Building project..."
npm run build

# Deploy to Vercel
echo "Deploying to production..."
vercel --prod

echo "✅ Deployment complete!"
echo "🌐 Your site is now live on Vercel"