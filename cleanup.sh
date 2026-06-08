#!/bin/bash

# qbamart Cleanup Script
# 🗑️ This script stops and removes all containers, networks, and volumes.

echo "⚠️ WARNING: This will delete all application data, including the database!"
read -p "Are you sure you want to proceed? (y/N) " confirm

if [[ $confirm == [yY] || $confirm == [yY][eE][sS] ]]; then
    echo "🛑 Stopping and removing containers..."
    docker-compose down -v
    echo "✅ Cleanup complete."
else
    echo "❌ Operation cancelled."
fi
