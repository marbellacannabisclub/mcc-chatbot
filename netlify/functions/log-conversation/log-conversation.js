const { google } = require('googleapis');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const body = JSON.parse(event.body);

  const { userMessage, buddyReply, sessionId } = body;

  if (!userMessage || !buddyReply || !sessionId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing required fields.' }),
    };
  }

  try {
    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    const sheetId = '1wdWk_znfVcsQva8fF7tC3jpG9rrrupIG6aNN42uCn6E';

    const timestamp = new Date().toISOString();

    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: 'Buddy Conversations!A:D',
      valueInputOption: 'RAW',
      requestBody: {
        values: [[timestamp, userMessage, buddyReply, sessionId]],
      },
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (error) {
    console.error('Error logging conversation:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to log conversation.' }),
    };
  }
};
