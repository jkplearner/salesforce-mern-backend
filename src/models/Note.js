import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
    {
        text: { type: String, required: true },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        objectId: { type: String, required: true }, // Can be Lead or Account SF ID
    },
    { timestamps: true }
);

export default mongoose.model("Note", noteSchema);
