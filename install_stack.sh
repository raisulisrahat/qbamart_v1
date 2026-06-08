#!/bin/bash

# Full Stack Installation & Configuration Script for qbamart
# Installs: Node.js, Python, Django, Nginx, Gunicorn, PostgreSQL
# Configures: Venv, Build, Nginx, and Gunicorn Services

set -e # Exit on any error

echo "🚀 Initializing qbamart Production Stack..."

# 1. System Updates
echo "🔄 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# 2. Install PostgreSQL
echo "🐘 Installing PostgreSQL..."
sudo apt install postgresql postgresql-contrib libpq-dev -y
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create Database and User
DB_NAME="qbamart_prod"
DB_USER="qbamart_user"
DB_PASS=$(openssl rand -hex 12)

echo "🛠️ Configuring Database..."
# Check if database exists
DB_EXISTS=$(sudo -u postgres psql -tAc "SELECT 1 FROM pg_database WHERE datname='$DB_NAME'")
if [ "$DB_EXISTS" != "1" ]; then
    sudo -u postgres psql -c "CREATE DATABASE $DB_NAME;"
else
    echo "ℹ️ Database $DB_NAME already exists, skipping creation."
fi

# Check if user exists
USER_EXISTS=$(sudo -u postgres psql -tAc "SELECT 1 FROM pg_roles WHERE rolname='$DB_USER'")
if [ "$USER_EXISTS" != "1" ]; then
    sudo -u postgres psql -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASS';"
else
    echo "ℹ️ User $DB_USER already exists, skipping creation."
fi

sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;"

# 3. Install Dependencies
echo "🐍 Installing Python, Node.js, and Nginx..."
sudo apt install python3-pip python3-dev python3-venv nginx curl -y
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# 4. Backend Setup (Virtual Environment)
echo "📂 Setting up Backend Virtual Environment..."
cd backend
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
if [ -f requirements.txt ]; then
    pip install -r requirements.txt
fi
pip install gunicorn
deactivate
cd ..

# 5. Frontend Setup (Build)
echo "⚛️ Installing Node dependencies and Building App..."
cd web
npm install
npm run build
cd ..

# 6. Gunicorn Systemd Service Creation
echo "🦄 Creating Gunicorn Systemd Service..."
PROJECT_DIR=$(pwd)
sudo bash -c "cat <<EOF > /etc/systemd/system/gunicorn.service
[Unit]
Description=gunicorn daemon for qbamart
After=network.target

[Service]
User=$USER
Group=www-data
WorkingDirectory=$PROJECT_DIR/backend
ExecStart=$PROJECT_DIR/backend/venv/bin/gunicorn --access-logfile - --workers 3 --bind unix:/run/gunicorn.sock core.wsgi:application

[Install]
WantedBy=multi-user.target
EOF"

sudo systemctl start gunicorn
sudo systemctl enable gunicorn

# 7. Nginx Configuration Setup
echo "🌐 Configuring Nginx..."
if [ -f qbamart.conf ]; then
    sudo cp qbamart.conf /etc/nginx/sites-available/qbamart.conf
    sudo ln -sf /etc/nginx/sites-available/qbamart.conf /etc/nginx/sites-enabled/
    sudo nginx -t
    sudo systemctl restart nginx
else
    echo "⚠️ qbamart.conf not found, skipping Nginx auto-config."
fi

# 8. Summary and Credentials
echo "---------------------------------------------------"
echo "✅ Installation & Configuration Complete!"
echo "---------------------------------------------------"
echo "📂 Database Name: $DB_NAME"
echo "👤 Database User: $DB_USER"
echo "🔑 Database Password: $DB_PASS"
echo "---------------------------------------------------"
echo "🌐 Site is being served by Nginx"
echo "🦄 Backend is running via Gunicorn"
