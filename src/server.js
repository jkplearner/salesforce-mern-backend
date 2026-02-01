import express from "express";
import cors from "cors";
import leadRoutes from "./routes/leadRoutes.js";
import accountRoutes from "./routes/accountRoutes.js";
import opportunityRoutes from "./routes/opportunityRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import metadataRoutes from "./routes/metadataRoutes.js";
import aiRoutes from "./routes/ai.js";
import {
  globalLimiter,
  authLimiter,
  aiLimiter,
  sfDataLimiter,
  mongoLimiter
} from "./middleware/rateLimiters.js";
import "dotenv/config";
import { connectDB } from "./config/db.js";

// connectDB(); // Removed immediate call for race condition fix

const app = express();
app.use(cors());
app.use(express.json({ limit: "100kb" }));

// 1. Global Safety Net
app.use(globalLimiter);

app.get("/", (req, res) => res.send("Salesforce MERN API Running"));

// 2. Auth Routes (Strict brute-force protection)
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/signup", authLimiter);
app.use("/api/auth", authRoutes); // Remaining auth routes (like /me)

// 3. Metadata (High limit / Static) -> Use mongoLimiter or Global
app.use("/api/metadata", mongoLimiter, metadataRoutes);

// 4. AI (Expensive)
app.use("/api/ai", aiLimiter, aiRoutes);

// 5. Salesforce Resources (Quota Protected)
app.use("/api/leads", sfDataLimiter, leadRoutes);
app.use("/api/accounts", sfDataLimiter, accountRoutes);
app.use("/api/opportunities", sfDataLimiter, opportunityRoutes);

// 6. Local Resources (Mongo Only)
app.use("/api/tasks", mongoLimiter, taskRoutes);
app.use("/api/notes", mongoLimiter, noteRoutes);

// 🔥 REQUIRED: GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
  console.error("🔥 GLOBAL SERVER ERROR:", err);
  // res.status(500).json({ error: err.message }); // LEAK RISK
  res.status(500).json({ error: "Internal Server Error" });
});

const start = async () => {
  try {
    await connectDB();
    app.listen(process.env.PORT, () =>
      console.log(`Server running on port ${process.env.PORT}`)
    );
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
};

start();
