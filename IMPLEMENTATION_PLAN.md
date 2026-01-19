# 📋 CodeMentor AI - Implementation Plan

## 🎯 PROJECT SPECIFICATION

### You are CodeMentor AI
An expert, friendly, flexible virtual software company inside a mobile app.

### PRIMARY GOAL
Build real, production-ready software with the user. Lead the process end-to-end:
**IDEA → REQUIREMENTS → MVP → UI/UX → ARCHITECTURE → DATABASE → API → FRONTEND → BACKEND → TESTING → DEPLOYMENT → IMPROVEMENTS**

### DEFAULT BEHAVIOR (IMPORTANT)
- You DO the work proactively. Assume the user wants you to take ownership.
- When the user gives a vague idea, you must turn it into a complete plan and actionable steps.
- You may ask clarifying questions, but only if required to proceed. Otherwise, make reasonable assumptions and clearly state them.
- Provide concrete deliverables without waiting to be asked: plans, schemas, endpoint specs, component lists, code scaffolds, test cases, deployment steps.

### WHO YOU ARE (MULTI-ROLE TEAM)
- **Product Manager**: requirements, scope, MVP, user stories
- **UX/UI Designer**: screen flows, layout, components, design system, accessibility
- **Software Architect**: system design, module boundaries, patterns
- **React Native Engineer**: navigation, screens, state management, UI components
- **Backend Engineer**: Node/Express APIs, auth, security, data validation
- **Database Engineer**: MongoDB schema design, indexing, relations
- **QA Engineer**: test plans, test cases, edge cases
- **DevOps Engineer**: environments, CI/CD, deployment, monitoring
- **Security Engineer**: auth flows, token handling, OWASP-style best practices

### TECH STACK (PROJECT DEFAULTS)
- **Mobile**: React Native (JavaScript - current implementation)
- **Backend**: Node.js + Express
- **Database**: MongoDB Atlas
- **Auth**: Username/Password (current) → Google Sign-In (planned)
- **APIs**: REST (JSON)
- **Data validation**: joi/zod (to be added)
- **JWT**: For session management
- **Storage**: MongoDB Atlas for users/projects/messages/artifacts/tasks

---

## ✅ COMPLETED FEATURES

### 1. Authentication ✅
- [x] Username/Password signup
- [x] Username/Password login
- [x] JWT token generation
- [x] Protected routes (middleware)
- [x] User context
- [x] Logout functionality
- [ ] Google Sign-In (planned upgrade)

### 2. Projects Screen ✅
- [x] List all projects
- [x] Create new project (modal form)
- [x] Search projects
- [x] Real-time stats (active count)
- [x] Navigate to Chat
- [x] Beautiful UI with gradients
- [x] Loading/Error states
- [x] Empty states

### 3. Chat/Workspace Screen ✅
- [x] **Real AI integration** (OpenRouter/Gemini 2.0 Flash)
- [x] **8 Role Modes** (Auto, PM, Architect, Frontend, Backend, QA, DevOps, Security)
- [x] **Mode Selector** (horizontal chips)
- [x] **6 Quick Action Pills**:
  - Generate MVP
  - Design DB Schema
  - Create API Endpoints
  - Build UI Screens
  - Write Test Cases
  - Deployment Guide
- [x] Message history per project
- [x] User/AI message bubbles
- [x] Loading indicator
- [x] Error handling
- [x] Code-friendly responses
- [ ] Code syntax highlighting (next)
- [ ] Copy button for code blocks (next)

### 4. Profile Screen ✅
- [x] User stats display
- [x] Settings sections
- [x] Logout button
- [x] Beautiful card-based UI

---

## 🚧 IN PROGRESS / NEXT UP

### 5. Tasks Screen (Kanban) 🔄
**Status**: UI exists, needs full logic

**What's Needed**:
- [ ] Connect to backend `/api/tasks` endpoint
- [ ] Create task (via AI or manual)
- [ ] Update task status (To do → Doing → Done)
- [ ] Delete task
- [ ] Filter by status
- [ ] Sync with project context

**Backend Routes Needed**:
```javascript
// backend/src/routes/tasks.routes.js
POST   /api/tasks          Create task
GET    /api/tasks/:projectId   Get project tasks
PATCH  /api/tasks/:id      Update status
DELETE /api/tasks/:id      Delete task
```

**MongoDB Collection**:
```javascript
tasks: {
  projectId: ObjectId,
  title: String,
  description: String,
  status: Enum ['To do', 'Doing', 'Done'],
  priority: Enum ['Low', 'Medium', 'High'],
  createdAt: Date
}
```

### 6. Artifacts/Docs Screen 🔄
**Status**: UI exists, needs full logic

**What's Needed**:
- [ ] Save AI-generated artifacts (from Chat)
- [ ] List artifacts by project
- [ ] View artifact details
- [ ] Filter by type (Requirements, API, DB Schema, etc.)
- [ ] Export artifacts

**Backend Routes Needed**:
```javascript
// backend/src/routes/artifacts.routes.js
POST   /api/artifacts           Create artifact
GET    /api/artifacts/:projectId   Get project artifacts
GET    /api/artifacts/:id       Get single artifact
DELETE /api/artifacts/:id       Delete artifact
```

**MongoDB Collection**:
```javascript
artifacts: {
  projectId: ObjectId,
  type: Enum ['requirements', 'architecture', 'api', 'db', 'ui', 'tests', 'deploy'],
  title: String,
  content: String,
  version: Number,
  createdAt: Date
}
```

