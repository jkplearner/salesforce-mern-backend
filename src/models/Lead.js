import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        sfId: { type: String, required: true },
        label: { type: String, required: true }, // e.g. "Name (Company)" or just "LastName"
        cachedFields: { type: Map, of: String } // Optional fast access fields
    },
    { timestamps: true }
);

export default mongoose.model("Lead", leadSchema);
