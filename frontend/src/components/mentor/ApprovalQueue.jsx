import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import api from '../../api/axios';
import { toast } from 'react-toastify';
import LoadingSpinner from '../common/LoadingSpinner';
import { CheckCircle, XCircle, User, Briefcase } from 'lucide-react';
import { formatDate } from '../../utils/helpers';

export default function ApprovalQueue() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingApplications();
  }, []);

  const fetchPendingApplications = async () => {
    try {
      const res = await api.get('/application?status=mentor_pending');
      setApplications(res.data?.data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (applicationId, action, comments = '') => {
    try {
      await api.put(`/application/${applicationId}/mentor-action`, {
        action,
        comments,
      });
      toast.success(`✅ Application ${action}d successfully!`);
      fetchPendingApplications();
    } catch (error) {
      toast.error(`Failed to ${action} application`);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl">
          Pending Approvals ({applications.length})
        </CardTitle>
      </CardHeader>

      <CardContent>
        {applications.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <p className="text-gray-600">
              All caught up! No pending approvals.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <div
                key={app._id}
                className="p-4 border rounded-lg bg-white hover:shadow-md transition-shadow"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <h3 className="font-semibold text-lg">
                        {app.studentId?.fullName || 'Unknown Student'}
                      </h3>
                      {app.studentId?.studentId && (
                        <Badge variant="outline">
                          {app.studentId.studentId}
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <Briefcase className="w-4 h-4" />
                      <span>{app.internshipId?.title}</span>
                      <span>at</span>
                      <span className="font-medium">
                        {app.internshipId?.company}
                      </span>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mt-3">
                      <div>
                        <span className="text-gray-500">Department:</span>
                        <p className="font-medium">
                          {app.studentId?.department || 'N/A'}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500">CGPA:</span>
                        <p className="font-medium">
                          {app.studentId?.cgpa || 'N/A'}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500">Semester:</span>
                        <p className="font-medium">
                          {app.studentId?.semester || 'N/A'}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500">Applied:</span>
                        <p className="font-medium">
                          {formatDate(app.appliedAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Skills */}
                {app.studentId?.skills?.length > 0 && (
                  <div className="mb-3">
                    <p className="text-sm text-gray-600">
                      <strong>Skills:</strong>{' '}
                      {app.studentId.skills.slice(0, 5).join(', ')}
                      {app.studentId.skills.length > 5 &&
                        ` +${app.studentId.skills.length - 5} more`}
                    </p>
                  </div>
                )}

                {/* Resume Link (FIXED) */}
                {app.studentId?.resumeUrl && (
                  <div className="mb-3">
                    <a
                      href={app.studentId.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-700 underline"
                    >
                      📄 View Resume
                    </a>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-3 border-t">
                  <Button
                    onClick={() =>
                      handleAction(
                        app._id,
                        'approve',
                        'Approved by mentor'
                      )
                    }
                    className="flex-1 bg-green-600 hover:bg-green-700 gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Approve
                  </Button>

                  <Button
                    onClick={() =>
                      handleAction(
                        app._id,
                        'reject',
                        'Does not meet requirements'
                      )
                    }
                    variant="destructive"
                    className="flex-1 gap-2"
                  >
                    <XCircle className="w-4 h-4" />
                    Reject
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
