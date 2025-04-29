import { google } from 'googleapis';

export default async (req) => {
  try {
    // Read and parse the body first
    const rawBody = await req.text();
    const parsedBody = JSON.parse(rawBody);
    
    console.log("Parsed body:", parsedBody); // Debugging

    // Build service account credentials from environment variables
    const serviceAccount = {
      type: 'service_account',
      project_id: process.env.GOOGLE_PROJECT_ID,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
    };

    const auth = new google.auth.GoogleAuth({
      credentials: serviceAccount,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    const { userMessage, buddyReply, sessionId } = parsedBody || {};

    if (!userMessage || !buddyReply || !sessionId) {
      console.error("Missing fields:", { userMessage, buddyReply, sessionId });
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const timestamp = new Date().toISOString();
    const values = [[timestamp, userMessage, buddyReply, sessionId]];

    console.log("Prepared values to append:", values);

    const spreadsheetId = '1rBhSOcn5dMq9mto8POoWG6LRLZKdn9kY1yzH8KAocD8';
    const range = 'Buddy Conversations!A:D';

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values,
      },
    });

    console.log("Google Sheets API response:", response.data);

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
