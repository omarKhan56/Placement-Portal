import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import {
  ArrowLeft,
  Upload,
  Plus,
  X,
  Loader2,
  FileText,
  Eye,
} from 'lucide-react';
import api from '../../api/axios';

export default function StudentProfile() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [profile, setProfile] = useState({
    fullName: '',
    phone: '',
    semester: '',
    cgpa: '',
    skills: [],
    coverLetter: '',
    resumeUrl: '',
    preferences: {
      domains: [],
      locations: [],
      internshipType: '',
    },
  });

  const [newSkill, setNewSkill] = useState('');
  const [newDomain, setNewDomain] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/student/profile');
      const data = res.data.data;

      setProfile({
        fullName: data.fullName || '',
        phone: data.phone || '',
        semester: data.semester || '',
        cgpa: data.cgpa || '',
        skills: data.skills || [],
        coverLetter: data.coverLetter || '',
        resumeUrl: data.resumeUrl || '',
        preferences: data.preferences || {
          domains: [],
          locations: [],
          internshipType: '',
        },
      });
    } catch (error) {
      console.error(error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await api.put('/student/profile', {
        fullName: profile.fullName,
        phone: profile.phone,
        semester: profile.semester,
        cgpa: profile.cgpa,
        coverLetter: profile.coverLetter,
        skills: JSON.stringify(profile.skills),
        preferences: JSON.stringify(profile.preferences),
      });

      toast.success('✅ Profile updated successfully!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload a PDF or DOC file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const res = await api.post('/student/upload-resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setProfile((prev) => ({
        ...prev,
        resumeUrl: res.data.data.resumeUrl,
      }));

      toast.success('✅ Resume uploaded successfully!');
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to upload resume');
    } finally {
      setUploading(false);
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !profile.skills.includes(newSkill.trim())) {
      setProfile({ ...profile, skills: [...profile.skills, newSkill.trim()] });
      setNewSkill('');
    }
  };

  const removeSkill = (skill) => {
    setProfile({
      ...profile,
      skills: profile.skills.filter((s) => s !== skill),
    });
  };

  const addDomain = () => {
    if (
      newDomain.trim() &&
      !profile.preferences.domains.includes(newDomain.trim())
    ) {
      setProfile({
        ...profile,
        preferences: {
          ...profile.preferences,
          domains: [...profile.preferences.domains, newDomain.trim()],
        },
      });
      setNewDomain('');
    }
  };

  const removeDomain = (domain) => {
    setProfile({
      ...profile,
      preferences: {
        ...profile.preferences,
        domains: profile.preferences.domains.filter((d) => d !== domain),
      },
    });
  };

  const addLocation = () => {
    if (
      newLocation.trim() &&
      !profile.preferences.locations.includes(newLocation.trim())
    ) {
      setProfile({
        ...profile,
        preferences: {
          ...profile.preferences,
          locations: [...profile.preferences.locations, newLocation.trim()],
        },
      });
      setNewLocation('');
    }
  };

  const removeLocation = (location) => {
    setProfile({
      ...profile,
      preferences: {
        ...profile.preferences,
        locations: profile.preferences.locations.filter((l) => l !== location),
      },
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto py-8">
        <Card className="shadow-2xl bg-white/80 backdrop-blur-xl border-0">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  My Profile
                </CardTitle>
                <p className="text-gray-600 mt-1">
                  Manage your personal information
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => navigate('/student/dashboard')}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Personal Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Personal Information</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Full Name *</Label>
                    <Input
                      value={profile.fullName}
                      onChange={(e) =>
                        setProfile({ ...profile, fullName: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <Input
                      value={profile.phone}
                      onChange={(e) =>
                        setProfile({ ...profile, phone: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Academic */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Academic Details</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Semester</Label>
                    <Input
                      type="number"
                      value={profile.semester}
                      onChange={(e) =>
                        setProfile({ ...profile, semester: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label>CGPA</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={profile.cgpa}
                      onChange={(e) =>
                        setProfile({ ...profile, cgpa: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>

              {/* ✅ Resume Section (Viewer + Replace) */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Resume</h3>

                {profile.resumeUrl && (
                  <div className="p-4 bg-green-50 border-2 border-green-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex gap-3 items-center">
                        <FileText className="w-6 h-6 text-green-600" />
                        <div>
                          <p className="font-medium text-green-900">
                            Resume Uploaded ✅
                          </p>
                          <p className="text-sm text-green-700">
                            You can replace it anytime
                          </p>
                        </div>
                      </div>
                      <a
                        href={profile.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </a>
                    </div>
                  </div>
                )}

                <div className="border-2 border-dashed rounded-xl p-8 text-center">
                  <Upload className="w-10 h-10 mx-auto mb-3 text-gray-400" />
                  <input
                    type="file"
                    id="resume-upload"
                    className="hidden"
                    accept=".pdf,.doc,.docx"
                    onChange={handleResumeUpload}
                    disabled={uploading}
                  />
                  <label htmlFor="resume-upload">
                    <Button type="button" variant="outline" asChild>
                      <span className="cursor-pointer">
                        {uploading ? 'Uploading...' : 'Upload / Replace Resume'}
                      </span>
                    </Button>
                  </label>
                </div>
              </div>

              {/* Skills */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Skills</h3>
                <div className="flex gap-2">
                  <Input
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Add skill"
                  />
                  <Button type="button" onClick={addSkill}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill) => (
                    <Badge key={skill} className="flex gap-2">
                      {skill}
                      <X
                        className="w-3 h-3 cursor-pointer"
                        onClick={() => removeSkill(skill)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Cover Letter */}
              <div>
                <h3 className="text-lg font-semibold">Cover Letter</h3>
                <textarea
                  rows="5"
                  className="w-full border rounded-md p-2"
                  value={profile.coverLetter}
                  onChange={(e) =>
                    setProfile({ ...profile, coverLetter: e.target.value })
                  }
                />
              </div>

              {/* Preferences */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Internship Preferences</h3>

                <select
                  className="w-full border rounded-md p-2"
                  value={profile.preferences.internshipType}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      preferences: {
                        ...profile.preferences,
                        internshipType: e.target.value,
                      },
                    })
                  }
                >
                  <option value="">Select type</option>
                  <option value="online">Online</option>
                  <option value="offline">Offline</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600"
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Profile'}
              </Button>

            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
