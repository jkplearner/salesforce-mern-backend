import {
  querySalesforce,
  createRecord,
  updateRecord,
  deleteRecord,
} from "../salesforceService.js";

// GET all leads
export const getLeads = async (req, res) => {
  try {
    const leads = await querySalesforce(
      "SELECT Id, LastName, Company, Status, Email FROM Lead"
    );
    res.json(leads);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET lead by ID
export const getLead = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await querySalesforce(
      `SELECT Id, LastName, Company, Status, Email FROM Lead WHERE Id='${id}'`
    );
    res.json(result[0] || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CREATE lead
export const createLead = async (req, res) => {
  try {
    const result = await createRecord("Lead", req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.response?.data || err.message });
  }
};

// UPDATE lead
export const updateLead = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await updateRecord("Lead", id, req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.response?.data || err.message });
  }
};

// DELETE lead
export const deleteLead = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await deleteRecord("Lead", id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.response?.data || err.message });
  }
};
