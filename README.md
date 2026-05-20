# Candidate Onboarding System - Frontend

A modern React application for managing the complete candidate hiring and onboarding lifecycle, built with TypeScript, Vite, and Tailwind CSS.

## 📋 Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [Complete Workflow Guide](#complete-workflow-guide)
- [Feature Set](#feature-set)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [API Integration](#api-integration)
- [Business Rules](#business-rules)
- [Development Guide](#development-guide)
- [Troubleshooting](#troubleshooting)

## 🎯 Overview

This application manages the entire candidate lifecycle from project creation to successful onboarding:

1. **Create Projects** → Define technology needs
2. **Add Candidates** → Source internal/external talent
3. **Create Staffing Requests** → Match candidates to projects
4. **Schedule Interviews** → Conduct technical/behavioral assessments
5. **Arrange Meetings** → Face-to-face discussions with shortlisted candidates
6. **Initiate Onboarding** → Track training and integration progress

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have:

- **Node.js 18+** and **npm** installed ([Download here](https://nodejs.org/))
- **Git** for version control
- **Backend repository**: `builder-of-bytes-bob-a-thon-backend`

### Installation Steps

#### Step 1: Setup Backend Service

The frontend requires the backend API to be running. Follow these steps:

1. **Clone the backend repository**:
```bash
# Navigate to your projects directory
cd c:/Sourajit/bob-a-thon/candidate-onboarding/

# Clone the backend repository
git clone <backend-repository-url> builder-of-bytes-bob-a-thon-backend
cd builder-of-bytes-bob-a-thon-backend
```

2. **Setup and start the backend**:
```bash
# Follow the backend's README.md for complete setup instructions
# Typically involves:
npm install          # Install backend dependencies
npm run dev          # Start backend server
```

3. **Verify backend is running**:
   - Backend should start on `http://localhost:8080`
   - Open browser to `http://localhost:8080/api/health` (should return 200 OK)
   - Check backend terminal logs for "Server started on port 8080" or similar message
   - **Keep the backend terminal running** - do not close it

> **Important**: The backend must be running before starting the frontend. Refer to the backend's README.md for detailed setup instructions including database configuration, environment variables, and any other prerequisites.

#### Step 2: Setup Frontend Application

1. **Clone the frontend repository** (if not already done):
```bash
# Navigate to your projects directory (open a new terminal)
cd c:/Sourajit/bob-a-thon/candidate-onboarding/

# Clone this repository
git clone <frontend-repository-url> builder-of-bytes-bob-a-thon-frontend
cd builder-of-bytes-bob-a-thon-frontend
```

2. **Install dependencies**:
```bash
npm install
```

3. **Start the development server**:
```bash
npm run dev
```

4. **Open the application**:
   - Navigate to `http://localhost:3000` in your browser
   - You should see the Dashboard with statistics

### First-Time Setup Verification

After starting the app, verify everything works:

1. ✅ Dashboard loads with statistics (may show 0 if no data)
2. ✅ Navigation menu shows all modules (Projects, Candidates, etc.)
3. ✅ No console errors in browser DevTools (F12)
4. ✅ API calls succeed (check Network tab in DevTools)

## 📖 Complete Workflow Guide

### End-to-End Hiring & Onboarding Process

Follow this step-by-step guide to understand the complete workflow:

#### Step 1: Create a Project
**Purpose**: Define a new project that needs staffing

1. Navigate to **Projects** (`/projects`)
2. Click **"Create New Project"**
3. Fill in the form:
   - **Project Name**: e.g., "E-Commerce Platform Redesign" (must be unique)
   - **Technology Stack**: Add technologies like "React", "Node.js", "PostgreSQL"
   - **Status**: Select "PLANNING" or "ACTIVE"
   - **Start Date**: Choose project start date
   - **Manager**: Enter project manager name
   - **Commitments**: Describe project goals
4. Click **"Create Project"**
5. **Result**: Project appears in the list with status badge

#### Step 2: Add Candidates
**Purpose**: Build a talent pool for staffing

1. Navigate to **Candidates** (`/candidates`)
2. Click **"Add New Candidate"**
3. Fill in candidate details:
   - **Basic Info**: Name, email, phone
   - **Source**: INTERNAL (existing employee) or EXTERNAL (new hire)
   - **Skills**: Add multiple skills with:
     - Skill name (e.g., "React", "TypeScript")
     - Proficiency: BEGINNER, INTERMEDIATE, ADVANCED, or EXPERT
     - Years of experience
     - Mandatory checkbox (for must-have skills)
   - **Resume**: Upload URL, add summary, total experience
4. Click **"Add Candidate"**
5. **Result**: Candidate appears with skills badges and status "SOURCED"

#### Step 3: Create Staffing Request
**Purpose**: Define hiring needs for a project

1. Navigate to **Staffing Requests** (`/staffing-requests`)
2. Click **"Create New Request"**
3. Fill in the form:
   - **Project**: Select from dropdown (e.g., "E-Commerce Platform Redesign")
   - **Number of Positions**: e.g., 2
   - **Urgency**: HIGH, MEDIUM, or LOW
   - **Required Skills**: Add skills needed:
     - Skill name
     - Proficiency level required
     - Mandatory checkbox
4. Click **"Create Request"**
5. **Result**: Request appears with status "OPEN"

#### Step 4: Match Candidates to Request
**Purpose**: Find best-fit candidates using AI-powered matching

1. In **Staffing Requests** list, find your request
2. Click **"Match Candidates"** button
3. **System automatically**:
   - Calculates match score (0-100) for each candidate
   - Validates mandatory skills
   - Prioritizes internal candidates
   - Auto-considers candidates with score > 70
4. **Review results**:
   - See match scores for each candidate
   - Green badge = High match (>70)
   - Yellow badge = Medium match (50-70)
   - Red badge = Low match (<50)
5. **Select candidates** for interviews

#### Step 5: Schedule Interviews
**Purpose**: Conduct technical and behavioral assessments

1. Navigate to **Interviews** (`/interviews`)
2. Click **"Schedule Interview"**
3. Fill in the form:
   - **Candidate**: Select matched candidate
   - **Staffing Request**: Link to the request
   - **Interview Type**: TECHNICAL, BEHAVIORAL, MANAGERIAL, or HR
   - **Date & Time**: Schedule the interview
   - **Panel Members**: Add interviewers (comma-separated)
   - **Duration**: Minutes (e.g., 60)
4. Click **"Schedule Interview"**
5. **Result**: Interview appears with status "SCHEDULED"
6. **Teams link** is auto-generated for virtual interviews

#### Step 6: Complete Interview
**Purpose**: Record interview outcomes

1. After interview is conducted, find it in the list
2. Click **"Complete"** button
3. Enter:
   - **Feedback**: Detailed interview notes
   - **Score**: 0-100 rating
4. Click **"Complete Interview"**
5. **Result**: Status changes to "COMPLETED"
6. **If score is high**: Candidate moves to "SHORTLISTED" status

#### Step 7: Schedule Face-to-Face Meeting
**Purpose**: Final discussion with shortlisted candidates

1. Navigate to **Meetings** (`/meetings`)
2. Click **"Schedule Meeting"**
3. Fill in the form:
   - **Candidate**: Select shortlisted candidate
   - **Project**: Assign to project
   - **Location**: Meeting venue
   - **Date & Time**: Schedule the meeting
   - **Agenda**: Meeting topics
4. Click **"Schedule Meeting"**
5. **Result**: Meeting appears with status "SCHEDULED"

#### Step 8: Complete Meeting
**Purpose**: Record meeting outcome and agreement

1. After meeting is conducted, find it in the list
2. Click **"Complete"** button
3. Enter:
   - **Outcome**: Meeting summary
   - **Agreement Reached**: ✅ Check if candidate accepted offer
4. Click **"Complete Meeting"**
5. **Result**: Status changes to "COMPLETED"
6. **Important**: Agreement must be reached to proceed to onboarding

#### Step 9: Initiate Onboarding
**Purpose**: Start the onboarding process for hired candidates

1. Navigate to **Onboarding** (`/onboarding`)
2. Click **"Initiate Onboarding"**
3. **Prerequisites checked**:
   - ✅ Candidate must have completed face-to-face meeting
   - ✅ Agreement must be reached in the meeting
4. Fill in the form:
   - **Candidate**: Select candidate (only eligible ones shown)
   - **Project**: Assign to project
   - **Meeting**: Link to completed meeting
   - **Training Program**: Enter program name
   - **Expected Completion**: Target date
5. Click **"Initiate Onboarding"**
6. **Result**: Onboarding workflow created with status "INITIATED"

#### Step 10: Track Onboarding Progress
**Purpose**: Monitor training and integration progress

1. In **Onboarding** list, find the workflow
2. View current progress (0-100%)
3. Click **"Update Progress"** to change percentage
4. **Progress milestones**:
   - 0-25%: Initial setup and documentation
   - 26-50%: Training program in progress
   - 51-75%: Hands-on project work
   - 76-99%: Final assessments
   - 100%: Onboarding completed
5. **Result**: Progress bar updates, status changes to "COMPLETED" at 100%

### Dashboard Overview

The **Dashboard** (`/`) provides real-time insights:

- **Active Projects**: Count of ACTIVE and PLANNING projects
- **Active Candidates**: Candidates in INTERVIEWING or SHORTLISTED status
- **Upcoming Interviews**: Scheduled interviews count
- **Active Onboardings**: Onboarding workflows in progress
- **Quick Actions**: Shortcuts to create projects, add candidates, etc.
- **Recent Activity**: Latest projects and candidates

## ✨ Feature Set

### 🎯 Core Modules (All Implemented)

#### 1. **Dashboard** (`/`)
- Real-time statistics cards
- Quick action buttons
- Recent projects and candidates
- System health indicators

#### 2. **Projects Management** (`/projects`)
- ✅ List all projects in responsive grid
- ✅ Create projects with technology stack
- ✅ Status tracking (PLANNING, ACTIVE, ON_HOLD, COMPLETED)
- ✅ Project manager assignment
- ✅ Commitments and deliverables
- ✅ Unique name validation

#### 3. **Candidates Management** (`/candidates`)
- ✅ List candidates with detailed cards
- ✅ Add candidates (INTERNAL/EXTERNAL)
- ✅ Skills management with proficiency levels
- ✅ Resume upload and tracking
- ✅ Status pipeline (Sourced → Screening → Interviewing → Shortlisted → Hired/Rejected)
- ✅ Experience tracking

#### 4. **Staffing Requests** (`/staffing-requests`)
- ✅ Create requests linked to projects
- ✅ Define required skills (mandatory/optional)
- ✅ Set urgency levels (HIGH, MEDIUM, LOW)
- ✅ **AI-Powered Candidate Matching**:
  - Match score calculation (0-100)
  - Mandatory skills validation
  - Internal candidate prioritization
  - Auto-consideration at >70 score
- ✅ Status tracking (Open, In Progress, Fulfilled, Cancelled)

#### 5. **Interviews** (`/interviews`)
- ✅ Schedule interviews with panel members
- ✅ Multiple types (TECHNICAL, BEHAVIORAL, MANAGERIAL, HR)
- ✅ Complete with feedback and scores
- ✅ Teams meeting link generation
- ✅ Duration tracking
- ✅ Status management (Scheduled, Completed, Cancelled)

#### 6. **Face-to-Face Meetings** (`/meetings`)
- ✅ Schedule meetings with shortlisted candidates
- ✅ Location and agenda management
- ✅ Complete with outcome and agreement flag
- ✅ Prerequisites validation for onboarding
- ✅ Status tracking (Scheduled, Completed, Cancelled)

#### 7. **Onboarding Workflows** (`/onboarding`)
- ✅ Initiate onboarding (only after successful meeting)
- ✅ Training program assignment
- ✅ **Progress Tracking (0-100%)**:
  - Visual progress bars
  - Percentage updates
  - Status transitions (Initiated → In Progress → Completed)
- ✅ HR notification tracking
- ✅ Completion validation

### 🎨 UI/UX Features

- ✅ Modern, clean design with Tailwind CSS
- ✅ Fully responsive (mobile, tablet, desktop)
- ✅ Color-coded status badges
- ✅ Progress bars and visual indicators
- ✅ Loading states for all operations
- ✅ Error handling with user-friendly messages
- ✅ Form validation
- ✅ Interactive cards and hover effects
- ✅ Consistent navigation
- ✅ Smooth transitions

### 🔧 Technical Features

- ✅ Full TypeScript type safety
- ✅ Component-based architecture
- ✅ Zustand state management
- ✅ React Router navigation (15 routes)
- ✅ Axios API integration with interceptors
- ✅ date-fns for date formatting
- ✅ Vite proxy for CORS handling
- ✅ Hot Module Replacement (HMR)
- ✅ Error boundaries
- ✅ Loading state management

## 🛠️ Tech Stack

| Category | Technology | Purpose |
|----------|-----------|---------|
| **Framework** | React 18 | UI library with hooks |
| **Language** | TypeScript | Type safety and IntelliSense |
| **Build Tool** | Vite | Fast HMR and optimized builds |
| **Routing** | React Router v6 | Client-side navigation |
| **State Management** | Zustand | Lightweight global state |
| **HTTP Client** | Axios | API calls with interceptors |
| **Styling** | Tailwind CSS | Utility-first CSS framework |
| **Date Handling** | date-fns | Date formatting and manipulation |
| **Linting** | ESLint | Code quality and consistency |

## 📁 Project Structure

```
builder-of-bytes-bob-a-thon-frontend/
├── .bob/                          # Bob-a-thon configuration
│   ├── mcp.json                  # MCP server config
│   ├── openapi-spec.json         # API specification
│   └── rules-code/               # Agent rules
├── public/                        # Static assets
├── src/
│   ├── components/               # Reusable UI components
│   │   └── Layout/
│   │       ├── Header.tsx       # Navigation header
│   │       └── Layout.tsx       # Main layout wrapper
│   ├── pages/                    # Page components (routes)
│   │   ├── Dashboard.tsx        # Main dashboard
│   │   ├── Projects/
│   │   │   ├── ProjectList.tsx  # List all projects
│   │   │   └── ProjectForm.tsx  # Create project form
│   │   ├── Candidates/
│   │   │   ├── CandidateList.tsx    # List all candidates
│   │   │   └── CandidateForm.tsx    # Add candidate form
│   │   ├── StaffingRequests/
│   │   │   ├── StaffingRequestList.tsx  # List requests
│   │   │   └── StaffingRequestForm.tsx  # Create request
│   │   ├── Interviews/
│   │   │   ├── InterviewList.tsx        # List interviews
│   │   │   └── InterviewSchedule.tsx    # Schedule form
│   │   ├── Meetings/
│   │   │   ├── MeetingList.tsx          # List meetings
│   │   │   └── MeetingSchedule.tsx      # Schedule form
│   │   └── Onboarding/
│   │       ├── OnboardingList.tsx       # List workflows
│   │       └── OnboardingInitiate.tsx   # Initiate form
│   ├── services/                 # API service layer
│   │   └── api.ts               # Axios client and endpoints
│   ├── store/                    # State management
│   │   └── useStore.ts          # Zustand store
│   ├── types/                    # TypeScript definitions
│   │   └── api.ts               # API types from OpenAPI
│   ├── App.tsx                   # Main app with routing
│   ├── main.tsx                  # Application entry point
│   └── index.css                 # Global styles + Tailwind
├── index.html                    # HTML entry point
├── package.json                  # Dependencies and scripts
├── tsconfig.json                 # TypeScript configuration
├── vite.config.ts               # Vite configuration + proxy
├── tailwind.config.js           # Tailwind customization
├── postcss.config.js            # PostCSS for Tailwind
└── README.md                     # This file
```

## 🔌 API Integration

### Backend Connection

The application connects to the backend API at `http://localhost:8080/api` using Vite's proxy configuration.

**How it works**:
1. Frontend makes requests to `/api/*` (relative URL)
2. Vite proxy forwards to `http://localhost:8080/api/*`
3. This avoids CORS issues during development

### API Endpoints

| Endpoint | Methods | Purpose |
|----------|---------|---------|
| `/api/projects` | GET, POST, PUT, DELETE | Project management |
| `/api/candidates` | GET, POST, PUT, DELETE | Candidate management |
| `/api/staffing-requests` | GET, POST, PUT | Staffing requests |
| `/api/staffing-requests/{id}/match` | POST | Candidate matching |
| `/api/interviews` | GET, POST, PUT | Interview scheduling |
| `/api/interviews/{id}/complete` | POST | Complete interview |
| `/api/meetings` | GET, POST, PUT | Meeting management |
| `/api/meetings/{id}/complete` | POST | Complete meeting |
| `/api/onboarding` | GET, POST, PUT | Onboarding workflows |
| `/api/onboarding/{id}/progress` | PUT | Update progress |
| `/api/notifications` | GET | System notifications |

### API Client Configuration

Located in `src/services/api.ts`:

```typescript
const apiClient = axios.create({
  baseURL: '/api',  // Uses Vite proxy
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### Error Handling

All API calls include error handling:
- Network errors → User-friendly error messages
- 4xx errors → Validation feedback
- 5xx errors → Server error notifications
- Timeout errors → Retry suggestions

## 📜 Business Rules

The application enforces these critical business rules:

### 1. Match Scoring (0-100 Scale)
- Candidates scored against staffing request requirements
- **Auto-consideration**: Score > 70 automatically considered
- **Mandatory skills**: Must match 100% for any consideration
- **Internal priority**: Internal candidates get +10 bonus points

### 2. Mandatory Skills Validation
- All mandatory skills in request must be present in candidate profile
- Proficiency level must meet or exceed requirement
- Missing mandatory skill = automatic rejection

### 3. Onboarding Progress (0-100%)
- Tracked as percentage from 0 to 100
- Visual progress bars for easy monitoring
- Status auto-updates: 0% = Initiated, 1-99% = In Progress, 100% = Completed

### 4. Project Name Uniqueness
- Project names must be unique across the system
- Backend validates and returns error if duplicate
- Frontend shows validation error to user

### 5. Workflow State Machines

**Project States**:
- PLANNING → ACTIVE → ON_HOLD → ACTIVE → COMPLETED

**Candidate States**:
- SOURCED → SCREENING → INTERVIEWING → SHORTLISTED → HIRED/REJECTED

**Interview States**:
- SCHEDULED → COMPLETED/CANCELLED

**Meeting States**:
- SCHEDULED → COMPLETED/CANCELLED

**Onboarding States**:
- INITIATED → IN_PROGRESS → COMPLETED

### 6. Interview Requirements
- Must have at least one panel member
- Duration must be positive integer
- Candidate must be in INTERVIEWING or SHORTLISTED status

### 7. Meeting Prerequisites
- Only SHORTLISTED candidates can have meetings
- Agreement must be reached for onboarding eligibility
- Meeting must be COMPLETED before onboarding

### 8. Onboarding Prerequisites
- Candidate must have completed face-to-face meeting
- Agreement must be reached in the meeting
- Training program auto-created on initiation
- HR automatically notified

## 💻 Development Guide

### Available Scripts

```bash
# Development
npm run dev          # Start dev server (http://localhost:3000)
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler check
```

### Development Workflow

1. **Start backend first**:
```bash
# Clone the backend repository

git clone https://github.com/sourajit-basak-ibm/builder-of-bytes-bob-a-thon-backend.git

# Start backend server (refer to backend's README.md for exact command)
```

2. **Start frontend** (in a new terminal):
```bash
# Checkout the frontend repository

git clone https://github.com/sourajit-basak-ibm/builder-of-bytes-bob-a-thon-frontend.git

# Start frontend server
npm run dev
```

3. **Make changes**:
   - Edit files in `src/`
   - Hot Module Replacement (HMR) updates instantly
   - Check browser console for errors

4. **Test changes**:
   - Use browser DevTools (F12)
   - Check Network tab for API calls
   - Verify state updates in React DevTools

### Adding New Features

#### 1. Add New Page Component

```typescript
// src/pages/NewFeature/NewFeatureList.tsx
import React, { useEffect } from 'react';
import { useStore } from '../../store/useStore';

export const NewFeatureList: React.FC = () => {
  const { items, fetchItems } = useStore();

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">New Feature</h1>
      {/* Your component JSX */}
    </div>
  );
};
```

#### 2. Add Route

```typescript
// src/App.tsx
import { NewFeatureList } from './pages/NewFeature/NewFeatureList';

// In Routes:
<Route path="/new-feature" element={<NewFeatureList />} />
```

#### 3. Add API Endpoint

```typescript
// src/services/api.ts
export const newFeatureApi = {
  getAll: () => apiClient.get('/new-feature'),
  create: (data: NewFeatureRequest) => 
    apiClient.post('/new-feature', data),
};
```

#### 4. Add State Management

```typescript
// src/store/useStore.ts
interface StoreState {
  newFeatureItems: NewFeature[];
  setNewFeatureItems: (items: NewFeature[]) => void;
}

// In create():
newFeatureItems: [],
setNewFeatureItems: (items) => set({ newFeatureItems: items }),
```

### Environment Configuration

To change the backend URL:

1. **Update API client** (`src/services/api.ts`):
```typescript
const apiClient = axios.create({
  baseURL: '/api',  // Keep as /api for proxy
});
```

2. **Update Vite proxy** (`vite.config.ts`):
```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://your-backend-url:port',
      changeOrigin: true,
    },
  },
},
```

### Code Style Guidelines

1. **TypeScript**: Always use types, avoid `any`
2. **Components**: Functional components with hooks
3. **Naming**: PascalCase for components, camelCase for functions
4. **Imports**: Group by external, internal, relative
5. **CSS**: Use Tailwind utilities, avoid inline styles
6. **State**: Use Zustand for global, useState for local
7. **API calls**: Always handle loading and error states

## 🐛 Troubleshooting

### Common Issues and Solutions

#### 1. "npm: command not found"
**Problem**: Node.js not installed or not in PATH

**Solution**:
- Download and install Node.js from [nodejs.org](https://nodejs.org/)
- Restart terminal after installation
- Verify: `node --version` and `npm --version`

#### 2. "Failed to load dashboard data"
**Problem**: Backend API not running or not accessible

**Solution**:
- Check backend is running: `http://localhost:8080/api/health`
- Verify backend logs for errors
- Check firewall/antivirus blocking port 8080
- Ensure backend started before frontend

#### 3. "CORS Error" in browser console
**Problem**: API requests blocked by CORS policy

**Solution**:
- Verify Vite proxy is configured correctly in `vite.config.ts`
- Ensure API client uses `/api` (relative URL), not `http://localhost:8080/api`
- Restart dev server after config changes

#### 4. "Module not found" errors
**Problem**: Dependencies not installed

**Solution**:
```bash
rm -rf node_modules package-lock.json
npm install
```

#### 5. TypeScript errors after changes
**Problem**: Type definitions out of sync

**Solution**:
```bash
npm run type-check  # Check for errors
# Fix type errors in code
# Restart TypeScript server in VS Code: Ctrl+Shift+P → "TypeScript: Restart TS Server"
```

#### 6. Port 3000 already in use
**Problem**: Another process using port 3000

**Solution**:
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9

# Or use different port
npm run dev -- --port 3001
```

#### 7. Blank page after build
**Problem**: Production build issues

**Solution**:
```bash
npm run build
npm run preview  # Test production build locally
# Check browser console for errors
```

#### 8. Slow performance
**Problem**: Large data sets or memory leaks

**Solution**:
- Check React DevTools Profiler
- Implement pagination for large lists
- Use React.memo for expensive components
- Check for memory leaks in useEffect cleanup

### Debug Mode

Enable detailed logging:

```typescript
// src/services/api.ts
apiClient.interceptors.request.use((config) => {
  console.log('API Request:', config.method?.toUpperCase(), config.url);
  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);
```

### Getting Help

1. **Check browser console** (F12) for errors
2. **Check Network tab** for failed API calls
3. **Check backend logs** for server errors
4. **Review this README** for configuration
5. **Check AGENTS.md** for project-specific rules

## 📝 Additional Resources

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [React Router Tutorial](https://reactrouter.com/en/main/start/tutorial)

## 🤝 Contributing

1. Follow existing code structure and patterns
2. Use TypeScript for all new code
3. Add proper error handling
4. Test with backend API
5. Update this README if adding new features
6. Follow the business rules defined above

## 📄 License

This project is part of the Builder of Bytes Bob-a-thon candidate onboarding system.

---

**Built with ❤️ using React, TypeScript, and Vite**