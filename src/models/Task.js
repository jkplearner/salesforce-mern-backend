import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        subject: { type: String, required: true },
        dueDate: { type: Date },
        status: {
            type: String,
            enum: ["Not Started", "In Progress", "Completed", "Waiting on someone else", "Deferred"],
            default: "Not Started"
        },
        priority: {
            type: String,
            enum: ["High", "Normal", "Low"],
            default: "Normal"
        },
        relatedSfId: { type: String } // Optional FK to SF object
    },
    { timestamps: true }
);

export default mongoose.model("Task", taskSchema);
