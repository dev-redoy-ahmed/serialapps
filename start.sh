#!/bin/bash

echo "🚀 Starting BD Admin Panel..."

# Check if we're in production
if [ "$NODE_ENV" = "production" ]; then
    echo "📦 Production mode detected"
    
    # Verify environment variables
    if [ -z "$MONGODB_URI" ]; then
        echo "❌ ERROR: MONGODB_URI environment variable is not set"
        exit 1
    fi
    
    echo "✅ Environment variables checked"
    
    # Start the application
    echo "🌐 Starting Next.js server on port ${PORT:-3000}..."
    exec npm start
else
    echo "🔧 Development mode detected"
    exec npm run dev
fi
