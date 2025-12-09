import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String },
        dueDate: { type: Date },
        status: {
            type: String,
            enum: ["pending", "in-progress", "completed"],
            default: "pending",
        },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

        // Optional Salesforce links
        leadId: { type: String },
        opportunityId: { type: String },
    },
    { timestamps: true }
);

export default mongoose.model("Task", taskSchema);
