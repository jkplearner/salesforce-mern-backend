import mongoose from "mongoose";

const opportunitySchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        sfId: { type: String, required: true },
        label: { type: String, required: true }, // Opportunity Name
        cachedFields: { type: Map, of: String }
    },
    { timestamps: true }
);

export default mongoose.model("Opportunity", opportunitySchema);
