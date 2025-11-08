#!/bin/bash

# Script to rebuild all Docker images and start services

set -e

echo "🔨 Stopping all running containers..."
docker-compose down

echo "🗑️  Removing old images..."
docker-compose rm -f

echo "🏗️  Building all images from scratch..."
docker-compose build --no-cache

echo "🚀 Starting all services..."
docker-compose up -d

echo "✅ Done! Services are starting up..."
echo "📊 Check status with: docker-compose ps"
echo "📝 View logs with: docker-compose logs -f"

