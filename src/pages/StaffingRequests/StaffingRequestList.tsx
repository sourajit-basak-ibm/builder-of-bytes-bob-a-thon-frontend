import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { listStaffingRequests, matchCandidates, listProjects } from '@/services/api';
import { StaffingRequestStatus, Urgency } from '@/types/api';
import type { MatchResponse } from '@/types/api';

export const StaffingRequestList = () => {
  const navigate = useNavigate();
  const { staffingRequests, setStaffingRequests, projects, setProjects, onboardings, loading, setLoading } = useStore();
  const [error, setError] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [matches, setMatches] = useState<MatchResponse[]>([]);
  const [loadingMatches, setLoadingMatches] = useState(false);

  // Helper function to check if candidate has active onboarding
  const hasActiveOnboarding = (candidateId: string) => {
    return onboardings.some(
      onboarding =>
        onboarding.candidateId === candidateId &&
        (onboarding.status === 'OnboardingInitiated' || onboarding.status === 'OnboardingInProgress')
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading('staffingRequests', true);
        setError(null);
        
        // Load projects if not already loaded
        if (projects.length === 0) {
          const projectsData = await listProjects();
          setProjects(projectsData);
        }
        
        // Load staffing requests
        const data = await listStaffingRequests();
        setStaffingRequests(data);
      } catch (err) {
        setError('Failed to load staffing requests');
        console.error(err);
      } finally {
        setLoading('staffingRequests', false);
      }
    };

    fetchData();
  }, [setStaffingRequests, setProjects, setLoading, projects.length]);

  const handleMatchCandidates = async (requestId: string) => {
    try {
      setLoadingMatches(true);
      setSelectedRequest(requestId);
      const matchData = await matchCandidates(requestId);
      
      // Filter to show only candidates with:
      // 1. Mandatory skills matched
      // 2. Match score > 0 (exclude non-matching candidates)
      const validMatches = matchData.filter(
        match => match.mandatorySkillsMatched && match.score > 0
      );
      setMatches(validMatches);
    } catch (err) {
      console.error('Failed to match candidates:', err);
      setMatches([]);
    } finally {
      setLoadingMatches(false);
    }
  };

  const getStatusBadgeClass = (status: StaffingRequestStatus) => {
    switch (status) {
      case StaffingRequestStatus.RequestOpen:
        return 'badge-info';
      case StaffingRequestStatus.RequestInProgress:
        return 'badge-warning';
      case StaffingRequestStatus.RequestFulfilled:
        return 'badge-success';
      case StaffingRequestStatus.RequestCancelled:
        return 'badge-gray';
      default:
        return 'badge-gray';
    }
  };

  const getUrgencyBadgeClass = (urgency: Urgency) => {
    switch (urgency) {
      case Urgency.HIGH:
        return 'badge-danger';
      case Urgency.MEDIUM:
        return 'badge-warning';
      case Urgency.LOW:
        return 'badge-info';
      default:
        return 'badge-gray';
    }
  };

  const getProjectName = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    return project?.name || 'Unknown Project';
  };

  if (loading.staffingRequests) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading staffing requests...</div>
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
        <h1 className="text-3xl font-bold text-gray-900">Staffing Requests</h1>
        <Link to="/staffing-requests/new" className="btn btn-primary">
          Create Staffing Request
        </Link>
      </div>

      {staffingRequests.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-500 mb-4">No staffing requests found</p>
          <Link to="/staffing-requests/new" className="btn btn-primary">
            Create Your First Staffing Request
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {staffingRequests.map((request) => (
            <div key={request.id} className="card">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {getProjectName(request.projectId)}
                    </h3>
                    <span className={`badge ${getStatusBadgeClass(request.status)}`}>
                      {request.status.replace('Request', '')}
                    </span>
                    <span className={`badge ${getUrgencyBadgeClass(request.urgency)}`}>
                      {request.urgency} Priority
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Positions: {request.numberOfPositions || 1}
                  </p>
                </div>
                <button
                  onClick={() => handleMatchCandidates(request.id)}
                  className="btn btn-secondary"
                  disabled={loadingMatches && selectedRequest === request.id}
                >
                  {loadingMatches && selectedRequest === request.id
                    ? 'Matching...'
                    : 'Match Candidates'}
                </button>
              </div>

              <div className="mb-4">
                <div className="text-sm font-medium text-gray-700 mb-2">Required Skills:</div>
                <div className="flex flex-wrap gap-2">
                  {request.skills.map((skill) => (
                    <span
                      key={skill.id}
                      className={`badge ${skill.mandatory ? 'badge-danger' : 'badge-info'}`}
                    >
                      {skill.name} ({skill.proficiency})
                      {skill.minimumYearsOfExperience && ` - ${skill.minimumYearsOfExperience}y`}
                      {skill.mandatory && ' *'}
                    </span>
                  ))}
                </div>
              </div>

              {selectedRequest === request.id && matches.length > 0 && (
                <div className="mt-4 border-t pt-4">
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Matched Candidates ({matches.length})
                  </h4>
                  <div className="space-y-2">
                    {matches.map((match) => {
                      const isOnboarded = hasActiveOnboarding(match.candidateId);
                      
                      return (
                        <div
                          key={match.candidateId}
                          className={`flex items-center justify-between p-3 rounded ${
                            isOnboarded ? 'bg-gray-100 opacity-60' : 'bg-gray-50'
                          }`}
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-900">
                                {match.candidateName}
                              </span>
                              {isOnboarded && (
                                <span className="badge badge-success">Already Onboarded</span>
                              )}
                              {!isOnboarded && match.internalPriority && (
                                <span className="badge badge-success">Internal</span>
                              )}
                              {!isOnboarded && match.autoConsidered && (
                                <span className="badge badge-info">Auto-Considered</span>
                              )}
                            </div>
                            <div className="text-sm text-gray-600 mt-1">
                              {isOnboarded
                                ? 'Candidate is already in onboarding process'
                                : `Mandatory Skills: ${match.mandatorySkillsMatched ? '✓ Matched' : '✗ Not Matched'}`
                              }
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <div className="text-2xl font-bold text-primary-600">
                                {match.score}
                              </div>
                              <div className="text-xs text-gray-500">Match Score</div>
                            </div>
                            {!isOnboarded && (
                              <button
                                onClick={() => navigate('/interviews/schedule', {
                                  state: {
                                    candidateId: match.candidateId,
                                    staffingRequestId: request.id
                                  }
                                })}
                                className="btn btn-primary whitespace-nowrap"
                              >
                                Schedule Interview
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {selectedRequest === request.id && matches.length === 0 && !loadingMatches && (
                <div className="mt-4 border-t pt-4 text-center text-gray-500">
                  No matching candidates found
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
