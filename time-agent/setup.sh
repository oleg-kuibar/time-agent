#!/bin/bash

# Print commands and exit on errors
set -e

echo "🚀 Setting up Time Agent development environment..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker and Docker Compose first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Start Docker containers
echo "🐳 Starting Docker containers..."
docker-compose up -d

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
sleep 5

# Push database schema
echo "🗃️ Setting up database schema..."
pnpm db:push

echo "✅ Setup complete! You can now run 'pnpm dev' to start the development server."
echo "🌐 The application will be available at http://localhost:3000" 