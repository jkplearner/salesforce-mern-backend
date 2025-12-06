import {
  querySalesforce,
  createRecord,
  updateRecord,
  deleteRecord,
} from "../salesforceService.js";

// GET all accounts
export const getAccounts = async (req, res) => {
  try {
    const accounts = await querySalesforce(
      "SELECT Id, Name, Phone, Industry FROM Account"
    );
    res.json(accounts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET account by ID
export const getAccount = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await querySalesforce(
      `SELECT Id, Name, Phone, Industry FROM Account WHERE Id='${id}'`
    );
    res.json(result[0] || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CREATE account
export const createAccount = async (req, res) => {
  try {
    const result = await createRecord("Account", req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.response?.data || err.message });
  }
};

// UPDATE account
export const updateAccount = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await updateRecord("Account", id, req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.response?.data || err.message });
  }
};

// DELETE account
export const deleteAccount = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await deleteRecord("Account", id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.response?.data || err.message });
  }
};
