import express from "express";
import {
  getOpportunities,
  getOpportunity,
  createOpportunity,
  updateOpportunity,
  deleteOpportunity,
} from "../controllers/opportunityController.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();

router.get("/", protect, getOpportunities);
router.get("/:id", protect, getOpportunity);
router.post("/", protect, createOpportunity);
router.patch("/:id", protect, updateOpportunity);
router.delete("/:id", protect, deleteOpportunity);

export default router;
