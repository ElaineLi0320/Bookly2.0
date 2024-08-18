const { OAuth2Client } = require("google-auth-library");
const express = require("express");
const app = express();
require("dotenv").config();

const CLIENT_ID = process.env.OAUTH2_CLIENT_ID;
const CLIENT_SECRET = process.env.OAUTH2_CLIENT_SECRET;
const REDIRECT_URI = "http://localhost:3000/oauth2/callback";

const oauth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

app.get("/auth", (req, res) => {
  const authorizeUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/cloud-platform"],
  });

  res.redirect(authorizeUrl);
});

app.get("/oauth2/callback", async (req, res) => {
  const { code } = req.query;

  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    res.send("Authentication successful! Access Token: " + tokens.access_token);
  } catch (error) {
    res.status(400).send("Error during authentication.");
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
