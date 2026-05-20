import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { listProjects } from '@/services/api';
import { ProjectStatus } from '@/types/api';

export const ProjectList = () => {
  const { projects, setProjects, loading, setLoading } = useStore();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading('projects', true);
        setError(null);
        const data = await listProjects();
        setProjects(data);
      } catch (err) {
        setError('Failed to load projects');
        console.error(err);
      } finally {
        setLoading('projects', false);
      }
    };

    fetchProjects();
  }, [setProjects, setLoading]);

  const getStatusBadgeClass = (status: ProjectStatus) => {
    switch (status) {
      case ProjectStatus.ACTIVE:
        return 'badge-success';
      case ProjectStatus.PLANNING:
        return 'badge-info';
      case ProjectStatus.ON_HOLD:
        return 'badge-warning';
      case ProjectStatus.COMPLETED:
        return 'badge-gray';
      default:
        return 'badge-gray';
    }
  };

  if (loading.projects) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading projects...</div>
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
        <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
        <Link to="/projects/new" className="btn btn-primary">
          Create Project
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-500 mb-4">No projects found</p>
          <Link to="/projects/new" className="btn btn-primary">
            Create Your First Project
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <div key={project.id} className="card hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  {project.name}
                </h3>
                <span className={`badge ${getStatusBadgeClass(project.status)}`}>
                  {project.status}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Start Date:</span>{' '}
                  {new Date(project.startDate).toLocaleDateString()}
                </div>
                {project.managerName && (
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Manager:</span> {project.managerName}
                  </div>
                )}
              </div>

              <div className="mb-4">
                <div className="text-sm font-medium text-gray-700 mb-2">
                  Technology Stack:
                </div>
                <div className="flex flex-wrap gap-2">
                  {project.technologyStack.map((tech, index) => (
                    <span
                      key={index}
                      className="badge badge-info"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="text-sm text-gray-600 mb-4">
                <span className="font-medium">Commitments:</span>
                <p className="mt-1">{project.commitments}</p>
              </div>

              <Link
                to={`/projects/${project.id}`}
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                View Details →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Made with Bob
