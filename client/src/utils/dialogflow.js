const { OAuth2Client } = require("google-auth-library");
const dialogflow = require("@google-cloud/dialogflow");
const uuid = require("uuid");

const CLIENT_ID = process.env.REACT_APP_OAUTH2_CLIENT_ID;
const CLIENT_SECRET = process.env.REACT_APP_OAUTH2_CLIENT_SECRET;
const REDIRECT_URI = "http://localhost:3000/oauth2/callback";

const oauth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

const projectId = "bookly-chatbot";
const sessionId = uuid.v4();

const authorizeUrl = oauth2Client.generateAuthUrl({
  access_type: "offline",
  scope: ["https://www.googleapis.com/auth/cloud-platform"],
});

console.log("Authorize this app by visiting this url:", authorizeUrl);

async function getAccessToken(code) {
  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    return tokens.access_token;
  } catch (error) {
    console.error("Error getting access token:", error);
  }
}

async function sendQueryToDialogFlow(text, code) {
  try {
    // Get the access token using the authorization code
    const accessToken = await getAccessToken(code);

    const sessionClient = new dialogflow.SessionsClient({
      credentials: {
        access_token: accessToken,
      },
    });

    const sessionPath = sessionClient.projectAgentSessionPath(
      projectId,
      sessionId
    );

    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text: text,
          languageCode: "en-US",
        },
      },
    };

    const [response] = await sessionClient.detectIntent(request);
    const intent = response.queryResult;
    return intent.fulfillmentText;
  } catch (error) {
    console.error("DialogFlow error:", error);
    return "Sorry, I'm not sure how to answer that. Please try again.";
  }
}

export default sendQueryToDialogFlow;
