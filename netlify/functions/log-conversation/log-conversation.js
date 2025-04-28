import { google } from 'googleapis';

export default async (req) => {
  try {
    console.log("Received request body:", req.body); // <-- ADD THIS LINE

    const serviceAccount = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);

    const auth = new google.auth.GoogleAuth({
      credentials: serviceAccount,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // No JSON.parse(req.body), just use it
    const { userMessage, buddyReply, sessionId } = req.body || {};

    if (!userMessage || !buddyReply || !sessionId) {
      console.error("Missing fields:", { userMessage, buddyReply, sessionId }); // <-- ADD THIS LINE
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const timestamp = new Date().toISOString();
    const values = [[timestamp, userMessage, buddyReply, sessionId]];

    console.log("Prepared values to append:", values); // <-- ADD THIS LINE

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

    console.log("Google Sheets API response:", response.data); // <-- ADD THIS LINE

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
