const { generateResponse } = require('./aiService');
const axios = require('axios'); // For internal calls if needed or use imported routes

// This service handles the automatic project initialization
const kickoffProject = async (projectId, projectTitle, projectDescription) => {
    try {
        console.log(`🚀 Starting AI Kickoff for Project: ${projectTitle}`);

        const prompt = `You are CodeMentor AI. I just started a new project: "${projectTitle}".
Description: ${projectDescription}

Please perform a PROJECT KICKOFF. 
I need you to generate:
1. MVP Scope (Must-have vs Nice-to-have)
2. 2 User Personas
3. Key User Stories
4. Suggested App Screens
5. System Architecture Overview
6. MongoDB Schema Draft
7. API Endpoints List
8. A list of 12 actionable tasks for the Kanban backlog.

FORMATTING:
Return your response as a JSON object with the following structure:
{
  "artifacts": [
    {"type": "requirements", "title": "MVP Scope & Requirements", "content": "markdown content..."},
    {"type": "architecture", "title": "System Architecture", "content": "markdown content..."},
    {"type": "db", "title": "Database Schema", "content": "markdown content..."},
    {"type": "api", "title": "API Specification", "content": "markdown content..."},
    {"type": "ui", "title": "UI Screen Plan", "content": "markdown content..."}
  ],
  "tasks": [
    {"title": "Task title", "priority": "High/Medium/Low"},
    ... (at least 12)
  ],
  "welcomeMessage": "A friendly greeting summarizing what you've created."
}

DO NOT include any text before or after the JSON. Only return the JSON.`;

        const response = await generateResponse(projectId, 'Auto', prompt);

        // Attempt to parse JSON from AI response
        let kickoffData;
        try {
            // AI might wrap in ```json ... ```
            const jsonMatch = response.content.match(/\{[\s\S]*\}/);
            kickoffData = JSON.parse(jsonMatch ? jsonMatch[0] : response.content);
        } catch (e) {
            console.error('❌ Failed to parse AI kickoff JSON. Falling back to structured parsing.', e);
            // Fallback logic if AI fails JSON format
            return;
        }

        console.log(`✅ AI Kickoff generated for ${projectTitle}`);

        // In this implementation with mock data, we need to find a way to save these.
        // For now, we will log them. In a real DB implementation, we would insert these into 
        // the artifacts and tasks collections.

        return kickoffData;
    } catch (err) {
        console.error('❌ Kickoff Service Error:', err.message);
    }
};

module.exports = { kickoffProject };
