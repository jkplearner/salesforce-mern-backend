import Task from "../models/Task.js";
import { validateSalesforceBody } from "../utils/validationHelper.js";

const sendResponse = (res, success, message, data = {}) => {
    res.json({ success, message, data });
};

// GET all tasks (Local Mongo)
export const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.user.id }).sort({ createdAt: -1 });
        sendResponse(res, true, "Tasks retrieved successfully", tasks);
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// GET task by ID (Local Mongo)
export const getTask = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await Task.findOne({ _id: id, userId: req.user.id });

        if (!task) {
            return res.status(404).json({ success: false, message: "Task not found" });
        }

        sendResponse(res, true, "Task retrieved successfully", task);
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// CREATE task (Local Mongo)
export const createTask = async (req, res) => {
    try {
        // Validate required fields and picklists
        // Task is local, but we validate picklists using the helper which expects PascalCase keys for "Status" and "Priority".
        const validationObj = {
            Status: req.body.status,
            Priority: req.body.priority,
            Subject: req.body.subject // Validator doesn't enforce Subject, but good to pass if we add it later
        };

        const errors = validateSalesforceBody("Task", validationObj);
        // Validator expects 'Name' etc which Task doesn't have. Task has Subject.
        // The validationHelper 'Task' section checks Status and Priority.

        if (errors.length > 0) return res.status(400).json({ success: false, message: "Validation Error", errors });

        const newTask = await Task.create({
            userId: req.user.id,
            subject: req.body.subject,
            dueDate: req.body.dueDate,
            status: req.body.status || "Not Started",
            priority: req.body.priority || "Normal",
            relatedSfId: req.body.relatedSfId
        });

        sendResponse(res, true, "Task created successfully", newTask);
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// UPDATE task (Local Mongo)
export const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await Task.findOne({ _id: id, userId: req.user.id });

        if (!task) {
            return res.status(403).json({ success: false, message: "Unauthorized or Task not found" });
        }

        // Update allowed fields
        if (req.body.subject) task.subject = req.body.subject;
        if (req.body.dueDate) task.dueDate = req.body.dueDate;
        if (req.body.status) task.status = req.body.status;
        if (req.body.priority) task.priority = req.body.priority;
        if (req.body.relatedSfId) task.relatedSfId = req.body.relatedSfId;

        await task.save();

        sendResponse(res, true, "Task updated successfully", task);
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// DELETE task (Local Mongo)
export const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await Task.findOne({ _id: id, userId: req.user.id });

        if (!task) {
            return res.status(403).json({ success: false, message: "Unauthorized or Task not found" });
        }

        await Task.deleteOne({ _id: id });

        sendResponse(res, true, "Task deleted successfully");
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
