#!/bin/bash

echo "🚀 Cloudflare Deployment Setup"

# 1. Create D1 Database
echo "Creating D1 database..."
wrangler d1 create church-content

# 2. Create R2 Bucket for photos
echo "Creating R2 bucket..."
wrangler r2 bucket create church-photos

# 3. Execute database schema
echo "Setting up database schema..."
wrangler d1 execute church-content --file=./schema.sql

# 4. Deploy Worker
echo "Deploying Cloudflare Worker..."
wrangler deploy

echo "✅ Deployment complete!"
echo "📝 Don't forget to:"
echo "   1. Update wrangler.toml with your actual database_id"
echo "   2. Update API_BASE_URL in src/services/cloudflare.ts"
echo "   3. Configure R2 custom domain for photo URLs"