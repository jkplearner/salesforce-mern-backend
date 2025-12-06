import jwt from "jsonwebtoken";
import axios from "axios";
import fs from "fs";
import "dotenv/config";

export async function getSalesforceToken() {
  const privateKey = fs.readFileSync("./server.key", "utf8");

  const assertion = jwt.sign(
    {
      iss: process.env.SF_CLIENT_ID,
      sub: process.env.SF_USERNAME,
      aud: process.env.SF_LOGIN_URL,
      exp: Math.floor(Date.now() / 1000) + 300,
    },
    privateKey,
    { algorithm: "RS256" }
  );

  const response = await axios.post(
    process.env.SF_TOKEN_URL,
    new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
    { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
  );

  return response.data.access_token;
}
