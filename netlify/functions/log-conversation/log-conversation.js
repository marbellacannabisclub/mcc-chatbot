import { google } from 'googleapis';

// Netlify serverless function handler
export default async (req) => {
  try {
    // Parse the Google service account key from environment variable
    const serviceAccount = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);

    // Authenticate using the service account
    const auth = new google.auth.GoogleAuth({
      credentials: serviceAccount,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // No need to JSON.parse(req.body)! It's already an object
    const { userMessage, buddyReply, sessionId } = req.body;

    if (!userMessage || !buddyReply || !sessionId) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Prepare the new row to append
    const timestamp = new Date().toISOString();
    const values = [[timestamp, userMessage, buddyReply, sessionId]];

    // Define the spreadsheet ID and range
    const spreadsheetId = '1rBhSOcn5dMq9mto8POoWG6LRLZKdn9kY1yzH8KAocD8'; // Your Google Sheet ID
    const range = 'Buddy Conversations!A:D'; // Adjust if your sheet name changes

    // Append the data
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values,
      },
    });

    // Return success
    return new Response(JSON.stringify({ message: 'Conversation logged successfully!' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error logging conversation:', error);
    return new Response(JSON.stringify({ error: 'Failed to log conversation', details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
