import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { createCandidate } from '@/services/api';
import { CandidateSource, ProficiencyLevel, CandidateCreateRequest, SkillRequest } from '@/types/api';

export const CandidateForm = () => {
  const navigate = useNavigate();
  const { addCandidate, candidates } = useStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

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

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    // Name validation
    if (!formData.name.trim()) {
      errors.name = 'Full name is required';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    } else if (candidates.some(c => c.email.toLowerCase() === formData.email.toLowerCase())) {
      errors.email = 'A candidate with this email already exists';
    }

    // Phone validation
    const phoneRegex = /^[+]?[\d\s-()]+$/;
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!phoneRegex.test(formData.phone) || formData.phone.replace(/\D/g, '').length < 10) {
      errors.phone = 'Please enter a valid phone number (min 10 digits)';
    }

    // Skills validation
    if (formData.skills.length === 0) {
      errors.skills = 'At least one skill is required';
    }

    // Resume validation
    const urlRegex = /^https?:\/\/.+/;
    if (!formData.resume.url.trim()) {
      errors.resumeUrl = 'Resume URL is required';
    } else if (!urlRegex.test(formData.resume.url)) {
      errors.resumeUrl = 'Please enter a valid URL (must start with http:// or https://)';
    }

    if (!formData.resume.summary.trim()) {
      errors.resumeSummary = 'Resume summary is required';
    } else if (formData.resume.summary.trim().length < 20) {
      errors.resumeSummary = 'Please provide a more detailed summary (at least 20 characters)';
    }

    if (!formData.resume.sourceName.trim()) {
      errors.resumeSource = 'Resume source name is required';
    }

    if (!formData.resume.sourceType.trim()) {
      errors.resumeSourceType = 'Resume source type is required';
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
    if (!skillInput.name.trim()) {
      setFieldErrors({ ...fieldErrors, skills: 'Skill name is required' });
      return;
    }
    if (formData.skills.some(s => s.name.toLowerCase() === skillInput.name.trim().toLowerCase())) {
      setFieldErrors({ ...fieldErrors, skills: 'This skill is already added' });
      return;
    }
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
    setFieldErrors({ ...fieldErrors, skills: '' });
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
                  className={`input ${fieldErrors.name ? 'border-red-500' : ''}`}
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    setFieldErrors({ ...fieldErrors, name: '' });
                  }}
                  placeholder="John Doe"
                  required
                />
                {fieldErrors.name && (
                  <p className="text-sm text-red-600 mt-1">{fieldErrors.name}</p>
                )}
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
                  className={`input ${fieldErrors.email ? 'border-red-500' : ''}`}
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    setFieldErrors({ ...fieldErrors, email: '' });
                  }}
                  placeholder="john.doe@example.com"
                  required
                />
                {fieldErrors.email && (
                  <p className="text-sm text-red-600 mt-1">{fieldErrors.email}</p>
                )}
              </div>

              <div>
                <label className="label">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  className={`input ${fieldErrors.phone ? 'border-red-500' : ''}`}
                  value={formData.phone}
                  onChange={(e) => {
                    setFormData({ ...formData, phone: e.target.value });
                    setFieldErrors({ ...fieldErrors, phone: '' });
                  }}
                  placeholder="+1 (234) 567-8900"
                  required
                />
                {fieldErrors.phone && (
                  <p className="text-sm text-red-600 mt-1">{fieldErrors.phone}</p>
                )}
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
                  className={`input ${fieldErrors.skills ? 'border-red-500' : ''}`}
                  value={skillInput.name}
                  onChange={(e) => {
                    setSkillInput({ ...skillInput, name: e.target.value });
                    setFieldErrors({ ...fieldErrors, skills: '' });
                  }}
                  placeholder="e.g., React, Java, Python"
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

            {fieldErrors.skills && (
              <p className="text-sm text-red-600 mb-2">{fieldErrors.skills}</p>
            )}
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
            {formData.skills.length === 0 && (
              <p className="text-sm text-gray-500 mt-2">
                Add at least one skill to continue
              </p>
            )}
          </div>

          {/* Resume */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Resume <span className="text-red-500">*</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Source Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  className={`input ${fieldErrors.resumeSource ? 'border-red-500' : ''}`}
                  value={formData.resume.sourceName}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      resume: { ...formData.resume, sourceName: e.target.value },
                    });
                    setFieldErrors({ ...fieldErrors, resumeSource: '' });
                  }}
                  placeholder="LinkedIn, Indeed, Naukri, etc."
                  required
                />
                {fieldErrors.resumeSource && (
                  <p className="text-sm text-red-600 mt-1">{fieldErrors.resumeSource}</p>
                )}
              </div>

              <div>
                <label className="label">Source Type <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  className={`input ${fieldErrors.resumeSourceType ? 'border-red-500' : ''}`}
                  value={formData.resume.sourceType}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      resume: { ...formData.resume, sourceType: e.target.value },
                    });
                    setFieldErrors({ ...fieldErrors, resumeSourceType: '' });
                  }}
                  placeholder="Job Portal, Referral, Direct Application, etc."
                  required
                />
                {fieldErrors.resumeSourceType && (
                  <p className="text-sm text-red-600 mt-1">{fieldErrors.resumeSourceType}</p>
                )}
              </div>

              <div>
                <label className="label">Resume URL <span className="text-red-500">*</span></label>
                <input
                  type="url"
                  className={`input ${fieldErrors.resumeUrl ? 'border-red-500' : ''}`}
                  value={formData.resume.url}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      resume: { ...formData.resume, url: e.target.value },
                    });
                    setFieldErrors({ ...fieldErrors, resumeUrl: '' });
                  }}
                  placeholder="https://drive.google.com/..."
                  required
                />
                {fieldErrors.resumeUrl && (
                  <p className="text-sm text-red-600 mt-1">{fieldErrors.resumeUrl}</p>
                )}
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
                <label className="label">Summary <span className="text-red-500">*</span></label>
                <textarea
                  className={`input ${fieldErrors.resumeSummary ? 'border-red-500' : ''}`}
                  rows={4}
                  value={formData.resume.summary}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      resume: { ...formData.resume, summary: e.target.value },
                    });
                    setFieldErrors({ ...fieldErrors, resumeSummary: '' });
                  }}
                  placeholder="Brief summary of candidate's background, experience, and key achievements (min 20 characters)"
                  required
                />
                {fieldErrors.resumeSummary && (
                  <p className="text-sm text-red-600 mt-1">{fieldErrors.resumeSummary}</p>
                )}
                <p className="text-sm text-gray-500 mt-1">
                  {formData.resume.summary.length} characters
                </p>
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
