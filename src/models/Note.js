import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        relatedSfId: { type: String, required: true }, // Links to Account/Lead
        title: { type: String },
        content: { type: String, required: true }
    },
    { timestamps: true }
);

export default mongoose.model("Note", noteSchema);
