const express = require('express');
const { protect } = require('../middleware/auth.middleware');
const store = require('../data/store');
const router = express.Router();

// GET all artifacts (optionally filtered by projectId and type)
router.get('/', protect, (req, res) => {
    const { projectId, type } = req.query;
    let artifacts = store.artifacts;

    if (projectId && projectId !== 'all') {
        artifacts = store.artifacts.filter(a => a.projectId === projectId);
    }

    if (type) {
        artifacts = artifacts.filter(a => a.type === type);
    }

    console.log(`✅ Artifacts fetched: ${artifacts.length} for project ${projectId || 'all'}`);
    res.json(artifacts);
});

// GET single artifact by ID
router.get('/:id', protect, (req, res) => {
    const artifact = store.artifacts.find(a => a._id === req.params.id);
    if (artifact) {
        res.json(artifact);
    } else {
        res.status(404).json({ message: 'Artifact not found' });
    }
});

// POST create new artifact
router.post('/', protect, (req, res) => {
    try {
        const { title, type, content, projectId } = req.body;

        if (!title || !title.trim()) {
            return res.status(400).json({ message: 'Artifact title is required' });
        }

        const newArtifact = {
            _id: String(store.artifactIdCounter++),
            projectId: projectId || 'all',
            type: type || 'other',
            title: title.trim(),
            content,
            version: 1,
            createdAt: new Date()
        };

        store.artifacts.push(newArtifact);
        res.status(201).json(newArtifact);
    } catch (err) {
        console.error('❌ Error creating artifact:', err);
        res.status(500).json({ message: 'Failed to create artifact' });
    }
});

module.exports = router;
