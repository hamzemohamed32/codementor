const mongoose = require('mongoose');

const artifactSchema = new mongoose.Schema({
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    type: { type: String, enum: ['requirements', 'api', 'db', 'ui', 'tests', 'deploy'], required: true },
    content: { type: String, required: true },
    version: { type: Number, default: 1 },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Artifact', artifactSchema);
