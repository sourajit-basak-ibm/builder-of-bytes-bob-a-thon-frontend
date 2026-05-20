import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { listMeetings, completeMeeting } from '@/services/api';
import { MeetingStatus } from '@/types/api';
import { format } from 'date-fns';

export const MeetingList = () => {
  const { meetings, setMeetings, candidates, projects, loading, setLoading, updateMeeting } = useStore();
  const [error, setError] = useState<string | null>(null);
  const [completingId, setCompletingId] = useState<string | null>(null);
  const [outcome, setOutcome] = useState('');
  const [agreementReached, setAgreementReached] = useState(false);

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        setLoading('meetings', true);
        setError(null);
        const data = await listMeetings();
        setMeetings(data);
      } catch (err) {
        setError('Failed to load meetings');
        console.error(err);
      } finally {
        setLoading('meetings', false);
      }
    };

    fetchMeetings();
  }, [setMeetings, setLoading]);

  const handleCompleteMeeting = async (meetingId: string) => {
    if (!outcome.trim()) {
      alert('Please provide meeting outcome');
      return;
    }

    try {
      const updated = await completeMeeting(meetingId, {
        agreementReached,
        outcome,
      });
      updateMeeting(meetingId, updated);
      setCompletingId(null);
      setOutcome('');
      setAgreementReached(false);
    } catch (err) {
      console.error('Failed to complete meeting:', err);
      alert('Failed to complete meeting');
    }
  };

  const getStatusBadgeClass = (status: MeetingStatus) => {
    switch (status) {
      case MeetingStatus.MeetingScheduled:
        return 'badge-info';
      case MeetingStatus.MeetingCompleted:
        return 'badge-success';
      case MeetingStatus.MeetingCancelled:
        return 'badge-gray';
      default:
        return 'badge-gray';
    }
  };

  const getCandidateName = (candidateId: string) => {
    const candidate = candidates.find(c => c.id === candidateId);
    return candidate?.name || 'Unknown Candidate';
  };

  const getProjectName = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    return project?.name || 'Unknown Project';
  };

  if (loading.meetings) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading meetings...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Face-to-Face Meetings</h1>
        <Link to="/meetings/schedule" className="btn btn-primary">
          Schedule Meeting
        </Link>
      </div>

      {meetings.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-500 mb-4">No meetings scheduled</p>
          <Link to="/meetings/schedule" className="btn btn-primary">
            Schedule Your First Meeting
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {meetings.map((meeting) => (
            <div key={meeting.id} className="card">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {getCandidateName(meeting.candidateId)}
                    </h3>
                    <span className={`badge ${getStatusBadgeClass(meeting.status)}`}>
                      {meeting.status.replace('Meeting', '')}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Project:</span>{' '}
                      {getProjectName(meeting.projectId)}
                    </div>
                    <div>
                      <span className="font-medium">Location:</span> {meeting.location}
                    </div>
                    <div>
                      <span className="font-medium">Scheduled:</span>{' '}
                      {format(new Date(meeting.scheduledAt), 'PPp')}
                    </div>
                  </div>
                </div>
                {meeting.status === MeetingStatus.MeetingScheduled && (
                  <button
                    onClick={() => setCompletingId(meeting.id)}
                    className="btn btn-secondary"
                  >
                    Complete Meeting
                  </button>
                )}
              </div>

              <div className="mb-3">
                <div className="text-sm font-medium text-gray-700 mb-1">Agenda:</div>
                <p className="text-sm text-gray-600">{meeting.agenda}</p>
              </div>

              {meeting.outcome && (
                <div className="border-t pt-3 mt-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="text-sm font-medium text-gray-700">Outcome:</div>
                    {meeting.agreementReached && (
                      <span className="badge badge-success">Agreement Reached</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{meeting.outcome}</p>
                  {meeting.agreementReached && (
                    <div className="mt-3 bg-green-50 border border-green-200 rounded p-3">
                      <p className="text-sm text-green-800">
                        ✓ Meeting successful! Candidate can now proceed to onboarding.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {completingId === meeting.id && (
                <div className="border-t pt-4 mt-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Complete Meeting</h4>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`agreement-${meeting.id}`}
                        checked={agreementReached}
                        onChange={(e) => setAgreementReached(e.target.checked)}
                        className="rounded"
                      />
                      <label htmlFor={`agreement-${meeting.id}`} className="text-sm text-gray-700">
                        Agreement reached (required for onboarding)
                      </label>
                    </div>
                    <div>
                      <label className="label">
                        Meeting Outcome <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        className="input"
                        rows={4}
                        value={outcome}
                        onChange={(e) => setOutcome(e.target.value)}
                        placeholder="Describe the meeting outcome, decisions made, and next steps..."
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleCompleteMeeting(meeting.id)}
                        className="btn btn-primary"
                      >
                        Complete Meeting
                      </button>
                      <button
                        onClick={() => {
                          setCompletingId(null);
                          setOutcome('');
                          setAgreementReached(false);
                        }}
                        className="btn btn-secondary"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Made with Bob
