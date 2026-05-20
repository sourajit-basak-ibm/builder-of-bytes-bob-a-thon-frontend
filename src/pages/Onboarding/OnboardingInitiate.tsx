import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { initiateOnboarding, listCandidates, listProjects, listMeetings, listInterviews } from '@/services/api';
import { OnboardingInitiateRequest } from '@/types/api';

export const OnboardingInitiate = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addOnboarding, candidates, setCandidates, projects, setProjects, meetings, setMeetings, interviews, setInterviews } = useStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get pre-filled data from navigation state (if coming from meeting with agreement reached)
  const prefilledData = location.state as {
    candidateId?: string;
    projectId?: string;
    meetingId?: string;
  } | null;

  const [formData, setFormData] = useState<OnboardingInitiateRequest>({
    candidateId: prefilledData?.candidateId || '',
    projectId: prefilledData?.projectId || '',
    faceToFaceMeetingId: prefilledData?.meetingId || '',
    trainingProgramName: '',
    expectedCompletionDate: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (candidates.length === 0) {
          const candidatesData = await listCandidates();
          setCandidates(candidatesData);
        }
        if (projects.length === 0) {
          const projectsData = await listProjects();
          setProjects(projectsData);
        }
        if (meetings.length === 0) {
          const meetingsData = await listMeetings();
          setMeetings(meetingsData);
        }
        if (interviews.length === 0) {
          const interviewsData = await listInterviews();
          setInterviews(interviewsData);
        }
      } catch (err) {
        console.error('Failed to load data:', err);
      }
    };
    fetchData();
  }, [candidates, projects, meetings, interviews, setCandidates, setProjects, setMeetings, setInterviews]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.candidateId || !formData.projectId || !formData.faceToFaceMeetingId) {
      setError('Please select candidate, project, and meeting');
      return;
    }

    if (!formData.trainingProgramName.trim() || !formData.expectedCompletionDate) {
      setError('Please fill in all required fields');
      return;
    }

    // Validate that the meeting has agreement reached
    const meeting = meetings.find(m => m.id === formData.faceToFaceMeetingId);
    if (meeting && !meeting.agreementReached) {
      setError('Cannot initiate onboarding: Agreement not reached in the selected meeting');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Find the staffing request ID from the interview
      const meeting = meetings.find(m => m.id === formData.faceToFaceMeetingId);
      if (meeting) {
        // Find interview for this candidate and project
        const interview = interviews.find(
          i => i.candidateId === meeting.candidateId && i.staffingRequestId
        );
        
        if (interview) {
          console.log('Onboarding initiated for staffing request:', interview.staffingRequestId);
          // Note: Backend should handle status update to RequestFulfilled
        }
      }
      
      const onboarding = await initiateOnboarding(formData);
      addOnboarding(onboarding);
      navigate('/onboarding');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to initiate onboarding');
    } finally {
      setLoading(false);
    }
  };

  // Filter completed meetings with agreement reached
  const completedMeetings = meetings.filter(
    m => m.status === 'MeetingCompleted' && m.agreementReached
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Initiate Onboarding</h1>
      </div>

      <div className="card max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded p-4">
            <p className="text-sm text-blue-800">
              <strong>Prerequisites:</strong> Onboarding can only be initiated after a successful 
              face-to-face meeting where agreement was reached. Training programs are auto-created 
              during onboarding.
            </p>
          </div>

          <div>
            <label className="label">
              Candidate <span className="text-red-500">*</span>
            </label>
            <select
              className="input"
              value={formData.candidateId}
              onChange={(e) => setFormData({ ...formData, candidateId: e.target.value })}
              required
            >
              <option value="">Select a candidate</option>
              {candidates.filter(c => c.status === 'CandidateShortlisted' || c.status === 'CandidateHired').map((candidate) => (
                <option key={candidate.id} value={candidate.id}>
                  {candidate.name} ({candidate.email})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">
              Project <span className="text-red-500">*</span>
            </label>
            <select
              className="input"
              value={formData.projectId}
              onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
              required
            >
              <option value="">Select a project</option>
              {projects.filter(p => p.status === 'ACTIVE' || p.status === 'PLANNING').map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name} ({project.status})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">
              Face-to-Face Meeting <span className="text-red-500">*</span>
            </label>
            <select
              className="input"
              value={formData.faceToFaceMeetingId}
              onChange={(e) => setFormData({ ...formData, faceToFaceMeetingId: e.target.value })}
              required
            >
              <option value="">Select a completed meeting</option>
              {completedMeetings.map((meeting) => {
                const candidate = candidates.find(c => c.id === meeting.candidateId);
                return (
                  <option key={meeting.id} value={meeting.id}>
                    {candidate?.name || 'Unknown'} - {new Date(meeting.scheduledAt).toLocaleDateString()}
                  </option>
                );
              })}
            </select>
            {completedMeetings.length === 0 && (
              <p className="text-sm text-red-600 mt-1">
                No completed meetings with agreement found. Please complete a face-to-face meeting first.
              </p>
            )}
          </div>

          <div>
            <label className="label">
              Training Program Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="input"
              value={formData.trainingProgramName}
              onChange={(e) => setFormData({ ...formData, trainingProgramName: e.target.value })}
              placeholder="e.g., Full Stack Development Bootcamp"
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              Training program will be auto-created during onboarding
            </p>
          </div>

          <div>
            <label className="label">
              Expected Completion Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              className="input"
              value={formData.expectedCompletionDate}
              onChange={(e) => setFormData({ ...formData, expectedCompletionDate: e.target.value })}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || completedMeetings.length === 0}
            >
              {loading ? 'Initiating...' : 'Initiate Onboarding'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/onboarding')}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Made with Bob
