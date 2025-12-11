import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
    createNote,
    getNotes,
    deleteNote,
} from "../controllers/noteController.js";

const router = express.Router();

router.use(protect);

router.post("/", protect, createNote);
router.get("/:objectId", protect, getNotes);
router.delete("/:id", protect, deleteNote);

export default router;
