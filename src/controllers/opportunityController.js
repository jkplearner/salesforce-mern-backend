import {
  querySalesforce,
  createRecord,
  updateRecord,
  deleteRecord,
} from "../salesforceService.js";

// GET all opportunities
export const getOpportunities = async (req, res) => {
  try {
    const opps = await querySalesforce(
      "SELECT Id, Name, StageName, Amount, CloseDate FROM Opportunity"
    );
    res.json(opps);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET opportunity by ID
export const getOpportunity = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await querySalesforce(
      `SELECT Id, Name, StageName, Amount, CloseDate FROM Opportunity WHERE Id='${id}'`
    );
    res.json(result[0] || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CREATE opportunity
export const createOpportunity = async (req, res) => {
  try {
    const validRegions = [
      "North",
      "North-East",
      "South",
      "South-West",
      "East",
      "West"
    ];

    if (!req.body.Region__c || !validRegions.includes(req.body.Region__c)) {
      return res.status(400).json({
        error: "Region__c is required and must be one of: North, North-East, South, South-West, East, West"
      });
    }

    const result = await createRecord("Opportunity", req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.response?.data || err.message });
  }
};

// UPDATE opportunity
export const updateOpportunity = async (req, res) => {
  try {
    const id = req.params.id;

    const validRegions = [
      "North",
      "North-East",
      "South",
      "South-West",
      "East",
      "West"
    ];

    if (req.body.Region__c && !validRegions.includes(req.body.Region__c)) {
      return res.status(400).json({
        error: "Region__c must be one of: North, North-East, South, South-West, East, West"
      });
    }

    const result = await updateRecord("Opportunity", id, req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.response?.data || err.message });
  }
};


// DELETE opportunity
export const deleteOpportunity = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await deleteRecord("Opportunity", id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.response?.data || err.message });
  }
};
