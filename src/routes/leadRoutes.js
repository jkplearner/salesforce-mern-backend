import express from "express";
import {
  getLeads,
  getLead,
  createLead,
  updateLead,
  deleteLead,
} from "../controllers/leadController.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();

router.get("/", protect, getLeads);
router.get("/:id", protect, getLead);
router.post("/", protect, createLead);
router.patch("/:id", protect, updateLead);
router.delete("/:id", protect, deleteLead);

export default router;
