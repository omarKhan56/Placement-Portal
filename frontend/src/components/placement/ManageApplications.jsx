//frontend/src/components/placement/ManageApplications.jsx

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog';
import api from '../../api/axios';
import { toast } from 'react-toastify';
import {
  Users,
  CheckCircle,
  XCircle,
  Calendar,
  Search,
  FileText,
} from 'lucide-react';
import { format } from 'date-fns';

export default function ManageApplications() {
  const [applications, setApplications] = useState([]);
  const [filteredApps, setFilteredApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const [showInterviewDialog, setShowInterviewDialog] = useState(false);

  const [interviewData, setInterviewData] = useState({
    date: '',
    time: '',
    mode: 'online',
    link: '',
  });

  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
  });

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    filterApplications();
  }, [applications, filters]);

  const fetchApplications = async () => {
    try {
      const res = await api.get('/application');
      setApplications(res.data.data || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const filterApplications = () => {
    let filtered = [...applications];

    if (filters.search) {
      filtered = filtered.filter(app =>
        app.studentId?.fullName?.toLowerCase().includes(filters.search.toLowerCase()) ||
        app.internshipId?.title?.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.status !== 'all') {
      filtered = filtered.filter(app => app.status === filters.status);
    }

    setFilteredApps(filtered);
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await api.put(`/application/${id}/status`, { status });
      toast.success(`Application ${status.replace('_', ' ')}`);
      fetchApplications();
    } catch (err) {
      console.error(err);
      toast.error('Status update failed');
    }
  };

  const handleScheduleInterview = async () => {
    if (!interviewData.date || !interviewData.time) {
      toast.error('Date & time required');
      return;
    }

    try {
      const interviewDate = new Date(`${interviewData.date}T${interviewData.time}`);

      await api.put(`/application/${selectedApp._id}/status`, {
        status: 'interview_scheduled',
        interviewDate,
        interviewMode: interviewData.mode,
        interviewLink: interviewData.link,
      });

      toast.success('Interview scheduled');
      setShowInterviewDialog(false);
      setInterviewData({ date: '', time: '', mode: 'online', link: '' });
      fetchApplications();
    } catch (err) {
      console.error(err);
      toast.error('Failed to schedule interview');
    }
  };

  const getStatusColor = (status) => ({
    applied: 'bg-blue-100 text-blue-700',
    mentor_approved: 'bg-yellow-100 text-yellow-700',
    shortlisted: 'bg-purple-100 text-purple-700',
    interview_scheduled: 'bg-indigo-100 text-indigo-700',
    selected: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
  }[status] || 'bg-gray-100 text-gray-700');

  const getStatusActions = (app) => {
    const actions = [];

    if (app.status === 'mentor_approved') {
      actions.push(
        <Button
          key="shortlist"
          size="sm"
          onClick={() => handleStatusUpdate(app._id, 'shortlisted')}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <CheckCircle className="w-4 h-4 mr-1" />
          Shortlist
        </Button>
      );
    }

    if (app.status === 'shortlisted') {
      actions.push(
        <Button
          key="interview"
          size="sm"
          onClick={() => {
            setSelectedApp(app);
            setShowInterviewDialog(true);
          }}
          className="bg-indigo-600 hover:bg-indigo-700"
        >
          <Calendar className="w-4 h-4 mr-1" />
          Interview
        </Button>
      );
    }

    if (['shortlisted', 'interview_scheduled'].includes(app.status)) {
      actions.push(
        <Button
          key="select"
          size="sm"
          onClick={() => handleStatusUpdate(app._id, 'selected')}
          className="bg-green-600 hover:bg-green-700"
        >
          <CheckCircle className="w-4 h-4 mr-1" />
          Select
        </Button>
      );
    }

    if (['mentor_approved', 'shortlisted', 'interview_scheduled'].includes(app.status)) {
      actions.push(
        <Button
          key="reject"
          size="sm"
          variant="destructive"
          onClick={() => handleStatusUpdate(app._id, 'rejected')}
        >
          <XCircle className="w-4 h-4 mr-1" />
          Reject
        </Button>
      );
    }

    return actions;
  };

  if (loading) {
    return (
      <Card className="p-8 text-center">
        <div className="animate-spin h-10 w-10 mx-auto border-b-2 border-blue-600 rounded-full" />
        <p className="mt-4 text-gray-600">Loading applications...</p>
      </Card>
    );
  }

  return (
    <>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" />
            Manage Applications
          </CardTitle>
        </CardHeader>

        <CardContent>
          {/* Filters */}
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search student or internship"
                className="pl-10"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
            </div>

            <select
              className="h-10 border rounded-md px-3"
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            >
              <option value="all">All Status</option>
              <option value="mentor_approved">Mentor Approved</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="interview_scheduled">Interview Scheduled</option>
              <option value="selected">Selected</option>
              <option value="rejected">Rejected</option>
            </select>

            <div className="text-sm text-gray-600 flex items-center">
              Showing {filteredApps.length} / {applications.length}
            </div>
          </div>

          {/* List */}
          {filteredApps.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No applications found</p>
          ) : (
            <div className="space-y-4">
              {filteredApps.map(app => (
                <div key={app._id} className="border p-4 rounded-lg bg-white">
                  <div className="flex justify-between mb-2">
                    <div>
                      <h3 className="font-semibold">{app.studentId?.fullName}</h3>
                      <p className="text-sm text-gray-600">
                        Applied for <b>{app.internshipId?.title}</b>
                      </p>
                    </div>
                    <Badge className={getStatusColor(app.status)}>
                      {app.status.replace(/_/g, ' ').toUpperCase()}
                    </Badge>
                  </div>

                  {app.studentId?.resumeUrl && (
                    <a
                      href={app.studentId.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-blue-600 text-sm"
                    >
                      <FileText className="w-4 h-4" />
                      View Resume
                    </a>
                  )}

                  <div className="flex flex-wrap gap-2 mt-3">
                    {getStatusActions(app)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Interview Dialog */}
      <Dialog open={showInterviewDialog} onOpenChange={setShowInterviewDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule Interview</DialogTitle>
            <DialogDescription>
              {selectedApp?.studentId?.fullName}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Input
              type="date"
              value={interviewData.date}
              onChange={(e) => setInterviewData({ ...interviewData, date: e.target.value })}
            />
            <Input
              type="time"
              value={interviewData.time}
              onChange={(e) => setInterviewData({ ...interviewData, time: e.target.value })}
            />

            <select
              className="h-10 border rounded-md px-3"
              value={interviewData.mode}
              onChange={(e) => setInterviewData({ ...interviewData, mode: e.target.value })}
            >
              <option value="online">Online</option>
              <option value="offline">Offline</option>
            </select>

            {interviewData.mode === 'online' && (
              <Input
                placeholder="Interview link"
                value={interviewData.link}
                onChange={(e) => setInterviewData({ ...interviewData, link: e.target.value })}
              />
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowInterviewDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleScheduleInterview}>
              Schedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
