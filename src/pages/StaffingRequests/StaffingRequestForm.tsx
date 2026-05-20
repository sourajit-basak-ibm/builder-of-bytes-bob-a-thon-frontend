import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { createStaffingRequest, listProjects } from '@/services/api';
import { Urgency, ProficiencyLevel, StaffingRequestCreateRequest, SkillRequest } from '@/types/api';

export const StaffingRequestForm = () => {
  const navigate = useNavigate();
  const { addStaffingRequest, projects, setProjects } = useStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<StaffingRequestCreateRequest>({
    projectId: '',
    numberOfPositions: 1,
    urgency: Urgency.MEDIUM,
    skills: [],
  });

  const [skillInput, setSkillInput] = useState<SkillRequest>({
    name: '',
    proficiency: ProficiencyLevel.INTERMEDIATE,
    minimumYearsOfExperience: 0,
    mandatory: false,
  });

  useEffect(() => {
    const fetchProjects = async () => {
      if (projects.length === 0) {
        try {
          const data = await listProjects();
          setProjects(data);
        } catch (err) {
          console.error('Failed to load projects:', err);
        }
      }
    };
    fetchProjects();
  }, [projects, setProjects]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.projectId) {
      setError('Please select a project');
      return;
    }

    if (formData.skills.length === 0) {
      setError('At least one skill is required');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const request = await createStaffingRequest(formData);
      addStaffingRequest(request);
      navigate('/staffing-requests');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create staffing request');
    } finally {
      setLoading(false);
    }
  };

  const addSkill = () => {
    if (skillInput.name.trim()) {
      setFormData({
        ...formData,
        skills: [...formData.skills, { ...skillInput }],
      });
      setSkillInput({
        name: '',
        proficiency: ProficiencyLevel.INTERMEDIATE,
        minimumYearsOfExperience: 0,
        mandatory: false,
      });
    }
  };

  const removeSkill = (index: number) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((_, i) => i !== index),
    });
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Create Staffing Request</h1>
      </div>

      <div className="card max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

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
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name} ({project.status})
                </option>
              ))}
            </select>
            {projects.length === 0 && (
              <p className="text-sm text-gray-500 mt-1">
                No projects available. Please create a project first.
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Number of Positions</label>
              <input
                type="number"
                className="input"
                min="1"
                value={formData.numberOfPositions}
                onChange={(e) =>
                  setFormData({ ...formData, numberOfPositions: parseInt(e.target.value) || 1 })
                }
              />
            </div>

            <div>
              <label className="label">
                Urgency <span className="text-red-500">*</span>
              </label>
              <select
                className="input"
                value={formData.urgency}
                onChange={(e) => setFormData({ ...formData, urgency: e.target.value as Urgency })}
                required
              >
                <option value={Urgency.HIGH}>High</option>
                <option value={Urgency.MEDIUM}>Medium</option>
                <option value={Urgency.LOW}>Low</option>
              </select>
            </div>
          </div>

          <div className="border-t pt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Required Skills <span className="text-red-500">*</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="label">Skill Name</label>
                <input
                  type="text"
                  className="input"
                  value={skillInput.name}
                  onChange={(e) => setSkillInput({ ...skillInput, name: e.target.value })}
                  placeholder="e.g., Java, React"
                />
              </div>

              <div>
                <label className="label">Proficiency</label>
                <select
                  className="input"
                  value={skillInput.proficiency}
                  onChange={(e) =>
                    setSkillInput({ ...skillInput, proficiency: e.target.value as ProficiencyLevel })
                  }
                >
                  <option value={ProficiencyLevel.BEGINNER}>Beginner</option>
                  <option value={ProficiencyLevel.INTERMEDIATE}>Intermediate</option>
                  <option value={ProficiencyLevel.ADVANCED}>Advanced</option>
                  <option value={ProficiencyLevel.EXPERT}>Expert</option>
                </select>
              </div>

              <div>
                <label className="label">Min. Years</label>
                <input
                  type="number"
                  className="input"
                  min="0"
                  value={skillInput.minimumYearsOfExperience}
                  onChange={(e) =>
                    setSkillInput({ ...skillInput, minimumYearsOfExperience: parseInt(e.target.value) || 0 })
                  }
                />
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={addSkill}
                  className="btn btn-secondary w-full"
                >
                  Add Skill
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <input
                type="checkbox"
                id="mandatory"
                checked={skillInput.mandatory}
                onChange={(e) => setSkillInput({ ...skillInput, mandatory: e.target.checked })}
                className="rounded"
              />
              <label htmlFor="mandatory" className="text-sm text-gray-700">
                Mandatory skill (must be present for candidate matching)
              </label>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-4">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> Candidates with match score {'>'} 70 will be auto-considered.
                Mandatory skills must be present for any match.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {formData.skills.map((skill, index) => (
                <span
                  key={index}
                  className={`badge ${skill.mandatory ? 'badge-danger' : 'badge-info'} flex items-center gap-2`}
                >
                  {skill.name} ({skill.proficiency})
                  {skill.minimumYearsOfExperience && skill.minimumYearsOfExperience > 0 && ` - ${skill.minimumYearsOfExperience}y`}
                  {skill.mandatory && ' *'}
                  <button
                    type="button"
                    onClick={() => removeSkill(index)}
                    className="ml-1 hover:text-red-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || projects.length === 0}
            >
              {loading ? 'Creating...' : 'Create Staffing Request'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/staffing-requests')}
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
