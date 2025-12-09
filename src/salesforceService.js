import axios from "axios";
import { getSalesforceToken } from "./auth.js";
import "dotenv/config";

export async function querySalesforce(query) {
  try {
    const token = await getSalesforceToken();

    const url =
      process.env.SF_INSTANCE_URL +
      "/services/data/v60.0/query?q=" +
      encodeURIComponent(query);

    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data.records;

  } catch (err) {
    console.error("🔥 QUERY ERROR:", err.response?.data || err.message);
    throw err;
  }
}

export async function createRecord(objectName, data) {
  try {
    const token = await getSalesforceToken();

    const url =
      process.env.SF_INSTANCE_URL +
      `/services/data/v60.0/sobjects/${objectName}/`;

    const response = await axios.post(url, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;

  } catch (err) {
    console.error("🔥 CREATE ERROR:", err.response?.data || err.message);
    throw err;
  }
}

export async function updateRecord(objectName, id, data) {
  try {
    const token = await getSalesforceToken();

    const url =
      process.env.SF_INSTANCE_URL +
      `/services/data/v60.0/sobjects/${objectName}/${id}`;

    const response = await axios.patch(url, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;

  } catch (err) {
    console.error("🔥 UPDATE ERROR:", err.response?.data || err.message);
    throw err;
  }
}

export async function deleteRecord(objectName, id) {
  try {
    const token = await getSalesforceToken();

    const url =
      process.env.SF_INSTANCE_URL +
      `/services/data/v60.0/sobjects/${objectName}/${id}`;

    await axios.delete(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return { success: true };

  } catch (err) {
    console.error("🔥 DELETE ERROR:", err.response?.data || err.message);
    throw err;
  }
}
