import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import api from "../api/axios";
import {
  Building2,
  LogOut,
  Users,
  Briefcase,
  TrendingUp,
  PlusCircle,
  BarChart3,
  Calendar,
  Clock,
} from "lucide-react";
import { format } from "date-fns";

export default function PlacementDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [recentApplications, setRecentApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const analyticsRes = await api.get("/analytics/dashboard");
      setAnalytics(analyticsRes.data.data);
      setRecentApplications(analyticsRes.data.data.recentApplications || []);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    );
  }

  const stats = [
    {
      title: "Total Students",
      value: analytics?.overview?.totalStudents || 0,
      icon: Users,
      gradient: "from-blue-500 to-blue-600",
      bgGradient: "from-blue-50 to-blue-100",
    },
    {
      title: "Active Internships",
      value: analytics?.overview?.totalInternships || 0,
      icon: Briefcase,
      gradient: "from-purple-500 to-purple-600",
      bgGradient: "from-purple-50 to-purple-100",
    },
    {
      title: "Students Placed",
      value: analytics?.overview?.studentsPlaced || 0,
      icon: TrendingUp,
      gradient: "from-green-500 to-emerald-600",
      bgGradient: "from-green-50 to-emerald-100",
    },
    {
      title: "Placement Rate",
      value: `${analytics?.overview?.placementRate || 0}%`,
      icon: BarChart3,
      gradient: "from-orange-500 to-red-500",
      bgGradient: "from-orange-50 to-red-100",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl shadow-lg">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Placement Cell Dashboard
                </h1>
                <p className="text-sm text-gray-600">
                  Manage internships and placements
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => navigate("/placement/post-internship")}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                Post Internship
              </Button>
              <Button
                onClick={() => navigate("/placement/manage-applications")}
                variant="outline"
                className="shadow-sm gap-2"
              >
                <Users className="w-4 h-4" />
                Manage Applications
              </Button>
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
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome Card */}
        <Card className="bg-gradient-to-r from-purple-600 to-indigo-600 border-0 shadow-2xl text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
          <CardContent className="pt-6 relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  Placement Cell Portal 🎯
                </h2>
                <p className="text-purple-100 mb-1">{user?.email}</p>
                <Badge className="bg-white/20 text-white border-0 mt-2">
                  PLACEMENT CELL
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className={`bg-gradient-to-br ${stat.bgGradient} border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1`}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">
                  {stat.title}
                </CardTitle>
                <div
                  className={`p-2 bg-gradient-to-br ${stat.gradient} rounded-lg shadow-md`}
                >
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-gray-900">
                  {stat.value}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Activity & Top Skills */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Recent Applications */}
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Calendar className="w-6 h-6 text-blue-600" />
                Recent Applications
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentApplications.length === 0 ? (
                <p className="text-gray-600 text-center py-8">
                  No recent applications
                </p>
              ) : (
                <div className="space-y-3">
                  {recentApplications.slice(0, 5).map((app, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-sm">
                          {app.studentId?.fullName || "N/A"}
                        </p>
                        <p className="text-xs text-gray-600">
                          {app.internshipId?.title || "N/A"}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {format(new Date(app.appliedAt), "MMM dd")}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Top Skills in Demand */}
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-purple-600" />
                Top Skills in Demand
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analytics?.topSkills?.length === 0 ? (
                <p className="text-gray-600 text-center py-8">
                  No data available
                </p>
              ) : (
                <div className="space-y-3">
                  {analytics?.topSkills?.slice(0, 5).map((skill, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm font-medium">{skill._id}</span>
                      <Badge variant="secondary">{skill.count} openings</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Unfilled Seats Alert */}
        {analytics?.unfilled?.seatsRemaining > 0 && (
          <Card className="border-l-4 border-l-orange-500 bg-orange-50/50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Unfilled Seats Available
                  </h3>
                  <p className="text-sm text-gray-600">
                    There are {analytics.unfilled.seatsRemaining} unfilled seats
                    across {analytics?.overview?.totalInternships} active
                    internships.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
