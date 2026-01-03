@echo off
echo 🚀 Setting up Cloudflare D1 Database and R2 Storage

echo Creating D1 database for church content...
wrangler d1 create church-content-db

echo.
echo Creating R2 bucket for church photos...
wrangler r2 bucket create church-photos-bucket

echo.
echo Setting up database tables...
wrangler d1 execute church-content-db --file=./schema.sql

echo.
echo ✅ Cloudflare setup complete!
echo.
echo 📝 Next steps:
echo 1. Copy the database ID from above and update wrangler.toml
echo 2. Update API_BASE_URL in src/services/cloudflare.ts
echo 3. Deploy worker: wrangler deploy

pause