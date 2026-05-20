import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { listInterviews, completeInterview } from '@/services/api';
import { InterviewStatus, InterviewType } from '@/types/api';
import { format } from 'date-fns';

export const InterviewList = () => {
  const { interviews, setInterviews, candidates, loading, setLoading, updateInterview } = useStore();
  const [error, setError] = useState<string | null>(null);
  const [completingId, setCompletingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState('');
  const [score, setScore] = useState<number>(0);

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        setLoading('interviews', true);
        setError(null);
        const data = await listInterviews();
        setInterviews(data);
      } catch (err) {
        setError('Failed to load interviews');
        console.error(err);
      } finally {
        setLoading('interviews', false);
      }
    };

    fetchInterviews();
  }, [setInterviews, setLoading]);

  const handleCompleteInterview = async (interviewId: string) => {
    if (!feedback.trim()) {
      alert('Please provide feedback');
      return;
    }

    try {
      const updated = await completeInterview(interviewId, {
        feedback,
        overallScore: score,
      });
      updateInterview(interviewId, updated);
      setCompletingId(null);
      setFeedback('');
      setScore(0);
    } catch (err) {
      console.error('Failed to complete interview:', err);
      alert('Failed to complete interview');
    }
  };

  const getStatusBadgeClass = (status: InterviewStatus) => {
    switch (status) {
      case InterviewStatus.InterviewScheduled:
        return 'badge-info';
      case InterviewStatus.InterviewCompleted:
        return 'badge-success';
      case InterviewStatus.InterviewCancelled:
        return 'badge-gray';
      default:
        return 'badge-gray';
    }
  };

  const getTypeBadgeClass = (type: InterviewType) => {
    switch (type) {
      case InterviewType.TECHNICAL:
        return 'badge-info';
      case InterviewType.BEHAVIORAL:
        return 'badge-warning';
      case InterviewType.MANAGERIAL:
        return 'badge-success';
      case InterviewType.HR:
        return 'badge-gray';
      default:
        return 'badge-gray';
    }
  };

  const getCandidateName = (candidateId: string) => {
    const candidate = candidates.find(c => c.id === candidateId);
    return candidate?.name || 'Unknown Candidate';
  };

  if (loading.interviews) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading interviews...</div>
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
        <h1 className="text-3xl font-bold text-gray-900">Interviews</h1>
        <Link to="/interviews/schedule" className="btn btn-primary">
          Schedule Interview
        </Link>
      </div>

      {interviews.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-500 mb-4">No interviews scheduled</p>
          <Link to="/interviews/schedule" className="btn btn-primary">
            Schedule Your First Interview
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {interviews.map((interview) => (
            <div key={interview.id} className="card">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {getCandidateName(interview.candidateId)}
                    </h3>
                    <span className={`badge ${getStatusBadgeClass(interview.status)}`}>
                      {interview.status.replace('Interview', '')}
                    </span>
                    <span className={`badge ${getTypeBadgeClass(interview.interviewType)}`}>
                      {interview.interviewType}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Scheduled:</span>{' '}
                      {format(new Date(interview.scheduledAt), 'PPp')}
                    </div>
                    <div>
                      <span className="font-medium">Duration:</span>{' '}
                      {interview.durationMinutes || 60} minutes
                    </div>
                  </div>
                </div>
                {interview.status === InterviewStatus.InterviewScheduled && (
                  <button
                    onClick={() => setCompletingId(interview.id)}
                    className="btn btn-secondary"
                  >
                    Complete Interview
                  </button>
                )}
              </div>

              <div className="mb-3">
                <div className="text-sm font-medium text-gray-700 mb-1">Panel Members:</div>
                <div className="flex flex-wrap gap-2">
                  {interview.panelMembers.map((member, index) => (
                    <span key={index} className="badge badge-info">
                      {member}
                    </span>
                  ))}
                </div>
              </div>

              {interview.teamsLink && (
                <div className="mb-3">
                  <a
                    href={interview.teamsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                  >
                    Join Teams Meeting →
                  </a>
                </div>
              )}

              {interview.feedback && (
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-sm font-medium text-gray-700">Feedback:</div>
                    {interview.overallScore !== undefined && (
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary-600">
                          {interview.overallScore}
                        </div>
                        <div className="text-xs text-gray-500">Score</div>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{interview.feedback}</p>
                </div>
              )}

              {completingId === interview.id && (
                <div className="border-t pt-4 mt-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Complete Interview</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="label">
                        Feedback <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        className="input"
                        rows={4}
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        placeholder="Provide detailed feedback about the interview..."
                      />
                    </div>
                    <div>
                      <label className="label">Overall Score (0-100)</label>
                      <input
                        type="number"
                        className="input"
                        min="0"
                        max="100"
                        value={score}
                        onChange={(e) => setScore(parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleCompleteInterview(interview.id)}
                        className="btn btn-primary"
                      >
                        Submit Feedback
                      </button>
                      <button
                        onClick={() => {
                          setCompletingId(null);
                          setFeedback('');
                          setScore(0);
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
