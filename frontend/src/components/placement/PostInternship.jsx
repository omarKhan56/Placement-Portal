//frontend/src/components/placement/PostInternship.jsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { ArrowLeft, Plus, X, Loader2 } from 'lucide-react';
import api from '../../api/axios';

export default function PostInternship() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    description: '',
    requiredSkills: [],
    eligibleDepartments: [],
    duration: '',
    stipend: {
      min: '',
      max: '',
    },
    location: '',
    mode: 'offline',
    totalSeats: '',
    placementConversionProbability: '',
    startDate: '',
    applicationDeadline: '',
  });

  const [newSkill, setNewSkill] = useState('');

  const departments = [
    'Computer Science',
    'Information Technology',
    'Electronics',
    'Electrical',
    'Mechanical',
    'Civil',
    'Chemical',
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        ...formData,
        stipend: {
          min: parseFloat(formData.stipend.min) || 0,
          max: parseFloat(formData.stipend.max) || 0,
        },
        duration: parseInt(formData.duration),
        totalSeats: parseInt(formData.totalSeats),
        placementConversionProbability: parseFloat(formData.placementConversionProbability) || 0,
      };

      await api.post('/internship', payload);
      toast.success('✅ Internship posted successfully!');
      navigate('/placement/dashboard');
    } catch (error) {
      console.error('Error posting internship:', error);
      toast.error(error.response?.data?.message || 'Failed to post internship');
    } finally {
      setSaving(false);
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.requiredSkills.includes(newSkill.trim())) {
      setFormData({
        ...formData,
        requiredSkills: [...formData.requiredSkills, newSkill.trim()],
      });
      setNewSkill('');
    }
  };

  const removeSkill = (skill) => {
    setFormData({
      ...formData,
      requiredSkills: formData.requiredSkills.filter((s) => s !== skill),
    });
  };

  const toggleDepartment = (dept) => {
    const depts = formData.eligibleDepartments.includes(dept)
      ? formData.eligibleDepartments.filter((d) => d !== dept)
      : [...formData.eligibleDepartments, dept];
    setFormData({ ...formData, eligibleDepartments: depts });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto py-8">
        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-xl">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Post New Internship
              </CardTitle>
              <Button
                variant="outline"
                onClick={() => navigate('/placement/dashboard')}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Job Title *</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Full Stack Developer Intern"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Company Name *</Label>
                    <Input
                      id="company"
                      placeholder="e.g., TechCorp Solutions"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <textarea
                    id="description"
                    rows="4"
                    className="flex w-full rounded-md border border-input bg-white px-3 py-2 text-sm"
                    placeholder="Describe the internship role, responsibilities, and requirements..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Skills */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Required Skills *</h3>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add skill (e.g., React, Python)"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  />
                  <Button type="button" onClick={addSkill} className="gap-2">
                    <Plus className="w-4 h-4" />
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.requiredSkills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="px-3 py-1 flex items-center gap-2">
                      {skill}
                      <X
                        className="w-3 h-3 cursor-pointer hover:text-red-500"
                        onClick={() => removeSkill(skill)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Eligible Departments */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Eligible Departments *</h3>
                <div className="flex flex-wrap gap-2">
                  {departments.map((dept) => (
                    <Badge
                      key={dept}
                      variant={formData.eligibleDepartments.includes(dept) ? 'default' : 'outline'}
                      className="cursor-pointer px-3 py-2"
                      onClick={() => toggleDepartment(dept)}
                    >
                      {dept}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Internship Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (months) *</Label>
                    <Input
                      id="duration"
                      type="number"
                      min="1"
                      placeholder="6"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stipendMin">Min Stipend (₹)</Label>
                    <Input
                      id="stipendMin"
                      type="number"
                      placeholder="10000"
                      value={formData.stipend.min}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        stipend: { ...formData.stipend, min: e.target.value }
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stipendMax">Max Stipend (₹)</Label>
                    <Input
                      id="stipendMax"
                      type="number"
                      placeholder="25000"
                      value={formData.stipend.max}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        stipend: { ...formData.stipend, max: e.target.value }
                      })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location *</Label>
                    <Input
                      id="location"
                      placeholder="e.g., Bangalore / Remote"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mode">Mode *</Label>
                    <select
                      id="mode"
                      className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm"
                      value={formData.mode}
                      onChange={(e) => setFormData({ ...formData, mode: e.target.value })}
                      required
                    >
                      <option value="online">Online</option>
                      <option value="offline">Offline</option>
                      <option value="hybrid">Hybrid</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="totalSeats">Total Seats *</Label>
                    <Input
                      id="totalSeats"
                      type="number"
                      min="1"
                      placeholder="10"
                      value={formData.totalSeats}
                      onChange={(e) => setFormData({ ...formData, totalSeats: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="conversionProb">Placement Conversion (%)</Label>
                    <Input
                      id="conversionProb"
                      type="number"
                      min="0"
                      max="100"
                      placeholder="70"
                      value={formData.placementConversionProbability}
                      onChange={(e) => setFormData({ ...formData, placementConversionProbability: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="deadline">Application Deadline</Label>
                    <Input
                      id="deadline"
                      type="date"
                      value={formData.applicationDeadline}
                      onChange={(e) => setFormData({ ...formData, applicationDeadline: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-base font-medium"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Posting Internship...
                  </>
                ) : (
                  'Post Internship'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}