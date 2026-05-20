import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { scheduleInterview, listCandidates, listStaffingRequests } from '@/services/api';
import { InterviewType, InterviewScheduleRequest } from '@/types/api';

export const InterviewSchedule = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addInterview, candidates, setCandidates, staffingRequests, setStaffingRequests } = useStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Get pre-filled data from navigation state (if coming from staffing request match)
  const prefilledData = location.state as { candidateId?: string; staffingRequestId?: string } | null;

  const [formData, setFormData] = useState<InterviewScheduleRequest>({
    candidateId: prefilledData?.candidateId || '',
    staffingRequestId: prefilledData?.staffingRequestId || '',
    scheduledAt: '',
    interviewType: InterviewType.TECHNICAL,
    panelMembers: [],
    durationMinutes: 60,
  });

  const [panelMemberInput, setPanelMemberInput] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (candidates.length === 0) {
          const candidatesData = await listCandidates();
          setCandidates(candidatesData);
        }
        if (staffingRequests.length === 0) {
          const requestsData = await listStaffingRequests();
          setStaffingRequests(requestsData);
        }
      } catch (err) {
        console.error('Failed to load data:', err);
      }
    };
    fetchData();
  }, [candidates, staffingRequests, setCandidates, setStaffingRequests]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    // Candidate validation
    if (!formData.candidateId) {
      errors.candidateId = 'Please select a candidate';
    }

    // Staffing request validation
    if (!formData.staffingRequestId) {
      errors.staffingRequestId = 'Please select a staffing request';
    }

    // Date/time validation
    if (!formData.scheduledAt) {
      errors.scheduledAt = 'Please select a date and time';
    } else {
      const scheduledDate = new Date(formData.scheduledAt);
      const now = new Date();
      if (scheduledDate < now) {
        errors.scheduledAt = 'Interview cannot be scheduled in the past';
      }
      // Check if it's within business hours (9 AM - 6 PM)
      const hours = scheduledDate.getHours();
      if (hours < 9 || hours >= 18) {
        errors.scheduledAt = 'Please schedule during business hours (9 AM - 6 PM)';
      }
    }

    // Duration validation
    if (!formData.durationMinutes || formData.durationMinutes < 15) {
      errors.durationMinutes = 'Duration must be at least 15 minutes';
    } else if (formData.durationMinutes > 240) {
      errors.durationMinutes = 'Duration cannot exceed 4 hours (240 minutes)';
    }

    // Panel members validation
    if (formData.panelMembers.length === 0) {
      errors.panelMembers = 'At least one panel member is required';
    } else if (formData.interviewType === InterviewType.TECHNICAL && formData.panelMembers.length < 2) {
      errors.panelMembers = 'Technical interviews require at least 2 panel members';
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
      
      // Convert datetime-local format to ISO 8601 format
      const scheduledAtISO = new Date(formData.scheduledAt).toISOString();
      
      const requestData: InterviewScheduleRequest = {
        ...formData,
        scheduledAt: scheduledAtISO,
      };
      
      const interview = await scheduleInterview(requestData);
      addInterview(interview);
      navigate('/interviews');
    } catch (err: any) {
      console.error('Interview scheduling error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to schedule interview');
    } finally {
      setLoading(false);
    }
  };

  const addPanelMember = () => {
    const member = panelMemberInput.trim();
    if (!member) {
      setFieldErrors({ ...fieldErrors, panelMembers: 'Panel member name is required' });
      return;
    }
    if (formData.panelMembers.some(m => m.toLowerCase() === member.toLowerCase())) {
      setFieldErrors({ ...fieldErrors, panelMembers: 'This panel member is already added' });
      return;
    }
    setFormData({
      ...formData,
      panelMembers: [...formData.panelMembers, member],
    });
    setPanelMemberInput('');
    setFieldErrors({ ...fieldErrors, panelMembers: '' });
  };

  const removePanelMember = (member: string) => {
    setFormData({
      ...formData,
      panelMembers: formData.panelMembers.filter((m) => m !== member),
    });
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Schedule Interview</h1>
      </div>

      <div className="card max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

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
              {candidates.filter(c => c.status !== 'CandidateRejected').map((candidate) => (
                <option key={candidate.id} value={candidate.id}>
                  {candidate.name} ({candidate.email}) - {candidate.status}
                </option>
              ))}
            </select>
            {fieldErrors.candidateId && (
              <p className="text-sm text-red-600 mt-1">{fieldErrors.candidateId}</p>
            )}
          </div>

          <div>
            <label className="label">
              Staffing Request <span className="text-red-500">*</span>
            </label>
            <select
              className={`input ${fieldErrors.staffingRequestId ? 'border-red-500' : ''}`}
              value={formData.staffingRequestId}
              onChange={(e) => {
                setFormData({ ...formData, staffingRequestId: e.target.value });
                setFieldErrors({ ...fieldErrors, staffingRequestId: '' });
              }}
              required
            >
              <option value="">Select a staffing request</option>
              {staffingRequests.filter(r => r.status === 'RequestOpen' || r.status === 'RequestInProgress').map((request) => (
                <option key={request.id} value={request.id}>
                  Request #{request.id.substring(0, 8)} - {request.urgency} Priority ({request.status})
                </option>
              ))}
            </select>
            {fieldErrors.staffingRequestId && (
              <p className="text-sm text-red-600 mt-1">{fieldErrors.staffingRequestId}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">
                Interview Type <span className="text-red-500">*</span>
              </label>
              <select
                className="input"
                value={formData.interviewType}
                onChange={(e) =>
                  setFormData({ ...formData, interviewType: e.target.value as InterviewType })
                }
                required
              >
                <option value={InterviewType.TECHNICAL}>Technical</option>
                <option value={InterviewType.BEHAVIORAL}>Behavioral</option>
                <option value={InterviewType.MANAGERIAL}>Managerial</option>
                <option value={InterviewType.HR}>HR</option>
              </select>
            </div>

            <div>
              <label className="label">
                Duration (minutes) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                className={`input ${fieldErrors.durationMinutes ? 'border-red-500' : ''}`}
                min="15"
                max="240"
                step="15"
                value={formData.durationMinutes}
                onChange={(e) => {
                  setFormData({ ...formData, durationMinutes: parseInt(e.target.value) || 60 });
                  setFieldErrors({ ...fieldErrors, durationMinutes: '' });
                }}
              />
              {fieldErrors.durationMinutes && (
                <p className="text-sm text-red-600 mt-1">{fieldErrors.durationMinutes}</p>
              )}
              <p className="text-sm text-gray-500 mt-1">
                15-240 minutes (in 15-minute increments)
              </p>
            </div>
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
              Schedule during business hours (9 AM - 6 PM)
            </p>
          </div>

          <div>
            <label className="label">
              Panel Members <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                className={`input ${fieldErrors.panelMembers ? 'border-red-500' : ''}`}
                value={panelMemberInput}
                onChange={(e) => {
                  setPanelMemberInput(e.target.value);
                  setFieldErrors({ ...fieldErrors, panelMembers: '' });
                }}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPanelMember())}
                placeholder="Enter panel member name (e.g., John Doe - Tech Lead)"
              />
              <button
                type="button"
                onClick={addPanelMember}
                className="btn btn-secondary"
              >
                Add
              </button>
            </div>
            {fieldErrors.panelMembers && (
              <p className="text-sm text-red-600 mb-2">{fieldErrors.panelMembers}</p>
            )}
            <div className="flex flex-wrap gap-2">
              {formData.panelMembers.map((member) => (
                <span
                  key={member}
                  className="badge badge-info flex items-center gap-1"
                >
                  {member}
                  <button
                    type="button"
                    onClick={() => removePanelMember(member)}
                    className="ml-1 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            {formData.panelMembers.length === 0 && (
              <p className="text-sm text-gray-500 mt-2">
                Add at least one panel member to continue
              </p>
            )}
            {formData.interviewType === InterviewType.TECHNICAL && formData.panelMembers.length === 1 && (
              <p className="text-sm text-orange-600 mt-2">
                ⚠️ Technical interviews should have at least 2 panel members
              </p>
            )}
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Scheduling...' : 'Schedule Interview'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/interviews')}
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