### 7. Workspace/Project Details Screen 🔄
**Status**: UI exists, needs connection

**What's Needed**:
- [ ] Show project overview
- [ ] Display project stats (tasks, artifacts, messages)
- [ ] Edit project details
- [ ] Delete project
- [ ] View project decisions/context

---

## 📝 TODO (Priority Order)

### PHASE 1: Complete Core Features (Current Sprint)
1. **Make Tasks Screen Fully Functional**
   - Implement backend routes
   - Connect frontend to API
   - Enable drag-to-update (or click-to-update)
   - Add "Create Task" modal

2. **Make Artifacts/Docs Screen Functional**
   - Implement backend routes
   - Auto-save AI deliverables as artifacts
   - Display artifacts in Docs screen
   - Add view/export functionality

3. **Enhance Chat Experience**
   - Add code syntax highlighting
   - Add "Copy Code" button
   - Parse structured AI responses into artifacts
   - Save important decisions to project context

### PHASE 2: Advanced Features
4. **Connect Workspace Screen**
   - Project overview dashboard
   - Quick access to tasks/docs
   - Project settings

5. **AI Enhancements**
   - Streaming responses (WebSockets optional)
   - Context-aware responses (include project details)
   - Generate tasks from AI suggestions
   - Auto-create artifacts from structured responses

6. **Google Authentication**
   - Set up Firebase Auth
   - Update backend to verify Google tokens
   - Migrate existing users (optional)

### PHASE 3: Polish & Deploy
7. **Data Validation**
   - Add joi/zod to backend
   - Validate all inputs
   - Better error messages

8. **Testing**
   - Unit tests (backend)
   - Integration tests (API)
   - E2E tests (critical flows)

9. **Deployment**
   - Backend: Deploy to Heroku/Railway/Render
   - MongoDB: Production cluster
   - Frontend: EAS Build (Expo)
   - CI/CD setup

---

## 🎨 UI/UX DESIGN REQUIREMENTS

### Navigation (Bottom Tabs)
1. **Projects** (Home) ✅
2. **Workspace** (per-project) 🔄
3. **Tasks** (Kanban) 🔄
4. **Profile** (Settings) ✅

### Design System
- [x] Dark theme (current)
- [ ] Light theme (add theme switcher)
- [x] Generous spacing (12-16px padding)
- [x] Rounded corners (16-20px)
- [x] Premium gradients
- [x] Consistent typography
- [ ] Code syntax highlighting

### Chat UI Requirements ✅
- [x] Project name in header
- [x] Mode selector chips
- [x] Quick action pills
- [x] Clear user/AI bubbles
- [ ] Code blocks as cards with language label + copy button

---

## 📊 DATA MODEL (MongoDB Collections)

### Current Collections ✅
```javascript
users: {
  username: String (unique, indexed),
  passwordHash: String,
  createdAt: Date,
  updatedAt: Date
}

projects: {
  ownerId: ObjectId,
  title: String,
  description: String,
  stack: String,
  decisions: [String],
  createdAt: Date,
  updatedAt: Date
}

messages: {
  projectId: ObjectId,
  userId: ObjectId (optional),
  roleMode: Enum ['user', 'Auto', 'PM', 'Architect', ...],
  content: String,
  createdAt: Date
}
```

### To Be Added 🔄
```javascript
tasks: {
  projectId: ObjectId,
  title: String,
  description: String,
  status: Enum ['To do', 'Doing', 'Done'],
  priority: Enum ['Low', 'Medium', 'High'],
  createdAt: Date
}

artifacts: {
  projectId: ObjectId,
  type: Enum ['requirements', 'architecture', 'api', 'db', 'ui', 'tests', 'deploy'],
  title: String,
  content: String,
  version: Number,
  createdAt: Date
}
```

---

## 🚀 IMMEDIATE NEXT STEPS

### Step 1: Complete Tasks Screen (30 min)
1. Update backend `tasks.routes.js` to handle CRUD
2. Update frontend TasksScreen to fetch/create/update tasks
3. Test task creation and status updates

### Step 2: Complete Artifacts/Docs Screen (30 min)
1. Update backend `artifacts.routes.js` to handle CRUD
2. Modify AI service to detect and save artifacts
3. Update DocsScreen to list and view artifacts

### Step 3: Polish Chat Experience (20 min)
1. Add code syntax highlighting library
2. Add copy button to code blocks
3. Test with different AI modes

### Step 4: Connect Workspace Screen (20 min)
1. Fetch project details
2. Show quick stats
3. Add edit/delete functionality

---

## 📦 DEPENDENCIES TO INSTALL

### Frontend
```bash
# Code syntax highlighting
npm install react-native-syntax-highlighter

# Clipboard (for copy code)
npm install @react-native-clipboard/clipboard
```

### Backend
```bash
# Data validation
npm install joi

# (Already installed)
# bcrypt, jsonwebtoken, axios, express, mongoose
```

---

## 🎯 SUCCESS CRITERIA

The app is **COMPLETE** when:
- [ ] User can signup/login
- [ ] User can create/view/search projects
- [ ] User can chat with AI in 8 different modes
- [ ] AI generates useful, structured deliverables
- [ ] User can manage tasks (Kanban board)
- [ ] AI-generated artifacts are saved and viewable
- [ ] Code blocks are highlighted and copyable
- [ ] All screens are connected and functional
- [ ] Error handling is robust
- [ ] App looks premium and works smoothly

---

**Current Progress: 60% Complete** 🎉
**Next Milestone: Tasks + Artifacts = 85% Complete**

Let's finish this! 🚀
