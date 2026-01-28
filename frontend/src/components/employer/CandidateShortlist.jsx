import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import api from '../../api/axios';
import { toast } from 'react-toastify';
import LoadingSpinner from '../common/LoadingSpinner';
import {
  Users,
  Search,
  Star,
  CheckCircle,
  XCircle,
  Calendar,
  FileText,
} from 'lucide-react';
import {
  formatDate,
  getStatusColor,
  formatStatus,
} from '../../utils/helpers';

export default function CandidateShortlist() {
  const [candidates, setCandidates] = useState([]);
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchCandidates();
  }, []);

  useEffect(() => {
    filterCandidates();
  }, [searchTerm, filterStatus, candidates]);

  const fetchCandidates = async () => {
    try {
      const res = await api.get('/application');
      setCandidates(res.data?.data || []);
    } catch (error) {
      console.error('Error fetching candidates:', error);
      toast.error('Failed to load candidates');
    } finally {
      setLoading(false);
    }
  };

  const filterCandidates = () => {
    let filtered = [...candidates];

    if (filterStatus !== 'all') {
      filtered = filtered.filter((c) => c.status === filterStatus);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.studentId?.fullName?.toLowerCase().includes(term) ||
          c.internshipId?.title?.toLowerCase().includes(term) ||
          c.studentId?.studentId?.toLowerCase().includes(term)
      );
    }

    setFilteredCandidates(filtered);
  };

  const handleStatusUpdate = async (applicationId, status) => {
    try {
      await api.put(`/application/${applicationId}/status`, { status });
      toast.success(`✅ Candidate ${formatStatus(status)} successfully!`);
      fetchCandidates();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const calculateMatchScore = (candidate) => {
    const requiredSkills = candidate.internshipId?.requiredSkills || [];
    const studentSkills = candidate.studentId?.skills || [];

    if (!requiredSkills.length) return 0;

    const matchCount = requiredSkills.filter((skill) =>
      studentSkills.some(
        (s) => s.toLowerCase() === skill.toLowerCase()
      )
    ).length;

    return Math.round((matchCount / requiredSkills.length) * 100);
  };

  if (loading) return <LoadingSpinner text="Loading candidates..." />;

  return (
    <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl flex items-center gap-2">
            <Users className="w-6 h-6 text-orange-600" />
            Candidate Shortlist
          </CardTitle>
          <Badge variant="secondary" className="text-base px-4 py-2">
            {candidates.length} Candidates
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search candidates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <select
            className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="mentor_approved">Mentor Approved</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="interview_scheduled">Interview Scheduled</option>
            <option value="selected">Selected</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* Candidates */}
        {filteredCandidates.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No candidates found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredCandidates.map((candidate) => {
              const matchScore = calculateMatchScore(candidate);

              return (
                <Card
                  key={candidate._id}
                  className="border hover:shadow-lg transition-shadow"
                >
                  <CardContent className="pt-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                            {candidate.studentId?.fullName
                              ?.charAt(0)
                              ?.toUpperCase()}
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-lg">
                                {candidate.studentId?.fullName}
                              </h3>
                              {matchScore >= 70 && (
                                <Badge className="bg-green-100 text-green-700 border-green-200">
                                  <Star className="w-3 h-3 mr-1" />
                                  {matchScore}% Match
                                </Badge>
                              )}
                            </div>

                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <span>{candidate.studentId?.studentId}</span>
                              <span>•</span>
                              <span>{candidate.studentId?.department}</span>
                              <span>•</span>
                              <span>
                                CGPA: {candidate.studentId?.cgpa || 'N/A'}
                              </span>
                            </div>
                          </div>

                          <Badge className={getStatusColor(candidate.status)}>
                            {formatStatus(candidate.status)}
                          </Badge>
                        </div>

                        {/* Applied Position */}
                        <div className="p-3 bg-blue-50 rounded-lg mb-3">
                          <p className="text-sm text-gray-600 mb-1">
                            Applied for:
                          </p>
                          <p className="font-medium text-blue-900">
                            {candidate.internshipId?.title}
                          </p>
                        </div>

                        {/* Skills */}
                        {candidate.studentId?.skills?.length > 0 && (
                          <div className="mb-3">
                            <p className="text-sm font-medium mb-2">
                              Skills:
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {candidate.studentId.skills
                                .slice(0, 6)
                                .map((skill, idx) => {
                                  const isRequired =
                                    candidate.internshipId?.requiredSkills?.some(
                                      (rs) =>
                                        rs.toLowerCase() ===
                                        skill.toLowerCase()
                                    );

                                  return (
                                    <Badge
                                      key={idx}
                                      variant={isRequired ? 'default' : 'outline'}
                                      className={
                                        isRequired ? 'bg-green-600' : ''
                                      }
                                    >
                                      {skill}
                                    </Badge>
                                  );
                                })}

                              {candidate.studentId.skills.length > 6 && (
                                <Badge variant="outline">
                                  +
                                  {candidate.studentId.skills.length - 6}{' '}
                                  more
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Details */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                          <div>
                            <span className="text-gray-500">Applied:</span>
                            <p className="font-medium">
                              {formatDate(candidate.appliedAt)}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-500">
                              Employability:
                            </span>
                            <p className="font-medium">
                              {candidate.studentId?.employabilityScore || 0}
                              /100
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-500">Phone:</span>
                            <p className="font-medium">
                              {candidate.studentId?.phone || 'N/A'}
                            </p>
                          </div>
                        </div>

                        {/* Interview */}
                        {candidate.status === 'interview_scheduled' &&
                          candidate.interviewDate && (
                            <div className="mt-3 p-3 bg-indigo-50 rounded-lg">
                              <div className="flex items-center gap-2 text-sm">
                                <Calendar className="w-4 h-4 text-indigo-600" />
                                <span className="font-medium text-indigo-900">
                                  Interview:{' '}
                                  {formatDate(
                                    candidate.interviewDate,
                                    true
                                  )}
                                </span>

                                {candidate.interviewLink && (
                                  <a
                                    href={candidate.interviewLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="ml-auto text-indigo-600 hover:text-indigo-700 underline"
                                  >
                                    Join Meeting
                                  </a>
                                )}
                              </div>
                            </div>
                          )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-4 border-t">
                      {candidate.studentId?.resumeUrl && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            window.open(
                              candidate.studentId.resumeUrl,
                              '_blank'
                            )
                          }
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          View Resume
                        </Button>
                      )}

                      {candidate.status === 'mentor_approved' && (
                        <Button
                          size="sm"
                          onClick={() =>
                            handleStatusUpdate(
                              candidate._id,
                              'shortlisted'
                            )
                          }
                          className="bg-purple-600 hover:bg-purple-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Shortlist
                        </Button>
                      )}

                      {(candidate.status === 'shortlisted' ||
                        candidate.status === 'interview_scheduled') && (
                        <>
                          <Button
                            size="sm"
                            onClick={() =>
                              handleStatusUpdate(
                                candidate._id,
                                'selected'
                              )
                            }
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Select
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() =>
                              handleStatusUpdate(
                                candidate._id,
                                'rejected'
                              )
                            }
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Reject
                          </Button>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
