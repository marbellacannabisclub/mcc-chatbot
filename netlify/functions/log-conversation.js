const { google } = require('googleapis');

const handler = async (event, context) => {
  try {
    console.log("Log conversation function called");
    console.log("Event body:", event.body);

    // Read and parse the body
    const parsedBody = JSON.parse(event.body);
    console.log("Parsed body:", parsedBody);

    // Check if Google Sheets API credentials are provided
    if (!process.env.GOOGLE_PROJECT_ID || !process.env.GOOGLE_PRIVATE_KEY || !process.env.GOOGLE_CLIENT_EMAIL) {
      console.warn("Google Sheets API credentials are not provided. Skipping conversation logging.");
      return new Response(JSON.stringify({ message: 'Conversation logging skipped (no credentials)' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Build service account credentials from environment variables
    const serviceAccount = {
      type: 'service_account',
      project_id: 'buddy-sheets-logger',
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      client_email: 'buddy-sheets-access@buddy-sheets-logger.iam.gserviceaccount.com',
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

    const spreadsheetId = '1wdWk_znfVcsQva8fF7tC3jpG9rrrupIG6aNN42uCn6E';
    const range = 'BuddyConversations!A:D';

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

exports.handler = handler; 