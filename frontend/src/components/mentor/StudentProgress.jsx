//frontend/src/components/mentor/StudentProgress.jsx

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import api from '../../api/axios';
import LoadingSpinner from '../common/LoadingSpinner';
import { Users, TrendingUp, Award, Search } from 'lucide-react';
import { Input } from '../ui/input';
import { formatDate, getStatusColor, formatStatus } from '../../utils/helpers';

export default function StudentProgress() {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchStudentProgress();
  }, []);

  useEffect(() => {
    filterStudents();
  }, [searchTerm, students]);

  const fetchStudentProgress = async () => {
    try {
      // Fetch all applications with student details
      const res = await api.get('/application');
      const apps = res.data.data || [];
      
      // Group by student
      const studentMap = {};
      apps.forEach((app) => {
        const studentId = app.studentId?._id;
        if (!studentId) return;
        
        if (!studentMap[studentId]) {
          studentMap[studentId] = {
            ...app.studentId,
            applications: [],
            stats: {
              total: 0,
              approved: 0,
              shortlisted: 0,
              selected: 0,
              rejected: 0,
            },
          };
        }
        
        studentMap[studentId].applications.push(app);
        studentMap[studentId].stats.total++;
        
        if (app.status === 'mentor_approved') studentMap[studentId].stats.approved++;
        if (app.status === 'shortlisted') studentMap[studentId].stats.shortlisted++;
        if (app.status === 'selected') studentMap[studentId].stats.selected++;
        if (app.status === 'rejected' || app.status === 'mentor_rejected') {
          studentMap[studentId].stats.rejected++;
        }
      });
      
      const studentList = Object.values(studentMap);
      setStudents(studentList);
      setFilteredStudents(studentList);
    } catch (error) {
      console.error('Error fetching student progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterStudents = () => {
    if (!searchTerm) {
      setFilteredStudents(students);
      return;
    }
    
    const filtered = students.filter((student) =>
      student.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.department?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStudents(filtered);
  };

  if (loading) return <LoadingSpinner text="Loading student progress..." />;

  return (
    <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" />
            Student Progress Tracking
          </CardTitle>
          <Badge variant="secondary" className="text-base px-4 py-2">
            {students.length} Students
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search by name, ID, or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Students List */}
        {filteredStudents.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">
              {searchTerm ? 'No students found matching your search' : 'No student data available'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredStudents.map((student) => (
              <Card key={student._id} className="border hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {student.fullName?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{student.fullName}</h3>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span>{student.studentId}</span>
                            <span>•</span>
                            <span>{student.department}</span>
                          </div>
                        </div>
                      </div>

                      {/* Academic Info */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                        <div className="bg-gray-50 p-2 rounded">
                          <p className="text-xs text-gray-500">CGPA</p>
                          <p className="font-semibold">{student.cgpa || 'N/A'}</p>
                        </div>
                        <div className="bg-gray-50 p-2 rounded">
                          <p className="text-xs text-gray-500">Semester</p>
                          <p className="font-semibold">{student.semester || 'N/A'}</p>
                        </div>
                        <div className="bg-gray-50 p-2 rounded">
                          <p className="text-xs text-gray-500">Employability</p>
                          <p className="font-semibold">{student.employabilityScore || 0}/100</p>
                        </div>
                        <div className="bg-gray-50 p-2 rounded">
                          <p className="text-xs text-gray-500">Skills</p>
                          <p className="font-semibold">{student.skills?.length || 0}</p>
                        </div>
                      </div>

                      {/* Application Stats */}
                      <div className="grid grid-cols-5 gap-2 mb-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-blue-600">{student.stats.total}</p>
                          <p className="text-xs text-gray-600">Applied</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-green-600">{student.stats.approved}</p>
                          <p className="text-xs text-gray-600">Approved</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-purple-600">{student.stats.shortlisted}</p>
                          <p className="text-xs text-gray-600">Shortlisted</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-emerald-600">{student.stats.selected}</p>
                          <p className="text-xs text-gray-600">Selected</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-red-600">{student.stats.rejected}</p>
                          <p className="text-xs text-gray-600">Rejected</p>
                        </div>
                      </div>

                      {/* Recent Applications */}
                      <div>
                        <p className="text-sm font-medium mb-2">Recent Applications:</p>
                        <div className="space-y-2">
                          {student.applications.slice(0, 3).map((app) => (
                            <div key={app._id} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                              <span className="truncate flex-1">{app.internshipId?.title}</span>
                              <Badge className={getStatusColor(app.status)}>
                                {formatStatus(app.status)}
                              </Badge>
                            </div>
                          ))}
                          {student.applications.length > 3 && (
                            <p className="text-xs text-gray-500 text-center">
                              +{student.applications.length - 3} more applications
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-4 border-t">
                    {student.resumeUrl && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(student.resumeUrl, '_blank')}
                      >
                        View Resume
                      </Button>
                    )}
                    <Button variant="outline" size="sm">
                      View Full Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}