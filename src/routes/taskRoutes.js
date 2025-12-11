import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
    createTask,
    getTasks,
    updateTask,
    deleteTask,
} from "../controllers/taskController.js";

const router = express.Router();

router.use(protect);

router.post("/", protect, createTask);
router.get("/", protect, getTasks);
router.patch("/:id", protect, updateTask);
router.delete("/:id", protect, deleteTask);

export default router;
