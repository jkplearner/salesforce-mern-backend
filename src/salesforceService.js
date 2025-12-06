import axios from "axios";
import { getSalesforceToken } from "./auth.js";
import "dotenv/config";

/* --------------------------------------------
   Generic Salesforce CRUD Utility Functions
---------------------------------------------- */

// SOQL Query
export async function querySalesforce(query) {
  const token = await getSalesforceToken();
  const url =
    process.env.SF_INSTANCE_URL +
    "/services/data/v60.0/query?q=" +
    encodeURIComponent(query);

  const response = await axios.get(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data.records;
}

// CREATE record
export async function createRecord(objectName, data) {
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
}

// UPDATE record
export async function updateRecord(objectName, id, data) {
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
}

// DELETE record
export async function deleteRecord(objectName, id) {
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
}
