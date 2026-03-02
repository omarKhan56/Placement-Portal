//frontend/src/components/student/ApplicationTracker.jsx

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Clock, Briefcase, Calendar, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import api from '../../api/axios';

export default function ApplicationTracker() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await api.get('/application/my-applications');
      setApplications(res.data.data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      applied: 'bg-blue-100 text-blue-700 border-blue-200',
      mentor_pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      mentor_approved: 'bg-green-100 text-green-700 border-green-200',
      mentor_rejected: 'bg-red-100 text-red-700 border-red-200',
      shortlisted: 'bg-purple-100 text-purple-700 border-purple-200',
      interview_scheduled: 'bg-indigo-100 text-indigo-700 border-indigo-200',
      selected: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      rejected: 'bg-gray-100 text-gray-700 border-gray-200',
      completed: 'bg-teal-100 text-teal-700 border-teal-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const formatStatus = (status) => {
    return status
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  if (loading) {
    return (
      <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading applications...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Clock className="w-6 h-6 text-blue-600" />
          My Applications
        </CardTitle>
      </CardHeader>
      <CardContent>
        {applications.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
              <Briefcase className="w-10 h-10 text-blue-600" />
            </div>
            <p className="text-gray-600">No applications yet. Start applying to internships!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <div key={app._id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{app.internshipId?.title || 'N/A'}</h3>
                    <p className="text-sm text-gray-600">{app.internshipId?.company || 'N/A'}</p>
                  </div>
                  <Badge className={getStatusColor(app.status)}>
                    {formatStatus(app.status)}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>Applied: {format(new Date(app.appliedAt), 'dd MMM yyyy')}</span>
                  </div>

                  {app.interviewDate && (
                    <div className="flex items-center gap-2 text-indigo-600">
                      <Calendar className="w-4 h-4" />
                      <span>Interview: {format(new Date(app.interviewDate), 'dd MMM yyyy, hh:mm a')}</span>
                    </div>
                  )}

                  {app.interviewLink && (
                    <a 
                      href={app.interviewLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Join Interview</span>
                    </a>
                  )}
                </div>

                {app.mentorComments && (
                  <div className="mt-3 p-2 bg-gray-50 rounded text-sm">
                    <strong>Mentor Comments:</strong> {app.mentorComments}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}