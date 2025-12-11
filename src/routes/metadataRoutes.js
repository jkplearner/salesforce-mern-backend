import express from "express";
import {
    getAccountMetadata,
    getLeadMetadata,
    getTaskMetadata,
    getOpportunityMetadata
} from "../controllers/metadataController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/accounts", getAccountMetadata);
router.get("/leads", getLeadMetadata);
router.get("/tasks", getTaskMetadata);
router.get("/opportunities", getOpportunityMetadata);

export default router;
