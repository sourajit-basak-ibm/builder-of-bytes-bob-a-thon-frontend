import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { scheduleMeeting, listCandidates, listProjects } from '@/services/api';
import { FaceToFaceMeetingRequest } from '@/types/api';

export const MeetingSchedule = () => {
  const navigate = useNavigate();
  const { addMeeting, candidates, setCandidates, projects, setProjects } = useStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<FaceToFaceMeetingRequest>({
    shortListDecisionId: '',
    candidateId: '',
    projectId: '',
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
      } catch (err) {
        console.error('Failed to load data:', err);
      }
    };
    fetchData();
  }, [candidates, projects, setCandidates, setProjects]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.candidateId || !formData.projectId) {
      setError('Please select a candidate and project');
      return;
    }

    if (!formData.scheduledAt || !formData.location.trim() || !formData.agenda.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const meeting = await scheduleMeeting(formData);
      addMeeting(meeting);
      navigate('/meetings');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to schedule meeting');
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
              className="input"
              value={formData.candidateId}
              onChange={(e) => setFormData({ ...formData, candidateId: e.target.value })}
              required
            >
              <option value="">Select a candidate</option>
              {candidates.filter(c => c.status === 'CandidateShortlisted').map((candidate) => (
                <option key={candidate.id} value={candidate.id}>
                  {candidate.name} ({candidate.email})
                </option>
              ))}
            </select>
            <p className="text-sm text-gray-500 mt-1">
              Only shortlisted candidates are shown
            </p>
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
              Shortlist Decision ID <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="input"
              value={formData.shortListDecisionId}
              onChange={(e) => setFormData({ ...formData, shortListDecisionId: e.target.value })}
              placeholder="Enter shortlist decision ID"
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              ID from the shortlist decision that led to this meeting
            </p>
          </div>

          <div>
            <label className="label">
              Location <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="input"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Office address or meeting room"
              required
            />
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
              Agenda <span className="text-red-500">*</span>
            </label>
            <textarea
              className="input"
              rows={4}
              value={formData.agenda}
              onChange={(e) => setFormData({ ...formData, agenda: e.target.value })}
              placeholder="Meeting agenda, topics to discuss, expectations..."
              required
            />
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
