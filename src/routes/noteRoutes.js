import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
    createNote,
    getNotes,
    deleteNote,
} from "../controllers/noteController.js";

const router = express.Router();

router.use(protect);

router.post("/", createNote);
router.get("/:objectId", getNotes);
router.delete("/:id", deleteNote);

export default router;
