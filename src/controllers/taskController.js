import Task from "../models/Task.js";

export const createTask = async (req, res) => {
    try {
        const task = await Task.create({
            ...req.body,
            userId: req.user.id,
        });
        res.json(task);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const updateTask = async (req, res) => {
    try {
        const task = await Task.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id },
            req.body,
            { new: true }
        );
        if (!task) return res.status(404).json({ error: "Task not found" });
        res.json(task);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const deleteTask = async (req, res) => {
    try {
        const result = await Task.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.id,
        });
        if (!result) return res.status(404).json({ error: "Task not found" });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
