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

    // Extract data from the request body
    const { userMessage, buddyReply, sessionId } = JSON.parse(req.body);

    if (!userMessage || !buddyReply || !sessionId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields' }),
      };
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
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Conversation logged successfully!' }),
    };

  } catch (error) {
    console.error('Error logging conversation:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to log conversation', details: error.message }),
    };
  }
};
