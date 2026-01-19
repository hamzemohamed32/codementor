// Basic in-memory data store to share between routes and services
const store = {
    projects: [
        {
            _id: '1',
            title: 'E-Commerce Platform',
            description: 'Full-stack e-commerce solution',
            stack: 'React Native, Node.js, MongoDB',
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        }
    ],
    tasks: [
        { _id: '1', projectId: '1', title: 'Implement Authentication', status: 'Done', priority: 'High', createdAt: new Date() },
        { _id: '2', projectId: '1', title: 'Design Database Schema', status: 'Doing', priority: 'High', createdAt: new Date() },
    ],
    artifacts: [
        {
            _id: '1',
            projectId: '1',
            type: 'requirements',
            title: 'User Requirements Document',
            content: '# User Requirements\n\n1. User can sign in with Google\n2. User can create projects\n3. AI assists in development',
            version: 1,
            createdAt: new Date()
        }
    ],
    messages: [],
    projectIdCounter: 2,
    taskIdCounter: 3,
    artifactIdCounter: 2,
    messageIdCounter: 1
};

module.exports = store;
