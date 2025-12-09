import express from "express";
import cors from "cors";
import leadRoutes from "./routes/leadRoutes.js";
import accountRoutes from "./routes/accountRoutes.js";
import opportunityRoutes from "./routes/opportunityRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import "dotenv/config";
import { connectDB } from "./config/db.js";

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("Salesforce MERN API Running"));

app.use("/api/auth", authRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/accounts", accountRoutes);
app.use("/api/opportunities", opportunityRoutes);

// 🔥 REQUIRED: GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
  console.error("🔥 GLOBAL SERVER ERROR:", err);
  res.status(500).json({ error: err.message });
});

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
