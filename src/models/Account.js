import mongoose from "mongoose";

const accountSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        sfId: { type: String, required: true },
        label: { type: String, required: true }, // Account Name
        cachedFields: { type: Map, of: String }
    },
    { timestamps: true }
);

export default mongoose.model("Account", accountSchema);
