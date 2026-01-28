import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import InternshipList from '../components/student/InternshipList';

import { Badge } from '../components/ui/badge';
import api from '../api/axios';
import { 
  User, 
  LogOut, 
  Briefcase, 
  CheckCircle, 
  Calendar, 
  TrendingUp,
  Target,
  Award,
  Clock
} from 'lucide-react';

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({
    totalApplications: 0,
    shortlisted: 0,
    interviews: 0,
    selected: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch student profile
      const profileRes = await api.get('/student/profile');
      setProfile(profileRes.data.data);

      // Fetch applications
      const appsRes = await api.get('/application/my-applications');
      const applications = appsRes.data.data || [];

      // Calculate stats
      setStats({
        totalApplications: applications.length,
        shortlisted: applications.filter(a => a.status === 'shortlisted').length,
        interviews: applications.filter(a => a.status === 'interview_scheduled').length,
        selected: applications.filter(a => a.status === 'selected').length,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { 
      title: 'Applications', 
      value: stats.totalApplications, 
      icon: Briefcase,
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-50 to-blue-100'
    },
    { 
      title: 'Shortlisted', 
      value: stats.shortlisted, 
      icon: CheckCircle,
      gradient: 'from-yellow-500 to-orange-500',
      bgGradient: 'from-yellow-50 to-orange-100'
    },
    { 
      title: 'Interviews', 
      value: stats.interviews, 
      icon: Calendar,
      gradient: 'from-purple-500 to-purple-600',
      bgGradient: 'from-purple-50 to-purple-100'
    },
    { 
      title: 'Selected', 
      value: stats.selected, 
      icon: Award,
      gradient: 'from-green-500 to-emerald-600',
      bgGradient: 'from-green-50 to-emerald-100'
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
              <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Student Dashboard
                </h1>
                <p className="text-sm text-gray-600">Welcome back! 👋</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => navigate('/student/profile')}
                className="shadow-sm hover:shadow-md transition-all"
              >
                <User className="w-4 h-4 mr-2" />
                My Profile
              </Button>
              <Button 
                variant="destructive" 
                onClick={logout}
                className="shadow-sm hover:shadow-md transition-all"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome Card */}
        <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 border-0 shadow-2xl text-white overflow-hidden relative animate-slide-down">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
          <CardContent className="pt-6 relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  Hello, {profile?.fullName || 'Student'}! 🎓
                </h2>
                <p className="text-blue-100 mb-1">{user?.email}</p>
                <Badge className="bg-white/20 text-white border-0 mt-2">
                  {profile?.department || 'STUDENT'}
                </Badge>
              </div>
              <div className="hidden md:block">
                <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <User className="w-12 h-12 text-white" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Completion Warning */}
        {profile && !profile.profileCompleted && (
          <Card className="border-l-4 border-l-yellow-500 bg-yellow-50/50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Target className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">Complete Your Profile</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Your profile is incomplete. Complete it to get better internship recommendations and increase your employability score.
                  </p>
                  <Button
                    onClick={() => navigate('/student/profile')}
                    className="bg-yellow-600 hover:bg-yellow-700"
                  >
                    Complete Profile Now
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
          {statCards.map((stat, index) => (
            <Card 
              key={index} 
              className={`bg-gradient-to-br ${stat.bgGradient} border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer`}
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
                <p className="text-xs text-gray-600 mt-2 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  Track your progress
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Employability Score */}
        {profile && (
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm animate-slide-up">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Target className="w-6 h-6 text-blue-600" />
                    Employability Score
                  </CardTitle>
                  <p className="text-sm text-gray-600 mt-1">Complete your profile to boost your score</p>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    {profile.employabilityScore || 0}
                  </div>
                  <div className="text-sm text-gray-500">/ 100</div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="relative">
                  <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 h-4 rounded-full transition-all duration-1000 ease-out shadow-lg"
                      style={{ width: `${profile.employabilityScore || 0}%` }}
                    ></div>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {[
                    { label: 'Resume', status: !!profile.resumeUrl },
                    { label: 'Skills', status: profile.skills?.length > 0 },
                    { label: 'CGPA', status: !!profile.cgpa },
                    { label: 'Cover Letter', status: !!profile.coverLetter },
                    { label: 'Certifications', status: profile.certifications?.length > 0 },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <div className={`w-4 h-4 rounded-full ${item.status ? 'bg-green-500' : 'bg-gray-300'} flex items-center justify-center`}>
                        {item.status && <CheckCircle className="w-3 h-3 text-white" />}
                      </div>
                      <span className="text-gray-700">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Recommended Internships */}
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Target className="w-6 h-6 text-purple-600" />
                🎯 Recommended Internships
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
                  <Briefcase className="w-10 h-10 text-purple-600" />
                </div>
                <p className="text-gray-600 mb-4">
                  {profile?.profileCompleted 
                    ? 'Check recommended internships below'
                    : 'Complete your profile to get personalized recommendations'}
                </p>
                {!profile?.profileCompleted && (
                  <Button 
                    onClick={() => navigate('/student/profile')}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    Complete Profile Now
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* My Applications */}
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Clock className="w-6 h-6 text-blue-600" />
                My Applications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                  <Briefcase className="w-10 h-10 text-blue-600" />
                </div>
                <p className="text-gray-600 mb-4">
                  {stats.totalApplications > 0 
                    ? `You have ${stats.totalApplications} application(s). View details below.`
                    : 'No applications yet. Start applying to internships!'}
                </p>
                <Button 
                  variant="outline"
                  className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50"
                  onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
                >
                  {stats.totalApplications > 0 ? 'View Applications' : 'Browse Internships'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recommended Internships Component */}
        <RecommendedJobs />

        {/* Applications Tracker Component */}
        <ApplicationTracker />
        <InternshipList />

      </main>
    </div>
  );
}

// Import these components (we'll update them next)
import RecommendedJobs from '../components/student/RecommendedJobs';
import ApplicationTracker from '../components/student/ApplicationTracker';