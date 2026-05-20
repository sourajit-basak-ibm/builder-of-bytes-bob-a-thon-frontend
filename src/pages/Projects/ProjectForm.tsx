import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { createProject } from '@/services/api';
import { ProjectStatus, ProjectRequest } from '@/types/api';

export const ProjectForm = () => {
  const navigate = useNavigate();
  const { addProject, projects } = useStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<ProjectRequest>({
    name: '',
    technologyStack: [],
    status: ProjectStatus.PLANNING,
    startDate: new Date().toISOString().split('T')[0],
    commitments: '',
    managerName: '',
  });

  const [techInput, setTechInput] = useState('');

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    // Project name validation
    if (!formData.name.trim()) {
      errors.name = 'Project name is required';
    } else if (formData.name.trim().length < 3) {
      errors.name = 'Project name must be at least 3 characters';
    } else if (projects.some(p => p.name.toLowerCase() === formData.name.trim().toLowerCase())) {
      errors.name = 'A project with this name already exists';
    }

    // Technology stack validation
    if (formData.technologyStack.length === 0) {
      errors.technologyStack = 'At least one technology is required';
    }

    // Start date validation
    const startDate = new Date(formData.startDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (startDate < today && formData.status === ProjectStatus.PLANNING) {
      errors.startDate = 'Start date cannot be in the past for planning projects';
    }

    // Commitments validation
    if (!formData.commitments.trim()) {
      errors.commitments = 'Project commitments are required';
    } else if (formData.commitments.trim().length < 10) {
      errors.commitments = 'Please provide more detailed commitments (at least 10 characters)';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!validateForm()) {
      setError('Please fix the validation errors below');
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
    const tech = techInput.trim();
    if (!tech) {
      return;
    }
    if (formData.technologyStack.some(t => t.toLowerCase() === tech.toLowerCase())) {
      setFieldErrors({ ...fieldErrors, technologyStack: 'This technology is already added' });
      return;
    }
    setFormData({
      ...formData,
      technologyStack: [...formData.technologyStack, tech],
    });
    setTechInput('');
    setFieldErrors({ ...fieldErrors, technologyStack: '' });
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
              className={`input ${fieldErrors.name ? 'border-red-500' : ''}`}
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                setFieldErrors({ ...fieldErrors, name: '' });
              }}
              placeholder="Enter project name (min 3 characters)"
              required
            />
            {fieldErrors.name && (
              <p className="text-sm text-red-600 mt-1">{fieldErrors.name}</p>
            )}
          </div>

          <div>
            <label className="label">
              Technology Stack <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                className={`input ${fieldErrors.technologyStack ? 'border-red-500' : ''}`}
                value={techInput}
                onChange={(e) => {
                  setTechInput(e.target.value);
                  setFieldErrors({ ...fieldErrors, technologyStack: '' });
                }}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
                placeholder="Add technology (e.g., React, Java, Spring Boot)"
              />
              <button
                type="button"
                onClick={addTechnology}
                className="btn btn-secondary"
              >
                Add
              </button>
            </div>
            {fieldErrors.technologyStack && (
              <p className="text-sm text-red-600 mb-2">{fieldErrors.technologyStack}</p>
            )}
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
            {formData.technologyStack.length === 0 && (
              <p className="text-sm text-gray-500 mt-2">
                Add at least one technology to continue
              </p>
            )}
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
              className={`input ${fieldErrors.startDate ? 'border-red-500' : ''}`}
              value={formData.startDate}
              onChange={(e) => {
                setFormData({ ...formData, startDate: e.target.value });
                setFieldErrors({ ...fieldErrors, startDate: '' });
              }}
              required
            />
            {fieldErrors.startDate && (
              <p className="text-sm text-red-600 mt-1">{fieldErrors.startDate}</p>
            )}
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
              className={`input ${fieldErrors.commitments ? 'border-red-500' : ''}`}
              rows={4}
              value={formData.commitments}
              onChange={(e) => {
                setFormData({ ...formData, commitments: e.target.value });
                setFieldErrors({ ...fieldErrors, commitments: '' });
              }}
              placeholder="Describe project commitments, deliverables, and key objectives (min 10 characters)"
              required
            />
            {fieldErrors.commitments && (
              <p className="text-sm text-red-600 mt-1">{fieldErrors.commitments}</p>
            )}
            <p className="text-sm text-gray-500 mt-1">
              {formData.commitments.length} characters
            </p>
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
