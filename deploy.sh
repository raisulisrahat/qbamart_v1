#!/bin/bash

# qbamart Automated Deployment Script
# 🚀 This script automates the Docker-based deployment process.

set -e

echo "🌌 Starting qbamart Deployment..."

# 1. Check for Prerequisites
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install it first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install it first."
    exit 1
fi

# 2. Setup Environment Variables
if [ ! -f .env ]; then
    echo "📝 Creating .env file from defaults..."
    cat <<EOF > .env
DB_NAME=qbamart_db
DB_USER=qbamart_user
DB_PASSWORD=$(openssl rand -hex 12)
DEBUG=False
EOF
    echo "✅ .env file created with a secure random password."
else
    echo "✅ .env file already exists."
fi

# 3. Build and Start Containers
echo "🏗️ Building and starting containers (this may take a few minutes)..."
docker-compose up --build -d

# 4. Finalize Backend
echo "🛠️ Finalizing backend (migrations & static files)..."
docker-compose exec backend python manage.py migrate --no-input
docker-compose exec backend python manage.py collectstatic --no-input

# 5. Summary
echo "---------------------------------------------------"
echo "✅ Deployment Successful!"
echo "🌐 Frontend: http://localhost (or your server IP)"
echo "📡 Backend API: http://localhost/api/"
echo "👑 Admin Panel: http://localhost/admin/"
echo "---------------------------------------------------"
echo "💡 To create an admin account, run:"
echo "   docker-compose exec backend python manage.py createsuperuser"
echo "---------------------------------------------------"
