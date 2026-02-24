import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import BrandDashboard from './pages/Brand/Dashboard';
import BrandCampaigns from './pages/Brand/Campaigns';
import BrandCampaignDetail from './pages/Brand/CampaignDetail';
import CreateCampaign from './pages/Brand/CreateCampaign';
import BrandPayments from './pages/Brand/Payments';
import BrandSettings from './pages/Brand/Settings';
import BrandGMVUpload from './pages/Brand/GMVUpload';
import CreatorDashboard from './pages/Creator/Dashboard';
import BrandProfile from './pages/Profile/BrandProfile';
import CreatorProfile from './pages/Profile/CreatorProfile';
import CreatorDashboardNew from './pages/Creator/DashboardNew';
import CreatorCampaigns from './pages/Creator/Campaigns';
import CreatorCampaignDetail from './pages/Creator/CampaignDetail';
import MyCampaigns from './pages/Creator/MyCampaigns';
import Earnings from './pages/Creator/Earnings';
import Rewards from './pages/Creator/Rewards';
import SubmitWork from './pages/Creator/SubmitWork';
import CreatorSettings from './pages/Creator/Settings';

import About from './pages/About';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Contact from './pages/Contact';
import UIComponentsShowcase from './pages/UIComponentsShowcase';

function ProtectedRoute({ children, allowedRole }: { children: React.ReactNode; allowedRole?: 'brand' | 'creator' }) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && user?.role !== allowedRole) {
    return <Navigate to={user?.role === 'brand' ? '/brand/dashboard' : '/creator/dashboard'} replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  const { isAuthenticated, user } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate to={user?.role === 'brand' ? '/brand/dashboard' : '/creator/dashboard'} replace />
          ) : (
            <Landing />
          )
        }
      />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/about" element={<About />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/ui-showcase" element={<UIComponentsShowcase />} />

      {/* Public Profile Routes (Protected by Auth) */}
      <Route
        path="/brand/:id"
        element={
          <ProtectedRoute>
            <BrandProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/creator/:id"
        element={
          <ProtectedRoute>
            <CreatorProfile />
          </ProtectedRoute>
        }
      />

      {/* Brand Routes */}
      <Route
        path="/brand/dashboard"
        element={
          <ProtectedRoute allowedRole="brand">
            <BrandDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/brand/campaigns"
        element={
          <ProtectedRoute allowedRole="brand">
            <BrandCampaigns />
          </ProtectedRoute>
        }
      />
      <Route
        path="/brand/campaigns/create"
        element={
          <ProtectedRoute allowedRole="brand">
            <CreateCampaign />
          </ProtectedRoute>
        }
      />
      <Route
        path="/brand/campaigns/:id"
        element={
          <ProtectedRoute allowedRole="brand">
            <BrandCampaignDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/brand/campaigns/:id/edit"
        element={
          <ProtectedRoute allowedRole="brand">
            <CreateCampaign />
          </ProtectedRoute>
        }
      />
      <Route
        path="/brand/payments"
        element={
          <ProtectedRoute allowedRole="brand">
            <BrandPayments />
          </ProtectedRoute>
        }
      />
      <Route
        path="/brand/settings"
        element={
          <ProtectedRoute allowedRole="brand">
            <BrandSettings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/brand/campaigns/:id/gmv"
        element={
          <ProtectedRoute allowedRole="brand">
            <BrandGMVUpload />
          </ProtectedRoute>
        }
      />
      <Route
        path="/brand/*"
        element={
          <ProtectedRoute allowedRole="brand">
            <BrandDashboard />
          </ProtectedRoute>
        }
      />

      {/* Creator Routes */}
      <Route
        path="/creator/dashboard"
        element={
          <ProtectedRoute allowedRole="creator">
            <CreatorDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/creator/dashboard-new"
        element={
          <ProtectedRoute allowedRole="creator">
            <CreatorDashboardNew />
          </ProtectedRoute>
        }
      />
      <Route
        path="/creator/campaigns"
        element={
          <ProtectedRoute allowedRole="creator">
            <CreatorCampaigns />
          </ProtectedRoute>
        }
      />
      <Route
        path="/creator/campaigns/:id"
        element={
          <ProtectedRoute allowedRole="creator">
            <CreatorCampaignDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/creator/campaigns/:id/submit"
        element={
          <ProtectedRoute allowedRole="creator">
            <SubmitWork />
          </ProtectedRoute>
        }
      />
      <Route
        path="/creator/my-campaigns"
        element={
          <ProtectedRoute allowedRole="creator">
            <MyCampaigns />
          </ProtectedRoute>
        }
      />
      <Route
        path="/creator/earnings"
        element={
          <ProtectedRoute allowedRole="creator">
            <Earnings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/creator/earnings/history"
        element={
          <ProtectedRoute allowedRole="creator">
            <Earnings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/creator/rewards"
        element={
          <ProtectedRoute allowedRole="creator">
            <Rewards />
          </ProtectedRoute>
        }
      />
      <Route
        path="/creator/settings"
        element={
          <ProtectedRoute allowedRole="creator">
            <CreatorSettings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/creator/*"
        element={
          <ProtectedRoute allowedRole="creator">
            <CreatorDashboard />
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <AppRoutes />
        </Router>
      </DataProvider>
      <Toaster />
    </AuthProvider>
  );
}

export default App;
