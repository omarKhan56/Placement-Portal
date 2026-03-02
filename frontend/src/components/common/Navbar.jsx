//frontend/src/components/common/Navbar.jsx

import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  User, 
  LogOut, 
  Home, 
  Bell,
  GraduationCap 
} from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const getRoleRoute = () => {
    const routes = {
      student: '/student/dashboard',
      placement_cell: '/placement/dashboard',
      mentor: '/mentor/dashboard',
      employer: '/employer/dashboard',
    };
    return routes[user?.role] || '/';
  };

  const getRoleColor = () => {
    const colors = {
      student: 'bg-blue-100 text-blue-700',
      placement_cell: 'bg-purple-100 text-purple-700',
      mentor: 'bg-green-100 text-green-700',
      employer: 'bg-orange-100 text-orange-700',
    };
    return colors[user?.role] || 'bg-gray-100 text-gray-700';
  };

  return (
    <nav className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate(getRoleRoute())}>
            <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div className="hidden md:block">
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Campus Placement Portal
              </h1>
            </div>
          </div>

          {/* Right Side - User Info & Actions */}
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </Button>

            {/* User Info */}
            <div className="hidden md:flex items-center gap-3 px-3 py-2 bg-gray-50 rounded-lg">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.email?.split('@')[0]}</p>
                <Badge className={`${getRoleColor()} text-xs`}>
                  {user?.role?.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
            </div>

            {/* Action Buttons */}
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate(getRoleRoute())}
              className="hidden md:flex gap-2"
            >
              <Home className="w-4 h-4" />
              Dashboard
            </Button>

            <Button 
              variant="destructive" 
              size="sm"
              onClick={logout}
              className="gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden md:inline">Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}