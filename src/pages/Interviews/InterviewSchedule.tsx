import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { scheduleInterview, listCandidates, listStaffingRequests } from '@/services/api';
import { InterviewType, InterviewScheduleRequest } from '@/types/api';

export const InterviewSchedule = () => {
  const navigate = useNavigate();
  const { addInterview, candidates, setCandidates, staffingRequests, setStaffingRequests } = useStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<InterviewScheduleRequest>({
    candidateId: '',
    staffingRequestId: '',
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.candidateId || !formData.staffingRequestId) {
      setError('Please select a candidate and staffing request');
      return;
    }

    if (!formData.scheduledAt) {
      setError('Please select a date and time');
      return;
    }

    if (formData.panelMembers.length === 0) {
      setError('At least one panel member is required');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const interview = await scheduleInterview(formData);
      addInterview(interview);
      navigate('/interviews');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to schedule interview');
    } finally {
      setLoading(false);
    }
  };

  const addPanelMember = () => {
    if (panelMemberInput.trim() && !formData.panelMembers.includes(panelMemberInput.trim())) {
      setFormData({
        ...formData,
        panelMembers: [...formData.panelMembers, panelMemberInput.trim()],
      });
      setPanelMemberInput('');
    }
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
              className="input"
              value={formData.candidateId}
              onChange={(e) => setFormData({ ...formData, candidateId: e.target.value })}
              required
            >
              <option value="">Select a candidate</option>
              {candidates.map((candidate) => (
                <option key={candidate.id} value={candidate.id}>
                  {candidate.name} ({candidate.email})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">
              Staffing Request <span className="text-red-500">*</span>
            </label>
            <select
              className="input"
              value={formData.staffingRequestId}
              onChange={(e) => setFormData({ ...formData, staffingRequestId: e.target.value })}
              required
            >
              <option value="">Select a staffing request</option>
              {staffingRequests.map((request) => (
                <option key={request.id} value={request.id}>
                  Request #{request.id.substring(0, 8)} - {request.urgency} Priority
                </option>
              ))}
            </select>
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
              <label className="label">Duration (minutes)</label>
              <input
                type="number"
                className="input"
                min="15"
                step="15"
                value={formData.durationMinutes}
                onChange={(e) =>
                  setFormData({ ...formData, durationMinutes: parseInt(e.target.value) || 60 })
                }
              />
            </div>
          </div>

          <div>
            <label className="label">
              Scheduled Date & Time <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              className="input"
              value={formData.scheduledAt}
              onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="label">
              Panel Members <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                className="input"
                value={panelMemberInput}
                onChange={(e) => setPanelMemberInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPanelMember())}
                placeholder="Enter panel member name"
              />
              <button
                type="button"
                onClick={addPanelMember}
                className="btn btn-secondary"
              >
                Add
              </button>
            </div>
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
            <p className="text-sm text-gray-500 mt-2">
              At least one technical expert is required for technical interviews
            </p>
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
