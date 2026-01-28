import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import PlacementDashboard from './pages/PlacementDashboard';
import MentorDashboard from './pages/MentorDashboard';
import EmployerDashboard from './pages/EmployerDashboard';

// Student Components
import StudentProfile from './components/student/StudentProfile';

// Placement Components
import PostInternship from './components/placement/PostInternship';
import InternshipDetails from './components/placement/InternshipDetails';
import EditInternship from './components/placement/EditInternship';
import MyInternships from './components/placement/MyInternships';
import ManageApplications from './components/placement/ManageApplications';
import AnalyticsDashboard from './components/placement/AnalyticsDashboard';

// Mentor Components
import ApprovalQueue from './components/mentor/ApprovalQueue';
import StudentProgress from './components/mentor/StudentProgress';

// Employer Components
import CandidateShortlist from './components/employer/CandidateShortlist';

function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const roleRoutes = {
      student: '/student/dashboard',
      placement_cell: '/placement/dashboard',
      mentor: '/mentor/dashboard',
      employer: '/employer/dashboard',
    };
    return <Navigate to={roleRoutes[user.role] || '/login'} />;
  }

  return children;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Student Routes */}
          <Route
            path="/student/dashboard"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/profile"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentProfile />
              </ProtectedRoute>
            }
          />

          {/* Placement Cell Routes */}
          <Route
            path="/placement/dashboard"
            element={
              <ProtectedRoute allowedRoles={['placement_cell']}>
                <PlacementDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/placement/post-internship"
            element={
              <ProtectedRoute allowedRoles={['placement_cell']}>
                <PostInternship />
              </ProtectedRoute>
            }
          />

          <Route
            path="/placement/internship/:id"
            element={
              <ProtectedRoute allowedRoles={['placement_cell', 'employer']}>
                <InternshipDetails />
              </ProtectedRoute>
            }
          />

          <Route
            path="/placement/edit-internship/:id"
            element={
              <ProtectedRoute allowedRoles={['placement_cell', 'employer']}>
                <EditInternship />
              </ProtectedRoute>
            }
          />

          <Route
            path="/placement/my-internships"
            element={
              <ProtectedRoute allowedRoles={['placement_cell', 'employer']}>
                <MyInternships />
              </ProtectedRoute>
            }
          />

          <Route
            path="/placement/manage-applications"
            element={
              <ProtectedRoute allowedRoles={['placement_cell', 'employer']}>
                <ManageApplications />
              </ProtectedRoute>
            }
          />

          <Route
            path="/placement/analytics"
            element={
              <ProtectedRoute allowedRoles={['placement_cell']}>
                <AnalyticsDashboard />
              </ProtectedRoute>
            }
          />

          {/* Mentor Routes */}
          <Route
            path="/mentor/dashboard"
            element={
              <ProtectedRoute allowedRoles={['mentor']}>
                <MentorDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/mentor/approvals"
            element={
              <ProtectedRoute allowedRoles={['mentor']}>
                <ApprovalQueue />
              </ProtectedRoute>
            }
          />

          <Route
            path="/mentor/progress"
            element={
              <ProtectedRoute allowedRoles={['mentor']}>
                <StudentProgress />
              </ProtectedRoute>
            }
          />

          {/* Employer Routes */}
          <Route
            path="/employer/dashboard"
            element={
              <ProtectedRoute allowedRoles={['employer']}>
                <EmployerDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/employer/candidates"
            element={
              <ProtectedRoute allowedRoles={['employer']}>
                <CandidateShortlist />
              </ProtectedRoute>
            }
          />

          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>

      <ToastContainer position="top-right" autoClose={3000} />
    </AuthProvider>
  );
}

export default App;
