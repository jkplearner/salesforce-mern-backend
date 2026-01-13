import express from "express";
import { askAi } from "../controllers/ai.controller.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/ask", protect, askAi);

export default router;
