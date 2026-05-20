import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { listOnboardings, updateOnboarding } from '@/services/api';
import { OnboardingStatus } from '@/types/api';
import { format } from 'date-fns';

export const OnboardingList = () => {
  const { onboardings, setOnboardings, candidates, projects, loading, setLoading, updateOnboarding: updateOnboardingStore } = useStore();
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [status, setStatus] = useState<OnboardingStatus>(OnboardingStatus.OnboardingInProgress);

  useEffect(() => {
    const fetchOnboardings = async () => {
      try {
        setLoading('onboardings', true);
        setError(null);
        const data = await listOnboardings();
        setOnboardings(data);
      } catch (err) {
        setError('Failed to load onboarding workflows');
        console.error(err);
      } finally {
        setLoading('onboardings', false);
      }
    };

    fetchOnboardings();
  }, [setOnboardings, setLoading]);

  const handleUpdateProgress = async (onboardingId: string) => {
    if (progress < 0 || progress > 100) {
      alert('Progress must be between 0 and 100');
      return;
    }

    try {
      const updated = await updateOnboarding(onboardingId, {
        progress,
        status,
      });
      updateOnboardingStore(onboardingId, updated);
      setUpdatingId(null);
      setProgress(0);
    } catch (err) {
      console.error('Failed to update onboarding:', err);
      alert('Failed to update onboarding progress');
    }
  };

  const getStatusBadgeClass = (status: OnboardingStatus) => {
    switch (status) {
      case OnboardingStatus.OnboardingInitiated:
        return 'badge-info';
      case OnboardingStatus.OnboardingInProgress:
        return 'badge-warning';
      case OnboardingStatus.OnboardingCompleted:
        return 'badge-success';
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

  if (loading.onboardings) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading onboarding workflows...</div>
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
        <h1 className="text-3xl font-bold text-gray-900">Onboarding Workflows</h1>
        <Link to="/onboarding/initiate" className="btn btn-primary">
          Initiate Onboarding
        </Link>
      </div>

      {onboardings.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-500 mb-4">No onboarding workflows found</p>
          <Link to="/onboarding/initiate" className="btn btn-primary">
            Initiate Your First Onboarding
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {onboardings.map((onboarding) => (
            <div key={onboarding.id} className="card">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {getCandidateName(onboarding.candidateId)}
                    </h3>
                    <span className={`badge ${getStatusBadgeClass(onboarding.status)}`}>
                      {onboarding.status.replace('Onboarding', '')}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Project:</span>{' '}
                      {getProjectName(onboarding.projectId)}
                    </div>
                    <div>
                      <span className="font-medium">Training Program:</span>{' '}
                      {onboarding.trainingProgramName}
                    </div>
                    <div>
                      <span className="font-medium">Expected Completion:</span>{' '}
                      {format(new Date(onboarding.expectedCompletionDate), 'PP')}
                    </div>
                    {onboarding.hrNotificationSent && (
                      <div>
                        <span className="badge badge-success">HR Notified</span>
                      </div>
                    )}
                  </div>
                </div>
                {onboarding.status !== OnboardingStatus.OnboardingCompleted && (
                  <button
                    onClick={() => {
                      setUpdatingId(onboarding.id);
                      setProgress(onboarding.progress || 0);
                      setStatus(onboarding.status);
                    }}
                    className="btn btn-secondary"
                  >
                    Update Progress
                  </button>
                )}
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Progress</span>
                  <span className="text-sm font-bold text-primary-600">
                    {onboarding.progress || 0}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-primary-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${onboarding.progress || 0}%` }}
                  />
                </div>
              </div>

              {updatingId === onboarding.id && (
                <div className="border-t pt-4 mt-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Update Onboarding Progress</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="label">
                        Progress (0-100%) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        className="input"
                        min="0"
                        max="100"
                        value={progress}
                        onChange={(e) => setProgress(parseInt(e.target.value) || 0)}
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        Progress is tracked on a 0-100% scale
                      </p>
                    </div>
                    <div>
                      <label className="label">
                        Status <span className="text-red-500">*</span>
                      </label>
                      <select
                        className="input"
                        value={status}
                        onChange={(e) => setStatus(e.target.value as OnboardingStatus)}
                      >
                        <option value={OnboardingStatus.OnboardingInitiated}>Initiated</option>
                        <option value={OnboardingStatus.OnboardingInProgress}>In Progress</option>
                        <option value={OnboardingStatus.OnboardingCompleted}>Completed</option>
                      </select>
                    </div>
                    {progress === 100 && status !== OnboardingStatus.OnboardingCompleted && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                        <p className="text-sm text-yellow-800">
                          ⚠️ Progress is 100%. Consider marking status as "Completed".
                        </p>
                      </div>
                    )}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdateProgress(onboarding.id)}
                        className="btn btn-primary"
                      >
                        Update Progress
                      </button>
                      <button
                        onClick={() => {
                          setUpdatingId(null);
                          setProgress(0);
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
