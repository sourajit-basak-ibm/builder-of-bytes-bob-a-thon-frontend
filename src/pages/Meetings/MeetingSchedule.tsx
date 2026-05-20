import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { scheduleMeeting, listCandidates, listProjects, listStaffingRequests, createDecision } from '@/services/api';
import { FaceToFaceMeetingRequest, ShortlistDecisionRequest } from '@/types/api';

export const MeetingSchedule = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addMeeting, candidates, setCandidates, projects, setProjects, staffingRequests, setStaffingRequests } = useStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Get pre-filled data from navigation state (if coming from interview with score >= 80)
  const prefilledData = location.state as {
    candidateId?: string;
    staffingRequestId?: string;
    interviewId?: string;
  } | null;

  // Get project ID from staffing request if available
  const [projectIdFromRequest, setProjectIdFromRequest] = useState<string>('');

  const [formData, setFormData] = useState<FaceToFaceMeetingRequest>({
    shortListDecisionId: prefilledData?.interviewId || '', // Use interview ID as shortlist decision
    candidateId: prefilledData?.candidateId || '',
    projectId: projectIdFromRequest || '',
    location: '',
    scheduledAt: '',
    agenda: '',
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
        if (staffingRequests.length === 0) {
          const requestsData = await listStaffingRequests();
          setStaffingRequests(requestsData);
        }
        
        // If we have a staffing request ID, get the project ID from it
        if (prefilledData?.staffingRequestId && staffingRequests.length > 0) {
          const request = staffingRequests.find(r => r.id === prefilledData.staffingRequestId);
          if (request) {
            setProjectIdFromRequest(request.projectId);
            setFormData(prev => ({ ...prev, projectId: request.projectId }));
          }
        }
      } catch (err) {
        console.error('Failed to load data:', err);
      }
    };

    fetchData();
  }, [candidates, projects, staffingRequests, setCandidates, setProjects, setStaffingRequests, prefilledData]);

  // Update project ID when it's determined from staffing request
  useEffect(() => {
    if (projectIdFromRequest && formData.projectId !== projectIdFromRequest) {
      setFormData(prev => ({ ...prev, projectId: projectIdFromRequest }));
    }
  }, [projectIdFromRequest, formData.projectId]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    // Candidate validation
    if (!formData.candidateId) {
      errors.candidateId = 'Please select a candidate';
    }

    // Project validation
    if (!formData.projectId) {
      errors.projectId = 'Please select a project';
    }

    // Date/time validation
    if (!formData.scheduledAt) {
      errors.scheduledAt = 'Please select a date and time';
    } else {
      const scheduledDate = new Date(formData.scheduledAt);
      const now = new Date();
      if (scheduledDate < now) {
        errors.scheduledAt = 'Meeting cannot be scheduled in the past';
      }
      // Check if it's within business hours (9 AM - 6 PM)
      const hours = scheduledDate.getHours();
      if (hours < 9 || hours >= 18) {
        errors.scheduledAt = 'Please schedule during business hours (9 AM - 6 PM)';
      }
      // Check if it's on a weekday
      const day = scheduledDate.getDay();
      if (day === 0 || day === 6) {
        errors.scheduledAt = 'Face-to-face meetings should be scheduled on weekdays';
      }
    }

    // Location validation
    if (!formData.location.trim()) {
      errors.location = 'Location is required';
    } else if (formData.location.trim().length < 5) {
      errors.location = 'Please provide a more detailed location (at least 5 characters)';
    }

    // Agenda validation
    if (!formData.agenda.trim()) {
      errors.agenda = 'Agenda is required';
    } else if (formData.agenda.trim().length < 20) {
      errors.agenda = 'Please provide a more detailed agenda (at least 20 characters)';
    }

    // Shortlist decision validation (only if not coming from interview)
    if (!prefilledData?.interviewId && !formData.shortListDecisionId.trim()) {
      errors.shortListDecisionId = 'Shortlist decision ID is required';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!validateForm()) {
      setError('Please fix the validation errors below');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      let shortlistDecisionId = '';
      
      // If we have an interview ID from navigation, create a shortlist decision first
      if (prefilledData?.interviewId) {
        console.log('Creating shortlist decision for interview:', prefilledData.interviewId);
        
        const decisionRequest: ShortlistDecisionRequest = {
          interviewId: prefilledData.interviewId,
          candidateId: formData.candidateId,
          status: 'SELECTED',
          reasoning: 'High interview score - proceeding to face-to-face meeting',
          overallScore: 80,
        };
        
        const decision = await createDecision(decisionRequest);
        shortlistDecisionId = decision.id;
        console.log('Shortlist decision created:', shortlistDecisionId);
      } else {
        // Use the manually entered shortlist decision ID
        shortlistDecisionId = formData.shortListDecisionId;
      }
      
      if (!shortlistDecisionId) {
        setError('Shortlist decision ID is required. Please enter a valid decision ID or come from an interview.');
        return;
      }
      
      // Convert datetime-local format to ISO 8601 format
      const scheduledAtISO = new Date(formData.scheduledAt).toISOString();
      
      const requestData: FaceToFaceMeetingRequest = {
        ...formData,
        shortListDecisionId: shortlistDecisionId,
        scheduledAt: scheduledAtISO,
      };
      
      console.log('Scheduling meeting with data:', requestData);
      const meeting = await scheduleMeeting(requestData);
      addMeeting(meeting);
      navigate('/meetings');
    } catch (err: any) {
      console.error('Meeting scheduling error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to schedule meeting');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Schedule Face-to-Face Meeting</h1>
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
              <strong>Note:</strong> Face-to-face meetings are required before initiating onboarding. 
              Agreement must be reached during the meeting to proceed with onboarding.
            </p>
          </div>

          <div>
            <label className="label">
              Candidate <span className="text-red-500">*</span>
            </label>
            <select
              className={`input ${fieldErrors.candidateId ? 'border-red-500' : ''}`}
              value={formData.candidateId}
              onChange={(e) => {
                setFormData({ ...formData, candidateId: e.target.value });
                setFieldErrors({ ...fieldErrors, candidateId: '' });
              }}
              required
            >
              <option value="">Select a candidate</option>
              {candidates
                .filter(c => {
                  // Show the pre-selected candidate or shortlisted candidates
                  return c.id === prefilledData?.candidateId || c.status === 'CandidateShortlisted';
                })
                .map((candidate) => (
                  <option key={candidate.id} value={candidate.id}>
                    {candidate.name} ({candidate.email})
                  </option>
                ))}
            </select>
            {fieldErrors.candidateId && (
              <p className="text-sm text-red-600 mt-1">{fieldErrors.candidateId}</p>
            )}
            <p className="text-sm text-gray-500 mt-1">
              {prefilledData?.candidateId
                ? 'Pre-selected candidate from interview'
                : 'Only shortlisted candidates are shown'}
            </p>
          </div>

          <div>
            <label className="label">
              Project <span className="text-red-500">*</span>
            </label>
            <select
              className={`input ${fieldErrors.projectId ? 'border-red-500' : ''}`}
              value={formData.projectId}
              onChange={(e) => {
                setFormData({ ...formData, projectId: e.target.value });
                setFieldErrors({ ...fieldErrors, projectId: '' });
              }}
              required
            >
              <option value="">Select a project</option>
              {projects.filter(p => p.status === 'ACTIVE' || p.status === 'PLANNING').map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name} ({project.status})
                </option>
              ))}
            </select>
            {fieldErrors.projectId && (
              <p className="text-sm text-red-600 mt-1">{fieldErrors.projectId}</p>
            )}
          </div>

          {!prefilledData?.interviewId && (
            <div>
              <label className="label">
                Shortlist Decision ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className={`input ${fieldErrors.shortListDecisionId ? 'border-red-500' : ''}`}
                value={formData.shortListDecisionId}
                onChange={(e) => {
                  setFormData({ ...formData, shortListDecisionId: e.target.value });
                  setFieldErrors({ ...fieldErrors, shortListDecisionId: '' });
                }}
                placeholder="Enter shortlist decision ID"
                required
              />
              {fieldErrors.shortListDecisionId && (
                <p className="text-sm text-red-600 mt-1">{fieldErrors.shortListDecisionId}</p>
              )}
              <p className="text-sm text-gray-500 mt-1">
                ID from the shortlist decision that led to this meeting
              </p>
            </div>
          )}

          <div>
            <label className="label">
              Location <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className={`input ${fieldErrors.location ? 'border-red-500' : ''}`}
              value={formData.location}
              onChange={(e) => {
                setFormData({ ...formData, location: e.target.value });
                setFieldErrors({ ...fieldErrors, location: '' });
              }}
              placeholder="Office address, building, floor, and meeting room"
              required
            />
            {fieldErrors.location && (
              <p className="text-sm text-red-600 mt-1">{fieldErrors.location}</p>
            )}
          </div>

          <div>
            <label className="label">
              Scheduled Date & Time <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              className={`input ${fieldErrors.scheduledAt ? 'border-red-500' : ''}`}
              value={formData.scheduledAt}
              onChange={(e) => {
                setFormData({ ...formData, scheduledAt: e.target.value });
                setFieldErrors({ ...fieldErrors, scheduledAt: '' });
              }}
              min={new Date().toISOString().slice(0, 16)}
              required
            />
            {fieldErrors.scheduledAt && (
              <p className="text-sm text-red-600 mt-1">{fieldErrors.scheduledAt}</p>
            )}
            <p className="text-sm text-gray-500 mt-1">
              Schedule on weekdays during business hours (9 AM - 6 PM)
            </p>
          </div>

          <div>
            <label className="label">
              Agenda <span className="text-red-500">*</span>
            </label>
            <textarea
              className={`input ${fieldErrors.agenda ? 'border-red-500' : ''}`}
              rows={4}
              value={formData.agenda}
              onChange={(e) => {
                setFormData({ ...formData, agenda: e.target.value });
                setFieldErrors({ ...fieldErrors, agenda: '' });
              }}
              placeholder="Meeting agenda, topics to discuss, expectations, and objectives (min 20 characters)"
              required
            />
            {fieldErrors.agenda && (
              <p className="text-sm text-red-600 mt-1">{fieldErrors.agenda}</p>
            )}
            <p className="text-sm text-gray-500 mt-1">
              {formData.agenda.length} characters
            </p>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Scheduling...' : 'Schedule Meeting'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/meetings')}
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
