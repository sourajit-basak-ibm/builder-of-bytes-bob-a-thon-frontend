import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { listCandidates } from '@/services/api';
import { CandidateStatus, CandidateSource } from '@/types/api';

export const CandidateList = () => {
  const { candidates, setCandidates, loading, setLoading } = useStore();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        setLoading('candidates', true);
        setError(null);
        const data = await listCandidates();
        setCandidates(data);
      } catch (err) {
        setError('Failed to load candidates');
        console.error(err);
      } finally {
        setLoading('candidates', false);
      }
    };

    fetchCandidates();
  }, [setCandidates, setLoading]);

  const getStatusBadgeClass = (status: CandidateStatus) => {
    switch (status) {
      case CandidateStatus.CandidateHired:
        return 'badge-success';
      case CandidateStatus.CandidateShortlisted:
        return 'badge-info';
      case CandidateStatus.CandidateInterviewing:
        return 'badge-warning';
      case CandidateStatus.CandidateRejected:
        return 'badge-danger';
      default:
        return 'badge-gray';
    }
  };

  const getSourceBadgeClass = (source: CandidateSource) => {
    return source === CandidateSource.INTERNAL ? 'badge-success' : 'badge-info';
  };

  if (loading.candidates) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading candidates...</div>
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
        <h1 className="text-3xl font-bold text-gray-900">Candidates</h1>
        <Link to="/candidates/new" className="btn btn-primary">
          Add Candidate
        </Link>
      </div>

      {candidates.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-500 mb-4">No candidates found</p>
          <Link to="/candidates/new" className="btn btn-primary">
            Add Your First Candidate
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {candidates.map((candidate) => (
            <div key={candidate.id} className="card hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {candidate.name}
                    </h3>
                    <span className={`badge ${getSourceBadgeClass(candidate.source)}`}>
                      {candidate.source}
                    </span>
                    <span className={`badge ${getStatusBadgeClass(candidate.status)}`}>
                      {candidate.status.replace('Candidate', '')}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Email:</span> {candidate.email}
                    </div>
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Phone:</span> {candidate.phone}
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="text-sm font-medium text-gray-700 mb-2">Skills:</div>
                    <div className="flex flex-wrap gap-2">
                      {candidate.skills.map((skill) => (
                        <span
                          key={skill.id}
                          className={`badge ${skill.mandatory ? 'badge-danger' : 'badge-info'}`}
                        >
                          {skill.name} ({skill.proficiency})
                          {skill.minimumYearsOfExperience && ` - ${skill.minimumYearsOfExperience}y`}
                        </span>
                      ))}
                    </div>
                  </div>

                  {candidate.resume && (
                    <div className="text-sm text-gray-600 mb-4">
                      <div className="font-medium mb-1">Resume:</div>
                      <div className="bg-gray-50 p-3 rounded">
                        <div className="mb-2">
                          <span className="font-medium">Source:</span> {candidate.resume.sourceName} ({candidate.resume.sourceType})
                        </div>
                        {candidate.resume.totalExperienceYears && (
                          <div className="mb-2">
                            <span className="font-medium">Experience:</span> {candidate.resume.totalExperienceYears} years
                          </div>
                        )}
                        <div className="mb-2">
                          <span className="font-medium">Summary:</span>
                          <p className="mt-1 text-gray-700">{candidate.resume.summary}</p>
                        </div>
                        <a
                          href={candidate.resume.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                        >
                          View Resume →
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Made with Bob
