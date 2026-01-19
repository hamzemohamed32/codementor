const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    roleMode: { type: String, enum: ['Auto', 'PM', 'Architect', 'Frontend', 'Backend', 'QA', 'DevOps', 'Security', 'user'], default: 'Auto' },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Message', messageSchema);
