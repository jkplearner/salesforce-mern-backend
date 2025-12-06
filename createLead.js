import axios from "axios";
import { getSalesforceToken } from "./src/auth.js";
import "dotenv/config";

async function testCreateLead() {
  try {
    const accessToken = await getSalesforceToken();

    const url =
      process.env.SF_INSTANCE_URL + "/services/data/v60.0/sobjects/Lead/";

    const response = await axios.post(
      url,
      {
        LastName: "Test Lead",
        Company: "Test Company",
        Status: "Open - Not Contacted"
      },
      {
        headers: {
          Authorization: "Bearer " + accessToken,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("LEAD CREATED:", response.data);
  } catch (err) {
    console.log("ERROR:", err.response?.data || err.message);
  }
}

testCreateLead();
