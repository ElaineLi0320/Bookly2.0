// getAccessToken.js
const { OAuth2Client } = require("google-auth-library");
require("dotenv").config();

const CLIENT_ID = process.env.OAUTH2_CLIENT_ID;
const CLIENT_SECRET = process.env.OAUTH2_CLIENT_SECRET;
const REDIRECT_URI = "http://localhost:3000/oauth2/callback";

const oauth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

// Replace 'authorization-code-from-auth-url' with the actual authorization code
const code = "authorization-code-from-auth-url";

async function getAccessToken() {
  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    console.log("Access Token:", tokens.access_token);
    return tokens.access_token;
  } catch (error) {
    console.error("Error getting access token:", error);
  }
}

getAccessToken();
