import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { createProject } from '@/services/api';
import { ProjectStatus, ProjectRequest } from '@/types/api';

export const ProjectForm = () => {
  const navigate = useNavigate();
  const { addProject } = useStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<ProjectRequest>({
    name: '',
    technologyStack: [],
    status: ProjectStatus.PLANNING,
    startDate: new Date().toISOString().split('T')[0],
    commitments: '',
    managerName: '',
  });

  const [techInput, setTechInput] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError('Project name is required');
      return;
    }

    if (formData.technologyStack.length === 0) {
      setError('At least one technology is required');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const project = await createProject(formData);
      addProject(project);
      navigate('/projects');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  const addTechnology = () => {
    if (techInput.trim() && !formData.technologyStack.includes(techInput.trim())) {
      setFormData({
        ...formData,
        technologyStack: [...formData.technologyStack, techInput.trim()],
      });
      setTechInput('');
    }
  };

  const removeTechnology = (tech: string) => {
    setFormData({
      ...formData,
      technologyStack: formData.technologyStack.filter((t) => t !== tech),
    });
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Create New Project</h1>
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
              Project Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="input"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter project name"
              required
            />
          </div>

          <div>
            <label className="label">
              Technology Stack <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                className="input"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
                placeholder="Add technology (e.g., React, Java)"
              />
              <button
                type="button"
                onClick={addTechnology}
                className="btn btn-secondary"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.technologyStack.map((tech) => (
                <span
                  key={tech}
                  className="badge badge-info flex items-center gap-1"
                >
                  {tech}
                  <button
                    type="button"
                    onClick={() => removeTechnology(tech)}
                    className="ml-1 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="label">
              Status <span className="text-red-500">*</span>
            </label>
            <select
              className="input"
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value as ProjectStatus })
              }
              required
            >
              <option value={ProjectStatus.PLANNING}>Planning</option>
              <option value={ProjectStatus.ACTIVE}>Active</option>
              <option value={ProjectStatus.ON_HOLD}>On Hold</option>
              <option value={ProjectStatus.COMPLETED}>Completed</option>
            </select>
          </div>

          <div>
            <label className="label">
              Start Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              className="input"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="label">Manager Name</label>
            <input
              type="text"
              className="input"
              value={formData.managerName}
              onChange={(e) => setFormData({ ...formData, managerName: e.target.value })}
              placeholder="Enter manager name"
            />
          </div>

          <div>
            <label className="label">
              Commitments <span className="text-red-500">*</span>
            </label>
            <textarea
              className="input"
              rows={4}
              value={formData.commitments}
              onChange={(e) => setFormData({ ...formData, commitments: e.target.value })}
              placeholder="Describe project commitments and deliverables"
              required
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Project'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/projects')}
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
