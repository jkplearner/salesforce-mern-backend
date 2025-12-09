import Note from "../models/Note.js";

export const createNote = async (req, res) => {
    try {
        const note = await Note.create({
            ...req.body,
            userId: req.user.id,
        });
        res.json(note);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getNotes = async (req, res) => {
    try {
        const notes = await Note.find({
            userId: req.user.id,
            objectId: req.params.objectId,
        }).sort({ createdAt: -1 });
        res.json(notes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const deleteNote = async (req, res) => {
    try {
        const result = await Note.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.id,
        });
        if (!result) return res.status(404).json({ error: "Note not found" });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
