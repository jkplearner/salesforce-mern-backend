import {
  querySalesforce,
  createRecord,
  updateRecord,
  deleteRecord,
} from "../salesforceService.js";
import Opportunity from "../models/Opportunity.js";
import { mapToSalesforce } from "../utils/fieldMapper.js";
import { validateSalesforceBody } from "../utils/validationHelper.js";

const sendResponse = (res, success, message, data = {}) => {
  res.json({ success, message, data });
};

// GET all opportunities
export const getOpportunities = async (req, res) => {
  try {
    const userOpps = await Opportunity.find({ userId: req.user.id });

    if (!userOpps.length) {
      return sendResponse(res, true, "No opportunities found for this user", []);
    }

    const sfIds = userOpps.map(o => `'${o.sfId}'`).join(",");
    const opportunities = await querySalesforce(
      `SELECT Id, Name, StageName, Amount, CloseDate FROM Opportunity WHERE Id IN (${sfIds})`
    );
    sendResponse(res, true, "Opportunities retrieved successfully", opportunities);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET opportunity by ID
export const getOpportunity = async (req, res) => {
  try {
    const { id } = req.params;
    const mongoOpp = await Opportunity.findOne({ sfId: id, userId: req.user.id });

    if (!mongoOpp) {
      return res.status(404).json({ success: false, message: "Opportunity not found or unauthorized" });
    }

    const result = await querySalesforce(
      `SELECT Id, Name, StageName, Amount, CloseDate FROM Opportunity WHERE Id='${id}'`
    );

    if (!result.length) {
      return sendResponse(res, false, "Opportunity not found in Salesforce");
    }

    sendResponse(res, true, "Opportunity retrieved successfully", result[0]);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// CREATE opportunity
export const createOpportunity = async (req, res) => {
  try {
    const sfData = mapToSalesforce(req.body, "Opportunity");

    const errors = validateSalesforceBody("Opportunity", sfData);
    if (errors.length > 0) return res.status(400).json({ success: false, message: "Validation Error", errors });

    const sfResult = await createRecord("Opportunity", sfData);

    // Create in MongoDB
    const newOpp = await Opportunity.create({
      userId: req.user.id,
      sfId: sfResult.id,
      label: sfData.Name
    });

    sendResponse(res, true, "Opportunity created successfully", { mongo: newOpp, sfId: sfResult.id });
  } catch (err) {
    res.status(500).json({ success: false, message: err.response?.data || err.message });
  }
};

// UPDATE opportunity
export const updateOpportunity = async (req, res) => {
  try {
    const { id } = req.params;
    const mongoOpp = await Opportunity.findOne({ sfId: id, userId: req.user.id });

    if (!mongoOpp) {
      return res.status(403).json({ success: false, message: "Unauthorized or Opportunity not found" });
    }

    const sfData = mapToSalesforce(req.body, "Opportunity");

    await updateRecord("Opportunity", id, sfData);

    if (sfData.Name) {
      mongoOpp.label = sfData.Name;
      await mongoOpp.save();
    }

    sendResponse(res, true, "Opportunity updated successfully");
  } catch (err) {
    res.status(500).json({ success: false, message: err.response?.data || err.message });
  }
};

// DELETE opportunity
export const deleteOpportunity = async (req, res) => {
  try {
    const { id } = req.params;
    const mongoOpp = await Opportunity.findOne({ sfId: id, userId: req.user.id });

    if (!mongoOpp) {
      return res.status(403).json({ success: false, message: "Unauthorized or Opportunity not found" });
    }

    await deleteRecord("Opportunity", id);
    await Opportunity.deleteOne({ _id: mongoOpp._id });

    sendResponse(res, true, "Opportunity deleted successfully");
  } catch (err) {
    res.status(500).json({ success: false, message: err.response?.data || err.message });
  }
};

