const Task = require("../models/tasks");

const getTasks = async (req, res) => {
    try {
        const { status, search } = req.query;  // Extract status from query parameters
        const query = { assignedUser: req.userId };  // Only get tasks assigned to the logged-in user

        // If a status is provided in the query, add it to the filter
        if (status) {
            query.status = status;
        }

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: "i" } },       // Case-insensitive search on title
                { description: { $regex: search, $options: "i" } }  // Case-insensitive search on description
            ];
        }

        const tasks = await Task.find(query);
        res.status(200).json({tasks: tasks});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createTask = async (req, res) => {
    try {
        const task = new Task({ ...req.body, assignedUser: req.userId });
        await task.save();
        res.status(201).json({task: task});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const assignTask = async (req, res) => {
    try {
        const { taskId, assignedUserId } = req.params;
        const task = await Task.findByIdAndUpdate(taskId, { assignedUser: assignedUserId }, { new: true });
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        
        req.io.emit("taskAssigned", {
            message: `You have been assigned a new task: ${task.title}`,
            task,
        });

        res.status(200).json({task: task});
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

const updateTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!task) return res.status(404).json({ message: "Task not found" });
        
        if (task.assignedUser) {
            req.io.emit("taskUpdated", {
                message: `A task has been updated: ${task.title}`,
                task,
            });
        }

        res.json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) return res.status(404).json({ message: "Task not found" });
        res.json({ message: "Task deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const addCommentOnTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { content } = req.body;

        const task = await Task.findByIdAndUpdate(
            id,
            { $push: { comments: { userId: req.userId, content } } },
            { new: true }
        );

        if (!task) return res.status(404).json({ message: "Task not found" });

        req.io.emit("commentAdded", {
            message: `New comment added to task: ${task.title}`,
            task,
        });

        res.status(201).json({task: task});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const addAttachmentOnTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { url } = req.body;

        const task = await Task.findByIdAndUpdate(
            id,
            { $push: { attachments: { userId: req.userId, url } } },
            { new: true }
        );

        if (!task) return res.status(404).json({ message: "Task not found" });

        req.io.emit("attachmentAdded", {
            message: `New attachment added to task: ${task.title}`,
            task,
        });

        res.status(201).json({task: task});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const markTaskAsCompleted = async (req, res) => {
    console.log("request reached endpoint");
    try {
        const taskId = req.params.id;
        console.log("taskId: "+ taskId);
        const task = await Task.findByIdAndUpdate(
            taskId,
            { status: 'completed' },
            { new: true }
        );
        
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.status(201).json({ message: "Task marked as completed", task: task });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = { getTasks, createTask, updateTask, deleteTask, assignTask, addCommentOnTask, addAttachmentOnTask, markTaskAsCompleted };
