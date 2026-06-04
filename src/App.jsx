import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import SidebarLayout from './SidebarLayout';
import DevCardLanding from './landing/DevCardLanding';

import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import ProfileBuilderPage from './pages/ProfileBuilderPage';
import PublicProfilePage from './pages/PublicProfilePage';
import AdminDashboardPage from './pages/AdminDashboardPage';

import PortfolioPage from './pages/PortfolioPage';
import GitHubPage from './pages/GitHubPage';
import ResumePage from './pages/ResumePage';
import AnalyticsPage from './pages/AnalyticsPage';
import LeadsPage from './pages/LeadsPage';
import AIStudioPage from './pages/AIStudioPage';
import SEOPage from './pages/SEOPage';
import SubscriptionPage from './pages/SubscriptionPage';
import SettingsPage from './pages/SettingsPage';

import { AuthProvider, AuthContext } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

function ProtectedApp({ children }) {
  return (
    <AuthContext.Consumer>
      {({ loading, isAuthenticated }) => {
        if (loading) return null;
        if (!isAuthenticated) return <Navigate to="/login" replace />;
        return children;
      }}
    </AuthContext.Consumer>
  );
}

function TopNav() {
  const location = useLocation();
  const navigate = useNavigate();

  // Hide nav on /app/* routes (sidebar handles navigation there)
  if (location.pathname.startsWith('/app')) {
    return null;
  }

  return (
    <nav>
      <div className="logo">DevCard AI</div>
      <ul className="nav-links">
        <li><a onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>Home</a></li>
        <li><a href="#features" style={{ cursor: 'pointer' }}>Features</a></li>
        <li><a href="#pricing" style={{ cursor: 'pointer' }}>Pricing</a></li>
        <li><a onClick={() => navigate('/login')} style={{ cursor: 'pointer' }}>Login</a></li>
      </ul>
      <button className="nav-cta" onClick={() => navigate('/register')}>🚀 Build My DevCard</button>
    </nav>
  );
}

function AppRoutes() {
  return (
    <>
      <TopNav />
      <Routes>
        <Route path="/" element={<DevCardLanding />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route path="/:username" element={<PublicProfilePage />} />

        <Route path="/app" element={<ProtectedApp><SidebarLayout /></ProtectedApp>}>
          <Route index element={<Navigate to="/app/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />

          <Route path="profile" element={<ProfileBuilderPage />} />

          <Route path="profile-builder" element={<ProfileBuilderPage />} />
          <Route path="portfolio" element={<PortfolioPage />} />
          <Route path="github" element={<GitHubPage />} />
          <Route path="resume" element={<ResumePage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="leads" element={<LeadsPage />} />
          <Route path="ai-studio" element={<AIStudioPage />} />
          <Route path="seo" element={<SEOPage />} />
          <Route path="subscription" element={<SubscriptionPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="admin" element={<AdminDashboardPage />} />
          <Route path="*" element={<Navigate to="/app/dashboard" replace />} />
        </Route>


        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );

}
