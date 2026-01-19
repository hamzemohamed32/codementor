const express = require('express');
const { protect } = require('../middleware/auth.middleware');
const store = require('../data/store');
const router = express.Router();

// GET all tasks (optionally filtered by projectId)
router.get('/', protect, (req, res) => {
    const { projectId } = req.query;
    let tasks = store.tasks;

    if (projectId && projectId !== 'all') {
        tasks = store.tasks.filter(t => t.projectId === projectId);
    }

    console.log(`✅ Tasks fetched: ${tasks.length} for project ${projectId || 'all'}`);
    res.json(tasks);
});

// POST create new task
router.post('/', protect, (req, res) => {
    try {
        const { title, projectId, priority = 'Medium', description } = req.body;

        if (!title || !title.trim()) {
            return res.status(400).json({ message: 'Task title is required' });
        }

        const newTask = {
            _id: String(store.taskIdCounter++),
            projectId: projectId || 'all',
            title: title.trim(),
            description: description?.trim() || '',
            status: 'To do',
            priority,
            createdAt: new Date()
        };

        store.tasks.push(newTask);

        console.log(`✅ Task created: "${title}"`);
        res.status(201).json(newTask);
    } catch (err) {
        console.error('❌ Error creating task:', err);
        res.status(500).json({ message: 'Failed to create task' });
    }
});

// PATCH update task (mainly for status)
router.patch('/:id', protect, (req, res) => {
    try {
        const { id } = req.params;
        const { status, title, priority } = req.body;

        const taskIndex = store.tasks.findIndex(t => t._id === id);
        if (taskIndex === -1) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Update fields
        if (status) store.tasks[taskIndex].status = status;
        if (title) store.tasks[taskIndex].title = title;
        if (priority) store.tasks[taskIndex].priority = priority;

        console.log(`✅ Task updated: ${id} (status: ${status})`);
        res.json(store.tasks[taskIndex]);
    } catch (err) {
        console.error('❌ Error updating task:', err);
        res.status(500).json({ message: 'Failed to update task' });
    }
});

module.exports = router;
