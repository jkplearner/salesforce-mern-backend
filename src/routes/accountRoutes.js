import express from "express";
import {
  getAccounts,
  getAccount,
  createAccount,
  updateAccount,
  deleteAccount,
} from "../controllers/accountController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getAccounts);
router.get("/:id", protect, getAccount);
router.post("/", protect, createAccount);
router.patch("/:id", protect, updateAccount);
router.delete("/:id", protect, deleteAccount);

export default router;
