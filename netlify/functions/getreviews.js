// netlify/functions/getReviews.js
const { google } = require('googleapis');

// Initialize the Google auth client
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

exports.handler = async function(event, context) {
  try {
    // Set up credentials
    oauth2Client.setCredentials({
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN
    });

    // Initialize the Business Profile API
    const mybusiness = google.mybusiness({
      version: 'v4',
      auth: oauth2Client
    });

    // Get the account and location
    const accounts = await mybusiness.accounts.list();
    const accountName = accounts.data.accounts[0].name;
    
    const locations = await mybusiness.accounts.locations.list({
      parent: accountName
    });
    
    const locationName = locations.data.locations[0].name;

    // Get reviews
    const reviews = await mybusiness.accounts.locations.reviews.list({
      parent: locationName,
      pageSize: 10, // Adjust as needed
      orderBy: 'updateTime desc'
    });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'https://completeelectric.ca',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify(reviews.data.reviews)
    };
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch reviews' })
    };
  }
}