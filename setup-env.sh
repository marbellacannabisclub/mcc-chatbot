#!/bin/bash

# Check if OPENROUTER_API_KEY is provided
if [ -z "$1" ]; then
  echo "Error: OPENROUTER_API_KEY is required"
  echo "Usage: ./setup-env.sh YOUR_OPENROUTER_API_KEY"
  exit 1
fi

# Set the OpenRouter API key
export OPENROUTER_API_KEY=$1

# Check if Google Sheets API credentials are provided
if [ -z "$2" ] || [ -z "$3" ] || [ -z "$4" ]; then
  echo "Warning: Google Sheets API credentials are not provided"
  echo "Usage: ./setup-env.sh OPENROUTER_API_KEY GOOGLE_PROJECT_ID GOOGLE_PRIVATE_KEY GOOGLE_CLIENT_EMAIL"
  echo "The log-conversation function will not work without these credentials"
else
  # Set the Google Sheets API credentials
  export GOOGLE_PROJECT_ID=$2
  export GOOGLE_PRIVATE_KEY=$3
  export GOOGLE_CLIENT_EMAIL=$4
fi

echo "Environment variables set successfully!"
echo "Now you can run: npx netlify-cli dev" 