const Task = require("../models/Task");

exports.createTask = async (req, res) => {
    const { title, description } = req.body;

    try {
        const task = await Task.create({
            title,
            description,
            userId: req.user.id,
        });
        res.status(201).json(task);
    } catch {
        res.status(500).json({ error: "Task creation failed" });
    }
};

exports.getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.user.id });
        res.json(tasks);
    } catch {
        res.status(500).json({ error: "Failed to fetch tasks" });
    }
};

exports.updateTask = async (req, res) => {
    const { id } = req.params;
    const { title, description, completed } = req.body;

    try {
        const updated = await Task.findOneAndUpdate(
            { _id: id, userId: req.user.id },
            { title, description, completed },
            { new: true }
        );
        res.json(updated);
    } catch {
        res.status(500).json({ error: "Task update failed" });
    }
};

exports.deleteTask = async (req, res) => {
    const { id } = req.params;

    try {
        await Task.findOneAndDelete({ _id: id, userId: req.user.id });
        res.json({ message: "Task deleted" });
    } catch {
        res.status(500).json({ error: "Task deletion failed" });
    }
};
