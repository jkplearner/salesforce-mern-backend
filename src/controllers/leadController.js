import {
  querySalesforce,
  createRecord,
  updateRecord,
  deleteRecord,
} from "../salesforceService.js";
import Lead from "../models/Lead.js";
import { mapToSalesforce } from "../utils/fieldMapper.js";
import { validateSalesforceBody } from "../utils/validationHelper.js";

// Helper for standard response
const sendResponse = (res, success, message, data = {}) => {
  res.json({ success, message, data });
};

// GET all leads for the logged-in user
export const getLeads = async (req, res) => {
  try {
    const userLeads = await Lead.find({ userId: req.user.id });

    if (!userLeads.length) {
      return sendResponse(res, true, "No records found for this user", []);
    }

    // optimizing with IN query
    const sfIds = userLeads.map((l) => `'${l.sfId}'`).join(",");
    const sfQuery = `SELECT Id, Salutation, FirstName, LastName, Company, Title, Email, Phone, MobilePhone, LeadSource, Industry, Status, AnnualRevenue, NumberOfEmployees FROM Lead WHERE Id IN (${sfIds})`;

    const salesforceData = await querySalesforce(sfQuery);

    sendResponse(res, true, "Leads retrieved successfully", salesforceData);
  } catch (err) {
    sendResponse(res, false, err.message);
  }
};

// GET lead by ID
export const getLead = async (req, res) => {
  try {
    const { id } = req.params;
    // Verify ownership in Mongo first
    const mongoLead = await Lead.findOne({ sfId: id, userId: req.user.id });

    if (!mongoLead) {
      return res.status(404).json({ success: false, message: "Lead not found or unauthorized" });
    }

    const result = await querySalesforce(
      `SELECT Id, Salutation, FirstName, LastName, Company, Title, Email, Phone, MobilePhone, LeadSource, Industry, Status, AnnualRevenue, NumberOfEmployees FROM Lead WHERE Id='${id}'`
    );

    if (!result.length) {
      return sendResponse(res, false, "Lead not found in Salesforce");
    }

    sendResponse(res, true, "Lead retrieved successfully", result[0]);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// CREATE lead
export const createLead = async (req, res) => {
  try {
    const sfData = mapToSalesforce(req.body, "Lead");

    const errors = validateSalesforceBody("Lead", sfData);
    if (errors.length > 0) return res.status(400).json({ success: false, message: "Validation Error", errors });

    const sfResult = await createRecord("Lead", sfData);

    if (!sfResult.id) {
      throw new Error("Failed to create Lead in Salesforce");
    }

    const newLead = await Lead.create({
      userId: req.user.id,
      sfId: sfResult.id,
      label: `${sfData.LastName} (${sfData.Company})`
    });

    sendResponse(res, true, "Lead created successfully", { mongo: newLead, sfId: sfResult.id });
  } catch (err) {
    const sfError = err.response?.data;

    // 1. Surgical Fix: Handle Salesforce Duplicates
    if (Array.isArray(sfError) && sfError.some(e => e.errorCode === "DUPLICATES_DETECTED")) {
      return res.status(409).json({
        success: false,
        message: "Duplicate record detected. This Lead already exists in Salesforce."
      });
    }

    // 2. Safety Net: Ensure 'message' is ALWAYS a string
    let finalMessage = err.message;
    if (Array.isArray(sfError) && sfError[0]?.message) {
      finalMessage = `Salesforce Error: ${sfError[0].message}`;
    } else if (sfError && typeof sfError === 'object') {
      finalMessage = Object.keys(sfError).length > 0
        ? JSON.stringify(sfError)
        : "Unknown Salesforce Error";
    }

    console.error("🔥 CREATE LEAD ERROR:", finalMessage);
    res.status(500).json({ success: false, message: finalMessage });
  }
};

// UPDATE lead
export const updateLead = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Verify ownership
    const mongoLead = await Lead.findOne({ sfId: id, userId: req.user.id });
    if (!mongoLead) {
      return res.status(403).json({ success: false, message: "Unauthorized or Lead not found" });
    }

    // 2. Update Salesforce
    const sfData = mapToSalesforce(req.body, "Lead");

    await updateRecord("Lead", id, sfData);

    // 3. Update Mongo metadata if necessary (e.g. if name changed)
    if (sfData.LastName || sfData.Company) {
      mongoLead.label = `${sfData.LastName || mongoLead.label.split(' (')[0]} (${sfData.Company || mongoLead.label.split('(')[1].replace(')', '')})`;
      await mongoLead.save();
    }

    sendResponse(res, true, "Lead updated successfully");
  } catch (err) {
    res.status(500).json({ success: false, message: err.response?.data || err.message });
  }
};

// DELETE lead
export const deleteLead = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Verify ownership
    const mongoLead = await Lead.findOne({ sfId: id, userId: req.user.id });
    if (!mongoLead) {
      return res.status(403).json({ success: false, message: "Unauthorized or Lead not found" });
    }

    // 2. Delete from Salesforce
    await deleteRecord("Lead", id);

    // 3. Delete from Mongo
    await Lead.deleteOne({ _id: mongoLead._id });

    sendResponse(res, true, "Lead deleted successfully");
  } catch (err) {
    res.status(500).json({ success: false, message: err.response?.data || err.message });
  }
};
