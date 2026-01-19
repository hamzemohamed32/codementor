const Project = require('../models/Project');

const createProject = async (req, res) => {
    const { title, description, stack } = req.body;
    try {
        const project = await Project.create({
            ownerId: req.user._id,
            title,
            description,
            stack
        });
        res.status(201).json(project);
    } catch (error) {
        res.status(500).json({ message: 'Error creating project' });
    }
};

const getProjects = async (req, res) => {
    try {
        const projects = await Project.find({ ownerId: req.user._id });
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching projects' });
    }
};

const getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (project && project.ownerId.toString() === req.user._id.toString()) {
            res.json(project);
        } else {
            res.status(404).json({ message: 'Project not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { createProject, getProjects, getProjectById };
