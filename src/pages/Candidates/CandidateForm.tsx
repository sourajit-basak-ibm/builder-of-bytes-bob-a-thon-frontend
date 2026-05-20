import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { createCandidate } from '@/services/api';
import { CandidateSource, ProficiencyLevel, CandidateCreateRequest, SkillRequest } from '@/types/api';

export const CandidateForm = () => {
  const navigate = useNavigate();
  const { addCandidate } = useStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<CandidateCreateRequest>({
    name: '',
    email: '',
    phone: '',
    source: CandidateSource.EXTERNAL,
    skills: [],
    resume: {
      sourceName: '',
      sourceType: '',
      url: '',
      lastUpdated: new Date().toISOString(),
      summary: '',
      totalExperienceYears: 0,
    },
  });

  const [skillInput, setSkillInput] = useState<SkillRequest>({
    name: '',
    proficiency: ProficiencyLevel.INTERMEDIATE,
    minimumYearsOfExperience: 0,
    mandatory: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
      setError('Name, email, and phone are required');
      return;
    }

    if (formData.skills.length === 0) {
      setError('At least one skill is required');
      return;
    }

    if (!formData.resume.url.trim() || !formData.resume.summary.trim()) {
      setError('Resume URL and summary are required');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const candidate = await createCandidate(formData);
      addCandidate(candidate);
      navigate('/candidates');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create candidate');
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
        <h1 className="text-3xl font-bold text-gray-900">Add New Candidate</h1>
      </div>

      <div className="card max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Basic Information */}
          <div className="border-b pb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                  required
                />
              </div>

              <div>
                <label className="label">
                  Source <span className="text-red-500">*</span>
                </label>
                <select
                  className="input"
                  value={formData.source}
                  onChange={(e) =>
                    setFormData({ ...formData, source: e.target.value as CandidateSource })
                  }
                  required
                >
                  <option value={CandidateSource.INTERNAL}>Internal</option>
                  <option value={CandidateSource.EXTERNAL}>External</option>
                </select>
              </div>

              <div>
                <label className="label">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  className="input"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john.doe@example.com"
                  required
                />
              </div>

              <div>
                <label className="label">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  className="input"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1234567890"
                  required
                />
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="border-b pb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Skills <span className="text-red-500">*</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="label">Skill Name</label>
                <input
                  type="text"
                  className="input"
                  value={skillInput.name}
                  onChange={(e) => setSkillInput({ ...skillInput, name: e.target.value })}
                  placeholder="e.g., React"
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
                <label className="label">Years of Experience</label>
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
                Mandatory skill
              </label>
            </div>

            <div className="flex flex-wrap gap-2">
              {formData.skills.map((skill, index) => (
                <span
                  key={index}
                  className={`badge ${skill.mandatory ? 'badge-danger' : 'badge-info'} flex items-center gap-2`}
                >
                  {skill.name} ({skill.proficiency})
                  {skill.minimumYearsOfExperience && skill.minimumYearsOfExperience > 0 && ` - ${skill.minimumYearsOfExperience}y`}
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

          {/* Resume */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Resume <span className="text-red-500">*</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Source Name</label>
                <input
                  type="text"
                  className="input"
                  value={formData.resume.sourceName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      resume: { ...formData.resume, sourceName: e.target.value },
                    })
                  }
                  placeholder="LinkedIn, Indeed, etc."
                  required
                />
              </div>

              <div>
                <label className="label">Source Type</label>
                <input
                  type="text"
                  className="input"
                  value={formData.resume.sourceType}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      resume: { ...formData.resume, sourceType: e.target.value },
                    })
                  }
                  placeholder="Job Portal, Referral, etc."
                  required
                />
              </div>

              <div>
                <label className="label">Resume URL</label>
                <input
                  type="url"
                  className="input"
                  value={formData.resume.url}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      resume: { ...formData.resume, url: e.target.value },
                    })
                  }
                  placeholder="https://..."
                  required
                />
              </div>

              <div>
                <label className="label">Total Experience (Years)</label>
                <input
                  type="number"
                  className="input"
                  min="0"
                  value={formData.resume.totalExperienceYears}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      resume: { ...formData.resume, totalExperienceYears: parseInt(e.target.value) || 0 },
                    })
                  }
                />
              </div>

              <div className="md:col-span-2">
                <label className="label">Summary</label>
                <textarea
                  className="input"
                  rows={4}
                  value={formData.resume.summary}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      resume: { ...formData.resume, summary: e.target.value },
                    })
                  }
                  placeholder="Brief summary of candidate's background and experience"
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add Candidate'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/candidates')}
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
