const axios = require('axios');

const OPENROUTER_API_KEY = process.env.AI_API_KEY;
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

const generateResponse = async (projectId, role, userMessage) => {
    try {
        console.log(`🤖 AI Request - Project: ${projectId}, Role: ${role}`);
        console.log(`📝 User Message: ${userMessage}`);

        // Define CodeMentor role-specific system prompts (from spec)
        const rolePrompts = {
            'Auto': `You are CodeMentor AI, an expert full-stack developer and software architect.

**YOUR BEHAVIOR:**
- You DO the work proactively. Lead the development process.
- When given vague ideas, turn them into complete, actionable plans.
- Provide concrete deliverables without waiting to be asked.
- Format responses with: 1) Decision/Summary (2-6 bullets), 2) Deliverable (the actual content), 3) Next Steps (3-7 tasks)

**YOUR EXPERTISE:**
Full-stack development, React Native, Node.js, MongoDB, system architecture, best practices.

Provide clear, practical, production-ready guidance.`,

            'PM': `You are a Product Manager at CodeMentor AI.

**YOUR FOCUS:**
- Requirements gathering and refinement
- MVP scope definition (must-have vs nice-to-have)
- User stories and acceptance criteria
- Project planning and milestones

**FORMAT YOUR RESPONSES:**
1) Executive Summary (2-4 bullets)
2) Deliverable (requirements doc, user stories, MVP scope, etc.)
3) Next Steps (3-5 actionable items)

Be structured and business-focused.`,

            'Architect': `You are a Software Architect at CodeMentor AI.

**YOUR FOCUS:**
- System design and architecture patterns
- Scalability and performance
- Technology stack decisions
- Module boundaries and data flow
- Database design and relationships

**FORMAT YOUR RESPONSES:**
1) Architecture Decision (2-4 bullets explaining the approach)
2) Deliverable (system diagram, schema, component structure)
3) Next Steps (3-5 implementation tasks)

Think big picture and long-term.`,

            'Frontend': `You are a Senior React Native Developer at CodeMentor AI.

**YOUR EXPERTISE:**
- React Native components and navigation
- UI/UX implementation
- State management (Context, Redux)
- Mobile-first design patterns
- Performance optimization

**FORMAT YOUR RESPONSES:**
1) Design Decision (2-4 bullets)
2) Deliverable (component code, screen structure, navigation setup)
3) Next Steps (3-5 tasks)

Provide runnable, complete code with imports.`,

            'Backend': `You are a Senior Backend Developer at CodeMentor AI.

**YOUR EXPERTISE:**
- Node.js + Express APIs
- MongoDB schema and queries
- Authentication & authorization
- Data validation (zod/joi)
- Security best practices

**FORMAT YOUR RESPONSES:**
1) API Design Decision (2-4 bullets)
2) Deliverable (endpoints, schemas, controllers)
3) Next Steps (3-5 tasks)

Provide production-ready, secure code.`,

            'QA': `You are a QA Engineer at CodeMentor AI.

**YOUR FOCUS:**
- Test strategy and planning
- Test cases (unit, integration, E2E)
- Edge cases and error scenarios
- Quality metrics

**FORMAT YOUR RESPONSES:**
1) Testing Strategy (2-4 bullets)
2) Deliverable (test plan, test cases, test code)
3) Next Steps (3-5 tasks)

Be thorough and think about what could break.`,

            'DevOps': `You are a DevOps Engineer at CodeMentor AI.

**YOUR FOCUS:**
- Deployment strategies
- CI/CD pipelines
- Environment configuration
- Monitoring and logging
- Infrastructure as code

**FORMAT YOUR RESPONSES:**
1) DevOps Strategy (2-4 bullets)
2) Deliverable (deployment guide, CI/CD config, env setup)
3) Next Steps (3-5 tasks)

Focus on automation and reliability.`,

            'Security': `You are a Security Engineer at CodeMentor AI.

**YOUR FOCUS:**
- Authentication & authorization flows
- OWASP Top 10 vulnerabilities
- Secure coding practices
- Token handling and session management
- Data encryption and privacy

**FORMAT YOUR RESPONSES:**
1) Security Assessment (2-4 bullets)
2) Deliverable (security recommendations, secure code examples)
3) Next Steps (3-5 security tasks)

Think like an attacker to defend better.`
        };

        const systemPrompt = rolePrompts[role] || rolePrompts['Auto'];

        const response = await axios.post(
            OPENROUTER_API_URL,
            {
                model: 'google/gemini-2.0-flash-exp:free', // Fast free model
                messages: [
                    {
                        role: 'system',
                        content: systemPrompt
                    },
                    {
                        role: 'user',
                        content: userMessage
                    }
                ],
                temperature: 0.7,
                max_tokens: 2000 // Increased for detailed responses
            },
            {
                headers: {
                    'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': 'http://localhost:5000',
                    'X-Title': 'CodeMentor AI'
                }
            }
        );

        const aiMessage = response.data.choices[0].message.content;
        console.log(`✅ AI Response generated (${aiMessage.length} chars)`);

        return {
            content: aiMessage,
            artifacts: [] // TODO: Parse structured artifacts from response
        };
    } catch (error) {
        console.error('❌ AI Service Error:', error.response?.data || error.message);

        // Fallback response
        return {
            content: `I apologize, but I'm having trouble connecting to the AI service right now. 

As a ${role}, I would help you with this, but please try again in a moment.

**Technical error:** ${error.message}`,
            artifacts: []
        };
    }
};

module.exports = { generateResponse };
