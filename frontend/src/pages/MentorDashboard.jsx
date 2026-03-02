//frontend/src/pages/MentorDashboard.jsx

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import api from '../api/axios';
import { toast } from 'react-toastify';
import { 
  Users, 
  LogOut, 
  CheckCircle, 
  Clock, 
  XCircle,
  User
} from 'lucide-react';
import { format } from 'date-fns';

export default function MentorDashboard() {
  const { user, logout } = useAuth();
  const [pendingApplications, setPendingApplications] = useState([]);
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch all applications for mentor (you'll need to create this endpoint or filter)
      const res = await api.get('/application?status=mentor_pending');
      const apps = res.data.data || [];
      
      setPendingApplications(apps);
      
      // Calculate stats (you might want a dedicated endpoint for this)
      setStats({
        pending: apps.filter(a => a.status === 'mentor_pending').length,
        approved: 0, // You'd need to track this
        rejected: 0, // You'd need to track this
      });
    } catch (error) {
      console.error('Error fetching mentor data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMentorAction = async (applicationId, action, comments = '') => {
    try {
      await api.put(`/application/${applicationId}/mentor-action`, {
        action, // 'approve' or 'reject'
        comments,
      });
      
      toast.success(`✅ Application ${action}d successfully!`);
      fetchDashboardData(); // Refresh data
    } catch (error) {
      console.error('Error processing application:', error);
      toast.error(error.response?.data?.message || `Failed to ${action} application`);
    }
  };

  const statCards = [
    { 
      title: 'Pending Approvals', 
      value: stats.pending, 
      icon: Clock,
      gradient: 'from-yellow-500 to-orange-500',
      bgGradient: 'from-yellow-50 to-orange-100'
    },
    { 
      title: 'Approved', 
      value: stats.approved, 
      icon: CheckCircle,
      gradient: 'from-green-500 to-emerald-600',
      bgGradient: 'from-green-50 to-emerald-100'
    },
    { 
      title: 'Rejected', 
      value: stats.rejected, 
      icon: XCircle,
      gradient: 'from-red-500 to-pink-600',
      bgGradient: 'from-red-50 to-pink-100'
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl shadow-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  Mentor Dashboard
                </h1>
                <p className="text-sm text-gray-600">Guide and approve student applications</p>
              </div>
            </div>
            <Button 
              variant="destructive" 
              onClick={logout}
              className="shadow-sm hover:shadow-md transition-all gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome Card */}
        <Card className="bg-gradient-to-r from-green-600 to-emerald-600 border-0 shadow-2xl text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
          <CardContent className="pt-6 relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">Welcome, Mentor! 👨‍🏫</h2>
                <p className="text-green-100 mb-1">{user?.email}</p>
                <Badge className="bg-white/20 text-white border-0 mt-2">
                  MENTOR
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {statCards.map((stat, index) => (
            <Card 
              key={index} 
              className={`bg-gradient-to-br ${stat.bgGradient} border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1`}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 bg-gradient-to-br ${stat.gradient} rounded-lg shadow-md`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-gray-900">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pending Approvals */}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl">Pending Approval Requests</CardTitle>
          </CardHeader>
          <CardContent>
            {pendingApplications.length === 0 ? (
              <p className="text-gray-600 text-center py-8">No pending approvals</p>
            ) : (
              <div className="space-y-4">
                {pendingApplications.map((app) => (
                  <div key={app._id} className="p-4 border rounded-lg bg-white">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <User className="w-4 h-4 text-gray-400" />
                          <h3 className="font-semibold">{app.studentId?.fullName || 'N/A'}</h3>
                        </div>
                        <p className="text-sm text-gray-600">
                          Student ID: {app.studentId?.studentId || 'N/A'}
                        </p>
                        <p className="text-sm text-gray-600">
                          Department: {app.studentId?.department || 'N/A'}
                        </p>
                        <p className="text-sm text-gray-600">
                          CGPA: {app.studentId?.cgpa || 'N/A'}
                        </p>
                      </div>
                      <Badge variant="outline">
                        Applied {format(new Date(app.appliedAt), 'MMM dd, yyyy')}
                      </Badge>
                    </div>

                    <div className="p-3 bg-blue-50 rounded-lg mb-3">
                      <p className="font-medium text-sm mb-1">Internship Details:</p>
                      <p className="text-sm">{app.internshipId?.title || 'N/A'}</p>
                      <p className="text-xs text-gray-600">{app.internshipId?.company || 'N/A'}</p>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleMentorAction(app._id, 'approve', 'Approved by mentor')}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        onClick={() => handleMentorAction(app._id, 'reject', 'Does not meet requirements')}
                        variant="destructive"
                        className="flex-1"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}