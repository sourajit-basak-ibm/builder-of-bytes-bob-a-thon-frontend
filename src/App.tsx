import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout/Layout';
import { ProjectList } from './pages/Projects/ProjectList';
import { ProjectForm } from './pages/Projects/ProjectForm';
import { CandidateList } from './pages/Candidates/CandidateList';
import { CandidateForm } from './pages/Candidates/CandidateForm';
import { StaffingRequestList } from './pages/StaffingRequests/StaffingRequestList';
import { StaffingRequestForm } from './pages/StaffingRequests/StaffingRequestForm';
import { InterviewList } from './pages/Interviews/InterviewList';
import { InterviewSchedule } from './pages/Interviews/InterviewSchedule';
import { MeetingList } from './pages/Meetings/MeetingList';
import { MeetingSchedule } from './pages/Meetings/MeetingSchedule';
import { OnboardingList } from './pages/Onboarding/OnboardingList';
import { OnboardingInitiate } from './pages/Onboarding/OnboardingInitiate';
import { Dashboard } from './pages/Dashboard';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/projects" element={<ProjectList />} />
          <Route path="/projects/new" element={<ProjectForm />} />
          <Route path="/candidates" element={<CandidateList />} />
          <Route path="/candidates/new" element={<CandidateForm />} />
          <Route path="/staffing-requests" element={<StaffingRequestList />} />
          <Route path="/staffing-requests/new" element={<StaffingRequestForm />} />
          <Route path="/interviews" element={<InterviewList />} />
          <Route path="/interviews/schedule" element={<InterviewSchedule />} />
          <Route path="/meetings" element={<MeetingList />} />
          <Route path="/meetings/schedule" element={<MeetingSchedule />} />
          <Route path="/onboarding" element={<OnboardingList />} />
          <Route path="/onboarding/initiate" element={<OnboardingInitiate />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;

// Made with Bob
