#!/bin/bash

# Script to completely clean Docker containers and volumes

set -e

echo "🛑 Stopping all running containers..."
docker-compose down -v

echo "🗑️  Removing containers..."
docker-compose rm -f

echo "🧹 Pruning Docker volumes..."
docker volume prune -f

echo "✅ Done! All containers and volumes removed."

