# MCC Chatbot

A chatbot for Marbella Cannabis Club (MCC) that helps users learn about the club, its services, and products.

## Setup

### Prerequisites

- Node.js (v18 or later)
- npm
- Netlify CLI
- OpenRouter API key
- Google Sheets API credentials (optional, for logging conversations)

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```

### Environment Variables

You need to set up the following environment variables:

- `OPENROUTER_API_KEY`: Your OpenRouter API key
- `GOOGLE_PROJECT_ID`: Your Google Cloud project ID (optional)
- `GOOGLE_PRIVATE_KEY`: Your Google Cloud private key (optional)
- `GOOGLE_CLIENT_EMAIL`: Your Google Cloud client email (optional)

You can set these up using the provided script:

```
./setup-env.sh YOUR_OPENROUTER_API_KEY [GOOGLE_PROJECT_ID GOOGLE_PRIVATE_KEY GOOGLE_CLIENT_EMAIL]
```

## Development

To run the development server:

```
./start-dev.sh
```

This will:
1. Check if the OpenRouter API key is set
2. Kill any running Vite processes
3. Start the Netlify development server

Alternatively, you can run:

```
npx netlify-cli dev
```

## Production

To build for production:

```
npm run build
```

To deploy to Netlify:

```
netlify deploy --prod
```

## Features

- Chat with Buddy, the MCC AI assistant
- Learn about MCC's services, products, and membership
- Log conversations to Google Sheets (if configured)
