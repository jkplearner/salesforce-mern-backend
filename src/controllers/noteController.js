import Note from "../models/Note.js";

const sendResponse = (res, success, message, data = {}) => {
    res.json({ success, message, data });
};

// GET all notes for a specific object
// Route: /api/notes/:objectId
// Wait, route was: router.get("/:objectId", protect, getNotes);
export const getNotes = async (req, res) => {
    try {
        const { objectId } = req.params;
        // Notes for an object, owned by user
        const notes = await Note.find({ userId: req.user.id, relatedSfId: objectId });
        sendResponse(res, true, "Notes retrieved successfully", notes);
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// CREATE note
export const createNote = async (req, res) => {
    try {
        // Validate
        if (!req.body.content) return res.status(400).json({ success: false, message: "Content is required" });
        if (!req.body.relatedSfId) return res.status(400).json({ success: false, message: "Related Salesforce ID is required" });

        const newNote = await Note.create({
            userId: req.user.id,
            relatedSfId: req.body.relatedSfId,
            title: req.body.title,
            content: req.body.content
        });

        sendResponse(res, true, "Note created successfully", newNote);
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// DELETE note
export const deleteNote = async (req, res) => {
    try {
        const { id } = req.params;
        const note = await Note.findOne({ _id: id, userId: req.user.id }); // Using Mongo ID since it's local

        if (!note) {
            return res.status(403).json({ success: false, message: "Unauthorized or Note not found" });
        }

        await Note.deleteOne({ _id: id });

        sendResponse(res, true, "Note deleted successfully");
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
