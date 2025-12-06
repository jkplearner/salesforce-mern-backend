import axios from "axios";
import { getSalesforceToken } from "./src/auth.js";
import "dotenv/config";

async function testGetLeads() {
  try {
    const accessToken = await getSalesforceToken();

    const url =
      process.env.SF_INSTANCE_URL +
      "/services/data/v60.0/query?q=" +
      encodeURIComponent("SELECT Id, Name, Company, Status FROM Lead LIMIT 5");

    const response = await axios.get(url, {
      headers: { Authorization: "Bearer " + accessToken },
    });

    console.log("LEADS:", response.data.records);
  } catch (err) {
    console.log("ERROR:", err.response?.data || err.message);
  }
}

testGetLeads();
