//frontend/src/components/placement/AnalyticsDashboard.jsx

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import api from '../../api/axios';
import LoadingSpinner from '../common/LoadingSpinner';
import {
  BarChart3,
  TrendingUp,
  Users,
  Briefcase,
  Award,
  Calendar
} from 'lucide-react';

export default function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await api.get('/analytics/dashboard');
      setAnalytics(res.data.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading analytics..." />;

  const stats = [
    {
      title: 'Total Students',
      value: analytics?.overview?.totalStudents || 0,
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'from-blue-50 to-blue-100',
    },
    {
      title: 'Active Internships',
      value: analytics?.overview?.totalInternships || 0,
      icon: Briefcase,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'from-purple-50 to-purple-100',
    },
    {
      title: 'Total Applications',
      value: analytics?.overview?.totalApplications || 0,
      icon: Calendar,
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'from-yellow-50 to-orange-100',
    },
    {
      title: 'Students Placed',
      value: analytics?.overview?.studentsPlaced || 0,
      icon: Award,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'from-green-50 to-emerald-100',
    },
  ];

  return (
    <div className="space-y-6">
      <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <BarChart3 className="w-7 h-7 text-blue-600" />
            Analytics Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card
                key={index}
                className={`bg-gradient-to-br ${stat.bgColor} border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1`}
              >
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-700">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 bg-gradient-to-br ${stat.color} rounded-lg shadow-md`}>
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-gray-900">{stat.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Department-wise Analysis */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Department-wise Placement</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {analytics?.departmentWise?.map((dept, index) => (
                <Card key={index} className="border">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">{dept._id}</span>
                      <Badge>{dept.count} students</Badge>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${(dept.count / analytics?.overview?.totalStudents) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Top Skills */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Most In-Demand Skills</h3>
            <div className="flex flex-wrap gap-3">
              {analytics?.topSkills?.slice(0, 10).map((skill, index) => (
                <Badge key={index} variant="secondary" className="px-4 py-2 text-base">
                  {skill._id} ({skill.count})
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}