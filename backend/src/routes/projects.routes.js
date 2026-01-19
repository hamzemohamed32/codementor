const express = require('express');
const { protect } = require('../middleware/auth.middleware');
const store = require('../data/store');
const { kickoffProject } = require('../../services/kickoffService');
const router = express.Router();

// GET all projects
router.get('/', protect, (req, res) => {
    console.log(`✅ Projects fetched for user: ${req.user.username}`);
    res.json(store.projects);
});

// POST create new project
router.post('/', protect, async (req, res) => {
    try {
        const { title, description, stack } = req.body;

        if (!title || !title.trim()) {
            return res.status(400).json({ message: 'Project title is required' });
        }

        const newProject = {
            _id: String(store.projectIdCounter++),
            title: title.trim(),
            description: description?.trim() || '',
            stack: stack?.trim() || '',
            createdAt: new Date()
        };

        store.projects = [newProject, ...store.projects];
        console.log(`✅ Project created: "${title}"`);

        // Trigger AI Kickoff in background
        console.log(`🤖 Triggering AI kickoff for project: ${newProject._id}`);
        kickoffProject(newProject._id, newProject.title, newProject.description)
            .then(data => {
                if (data) {
                    // Save AI-generated tasks to store
                    data.tasks.forEach(t => {
                        store.tasks.push({
                            _id: String(store.taskIdCounter++),
                            projectId: newProject._id,
                            title: t.title,
                            status: 'To do',
                            priority: t.priority || 'Medium',
                            createdAt: new Date()
                        });
                    });

                    // Save AI-generated artifacts to store
                    data.artifacts.forEach(a => {
                        store.artifacts.push({
                            _id: String(store.artifactIdCounter++),
                            projectId: newProject._id,
                            type: a.type,
                            title: a.title,
                            content: a.content,
                            version: 1,
                            createdAt: new Date()
                        });
                    });

                    // Add welcome message from AI to chat
                    store.messages.push({
                        _id: String(store.messageIdCounter++),
                        projectId: newProject._id,
                        roleMode: 'Auto',
                        content: data.welcomeMessage || `I've initialized your project kickoff! You can find the requirements, architecture, and task backlog in the respective tabs.`,
                        createdAt: new Date()
                    });

                    console.log(`✅ AI Kickoff completed for ${newProject.title}. Tasks: ${data.tasks.length}, Artifacts: ${data.artifacts.length}`);
                }
            })
            .catch(err => console.error('❌ AI Kickoff failed:', err.message));

        res.status(201).json(newProject);
    } catch (err) {
        console.error('❌ Error creating project:', err);
        res.status(500).json({ message: 'Failed to create project' });
    }
});

// GET single project by ID
router.get('/:id', protect, (req, res) => {
    const project = store.projects.find(p => p._id === req.params.id);
    if (project) {
        res.json(project);
    } else {
        res.status(404).json({ message: 'Project not found' });
    }
});

module.exports = router;
