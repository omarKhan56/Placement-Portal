import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  User, 
  Briefcase, 
  FileText, 
  BarChart3,
  Users,
  CheckSquare,
  Calendar
} from 'lucide-react';

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const studentMenuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/student/dashboard' },
    { icon: User, label: 'My Profile', path: '/student/profile' },
    { icon: Briefcase, label: 'Browse Internships', path: '/student/internships' },
    { icon: FileText, label: 'My Applications', path: '/student/applications' },
  ];

  const placementMenuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/placement/dashboard' },
    { icon: Briefcase, label: 'Post Internship', path: '/placement/post-internship' },
    { icon: FileText, label: 'My Internships', path: '/placement/my-internships' },
    { icon: Users, label: 'Manage Applications', path: '/placement/manage-applications' },
    { icon: BarChart3, label: 'Analytics', path: '/placement/analytics' },
  ];

  const mentorMenuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/mentor/dashboard' },
    { icon: CheckSquare, label: 'Approval Queue', path: '/mentor/approvals' },
    { icon: Users, label: 'Student Progress', path: '/mentor/progress' },
  ];

  const employerMenuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/employer/dashboard' },
    { icon: Users, label: 'Candidates', path: '/employer/candidates' },
    { icon: Calendar, label: 'Interviews', path: '/employer/interviews' },
  ];

  const getMenuItems = () => {
    switch (user?.role) {
      case 'student':
        return studentMenuItems;
      case 'placement_cell':
        return placementMenuItems;
      case 'mentor':
        return mentorMenuItems;
      case 'employer':
        return employerMenuItems;
      default:
        return [];
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen p-4">
      <nav className="space-y-2">
        {getMenuItems().map((item, index) => (
          <button
            key={index}
            onClick={() => navigate(item.path)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              isActive(item.path)
                ? 'bg-blue-600 text-white shadow-lg'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}