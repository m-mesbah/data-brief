import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { AppLayout } from './components/Layout/AppLayout';
import { ProtectedRoute } from './components/Common/ProtectedRoute';
import { ErrorBoundary } from './components/Common/ErrorBoundary';
import { Login } from './pages/Auth/Login';
import { SignUp } from './pages/Auth/SignUp';
import { Verification } from './pages/Auth/Verification';
import { Dashboard } from './pages/Dashboard';
import { OrganizationList } from './pages/Organizations/OrganizationList';
import { OrganizationDetail } from './pages/Organizations/OrganizationDetail';
import { OrganizationCreate } from './pages/Organizations/OrganizationCreate';
import { DomainList } from './pages/Domains/DomainList';
import { DomainDetail } from './pages/Domains/DomainDetail';
import { DomainCreate } from './pages/Domains/DomainCreate';
import { PlatformList } from './pages/Platforms/PlatformList';
import { PlatformDetail } from './pages/Platforms/PlatformDetail';
import { IntegrationList } from './pages/Integrations/IntegrationList';
import { IntegrationDetail } from './pages/Integrations/IntegrationDetail';
import { IntegrationCreate } from './pages/Integrations/IntegrationCreate';
import { EventList } from './pages/Events/EventList';
import { ROUTES } from './utils/constants';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ToastProvider>
          <AuthProvider>
            <Router>
          <Routes>
            {/* Public Routes */}
            <Route path={ROUTES.LOGIN} element={<Login />} />
            <Route path={ROUTES.SIGNUP} element={<SignUp />} />
            <Route path="/verification" element={<Verification />} />

            {/* Protected Routes */}
            <Route
              path={ROUTES.DASHBOARD}
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <Dashboard />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.ORGANIZATIONS}
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <OrganizationList />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.ORGANIZATION_CREATE}
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <OrganizationCreate />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.ORGANIZATION_DETAIL(':id')}
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <OrganizationDetail />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.DOMAINS}
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <DomainList />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.DOMAIN_CREATE}
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <DomainCreate />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.DOMAIN_DETAIL(':id')}
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <DomainDetail />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.PLATFORMS}
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <PlatformList />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.PLATFORM_DETAIL(':id')}
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <PlatformDetail />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.INTEGRATIONS}
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <IntegrationList />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.INTEGRATION_CREATE}
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <IntegrationCreate />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.INTEGRATION_DETAIL(':id')}
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <IntegrationDetail />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.EVENTS}
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <EventList />
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            {/* Default redirect */}
            <Route path="/" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
            <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
          </Routes>
        </Router>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
