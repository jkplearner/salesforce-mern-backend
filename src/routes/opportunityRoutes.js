import express from "express";
import {
  getOpportunities,
  getOpportunity,
  createOpportunity,
  updateOpportunity,
  deleteOpportunity,
} from "../controllers/opportunityController.js";

const router = express.Router();

router.get("/", getOpportunities);
router.get("/:id", getOpportunity);
router.post("/", createOpportunity);
router.put("/:id", updateOpportunity);
router.delete("/:id", deleteOpportunity);

export default router;
