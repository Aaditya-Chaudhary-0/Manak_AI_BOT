import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardPage from '../pages/DashboardPage';
import LoginPage from '../pages/LoginPage';
import SignupPage from '../pages/SignupPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import AssistantPage from '../pages/AssistantPage';
import StandardsPage from '../pages/StandardsPage';
import StandardDetailPage from '../pages/StandardDetailPage';
import RecommendPage from '../pages/RecommendPage';
import CertificationPage from '../pages/CertificationPage';
import HistoryPage from '../pages/HistoryPage';
import SavedPage from '../pages/SavedPage';
import ProfilePage from '../pages/ProfilePage';

// Admin Pages
import AdminOverviewPage from '../pages/admin/AdminOverviewPage';
import UserManagementPage from '../pages/admin/UserManagementPage';
import StandardsManagementPage from '../pages/admin/StandardsManagementPage';
import SourcesPage from '../pages/admin/SourcesPage';
import VerificationQueuePage from '../pages/admin/VerificationQueuePage';
import ActivityPage from '../pages/admin/ActivityPage';
import SystemStatusPage from '../pages/admin/SystemStatusPage';
import AdminProfilePage from '../pages/admin/AdminProfilePage';

import PublicLayout from '../layouts/PublicLayout';
import { AppProvider } from '../context/AppContext';

function AppRouter() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          {/* Public / Auth routes wrapped in PublicLayout */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<PublicLayout><LoginPage /></PublicLayout>} />
          <Route path="/signup" element={<PublicLayout><SignupPage /></PublicLayout>} />
          <Route path="/forgot-password" element={<PublicLayout><ForgotPasswordPage /></PublicLayout>} />
          
          {/* Core Workspace Routes (Each wraps in AppLayout for full viewport app shell) */}
          <Route path="/app/dashboard" element={<DashboardPage />} />
          <Route path="/app/assistant" element={<AssistantPage />} />
          <Route path="/app/standards" element={<StandardsPage />} />
          <Route path="/app/standards/:id" element={<StandardDetailPage />} />
          <Route path="/app/recommend" element={<RecommendPage />} />
          <Route path="/app/certification" element={<CertificationPage />} />
          <Route path="/app/history" element={<HistoryPage />} />
          <Route path="/app/saved" element={<SavedPage />} />
          <Route path="/app/profile" element={<ProfilePage />} />

          {/* Admin Platform Routes (Each wraps in AdminLayout) */}
          <Route path="/admin" element={<AdminOverviewPage />} />
          <Route path="/admin/users" element={<UserManagementPage />} />
          <Route path="/admin/standards" element={<StandardsManagementPage />} />
          <Route path="/admin/sources" element={<SourcesPage />} />
          <Route path="/admin/verification" element={<VerificationQueuePage />} />
          <Route path="/admin/activity" element={<ActivityPage />} />
          <Route path="/admin/system" element={<SystemStatusPage />} />
          <Route path="/admin/profile" element={<AdminProfilePage />} />
          
          {/* Catch-all fallbacks */}
          <Route path="/app/*" element={<Navigate to="/app/dashboard" replace />} />
          <Route path="/admin/*" element={<Navigate to="/admin" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default AppRouter;
