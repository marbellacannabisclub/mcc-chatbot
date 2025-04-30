#!/bin/bash

# Load environment variables from .env file if it exists
if [ -f .env ]; then
  source .env
fi

# Kill any running Vite processes
pkill -f vite

# Start the Netlify development server
echo "Starting Netlify development server..."
npx netlify-cli dev 