import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { listProjects, listCandidates, listInterviews, listOnboardings } from '@/services/api';

export const Dashboard = () => {
  const { 
    projects, setProjects,
    candidates, setCandidates,
    interviews, setInterviews,
    onboardings, setOnboardings,
    setLoading 
  } = useStore();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading('projects', true);
        setLoading('candidates', true);
        setLoading('interviews', true);
        setLoading('onboardings', true);
        setError(null);

        const [projectsData, candidatesData, interviewsData, onboardingsData] = await Promise.all([
          listProjects(),
          listCandidates(),
          listInterviews(),
          listOnboardings(),
        ]);

        setProjects(projectsData);
        setCandidates(candidatesData);
        setInterviews(interviewsData);
        setOnboardings(onboardingsData);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error(err);
      } finally {
        setLoading('projects', false);
        setLoading('candidates', false);
        setLoading('interviews', false);
        setLoading('onboardings', false);
      }
    };

    fetchData();
  }, [setProjects, setCandidates, setInterviews, setOnboardings, setLoading]);

  const activeProjects = projects.filter(p => p.status === 'ACTIVE').length;
  const activeCandidates = candidates.filter(c => 
    c.status === 'CandidateInterviewing' || c.status === 'CandidateShortlisted'
  ).length;
  const upcomingInterviews = interviews.filter(i => i.status === 'InterviewScheduled').length;
  const activeOnboardings = onboardings.filter(o => 
    o.status === 'OnboardingInitiated' || o.status === 'OnboardingInProgress'
  ).length;

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome to the Candidate Onboarding System</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Link to="/projects" className="card hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Projects</p>
              <p className="text-3xl font-bold text-primary-600">{activeProjects}</p>
            </div>
            <div className="text-primary-600">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">Total: {projects.length}</p>
        </Link>

        <Link to="/candidates" className="card hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Candidates</p>
              <p className="text-3xl font-bold text-green-600">{activeCandidates}</p>
            </div>
            <div className="text-green-600">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">Total: {candidates.length}</p>
        </Link>

        <Link to="/interviews" className="card hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Upcoming Interviews</p>
              <p className="text-3xl font-bold text-yellow-600">{upcomingInterviews}</p>
            </div>
            <div className="text-yellow-600">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">Total: {interviews.length}</p>
        </Link>

        <Link to="/onboarding" className="card hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Onboardings</p>
              <p className="text-3xl font-bold text-blue-600">{activeOnboardings}</p>
            </div>
            <div className="text-blue-600">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">Total: {onboardings.length}</p>
        </Link>
      </div>

      {/* Quick Actions */}
      <div className="card mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/projects/new" className="btn btn-primary text-center">
            Create New Project
          </Link>
          <Link to="/candidates/new" className="btn btn-primary text-center">
            Add Candidate
          </Link>
          <Link to="/staffing-requests/new" className="btn btn-primary text-center">
            Create Staffing Request
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Projects</h2>
          {projects.length === 0 ? (
            <p className="text-gray-500">No projects yet</p>
          ) : (
            <div className="space-y-3">
              {projects.slice(0, 5).map((project) => (
                <Link
                  key={project.id}
                  to={`/projects/${project.id}`}
                  className="block p-3 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900">{project.name}</p>
                      <p className="text-sm text-gray-600">{project.technologyStack.join(', ')}</p>
                    </div>
                    <span className={`badge ${
                      project.status === 'ACTIVE' ? 'badge-success' : 'badge-gray'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Candidates</h2>
          {candidates.length === 0 ? (
            <p className="text-gray-500">No candidates yet</p>
          ) : (
            <div className="space-y-3">
              {candidates.slice(0, 5).map((candidate) => (
                <div
                  key={candidate.id}
                  className="block p-3 bg-gray-50 rounded"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900">{candidate.name}</p>
                      <p className="text-sm text-gray-600">{candidate.email}</p>
                    </div>
                    <span className={`badge ${
                      candidate.source === 'INTERNAL' ? 'badge-success' : 'badge-info'
                    }`}>
                      {candidate.source}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Made with Bob
