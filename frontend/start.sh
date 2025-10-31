#!/bin/bash

# TerraVolt Frontend Startup Script

echo "🌍 Starting TerraVolt Frontend..."

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "⚙️  Creating .env file..."
    echo "VITE_API_URL=http://localhost:8000" > .env
fi

echo "🚀 Starting development server..."
echo ""
echo "Frontend will be available at: http://localhost:5173"
echo "Make sure the backend is running on: http://localhost:8000"
echo ""

npm run dev

