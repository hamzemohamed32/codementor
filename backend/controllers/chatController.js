const store = require('../src/data/store');
const { generateResponse } = require('../services/aiService');

const sendMessage = async (req, res) => {
    // Note: projectId might be in params or body
    const projectId = req.params.projectId || req.body.projectId;
    const { content, roleMode } = req.body;

    try {
        console.log(`💬 Message received for project ${projectId}: "${content.substring(0, 30)}..."`);

        // 1. Save user message
        const userMsg = {
            _id: String(store.messageIdCounter++),
            projectId,
            roleMode: 'user',
            content,
            createdAt: new Date()
        };
        store.messages.push(userMsg);

        // 2. Call AI Service
        const aiResponse = await generateResponse(projectId, roleMode || 'Auto', content);

        // 3. Save AI message
        const aiMsg = {
            _id: String(store.messageIdCounter++),
            projectId,
            roleMode: roleMode || 'Auto',
            content: aiResponse.content,
            createdAt: new Date()
        };
        store.messages.push(aiMsg);

        res.json({
            userMessage: userMsg,
            aiMessage: aiMsg
        });
    } catch (error) {
        console.error('❌ Chat Controller Error:', error.message);
        res.status(500).json({ message: 'Server error during AI chat' });
    }
};

const getChatHistory = async (req, res) => {
    const { projectId } = req.params;
    try {
        const history = store.messages.filter(m => m.projectId === projectId);
        console.log(`📂 Fetched ${history.length} messages for project ${projectId}`);
        res.json(history);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching chat history' });
    }
};

module.exports = { sendMessage, getChatHistory };
