import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { StoreProvider, useStore } from './lib/store';
import { AppLayout } from './components/AppLayout';

const Landing = lazy(() => import('./pages/Landing'));
const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const MapView = lazy(() => import('./pages/MapView'));
const Properties = lazy(() => import('./pages/Properties'));
const Insurance = lazy(() => import('./pages/Insurance'));
const Alerts = lazy(() => import('./pages/Alerts'));
const Settings = lazy(() => import('./pages/Settings'));
const Profile = lazy(() => import('./pages/Profile'));

function Loader() {
  return (
    <div className="flex h-[60vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-line border-t-brand" />
    </div>
  );
}

function Protected({ children }: { children: React.ReactNode }) {
  const { profile } = useStore();
  const location = useLocation();
  if (!profile) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  return <AppLayout>{children}</AppLayout>;
}

export default function App() {
  return (
    <StoreProvider>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
          <Route path="/map" element={<Protected><MapView /></Protected>} />
          <Route path="/properties" element={<Protected><Properties /></Protected>} />
          <Route path="/insurance" element={<Protected><Insurance /></Protected>} />
          <Route path="/alerts" element={<Protected><Alerts /></Protected>} />
          <Route path="/settings" element={<Protected><Settings /></Protected>} />
          <Route path="/profile" element={<Protected><Profile /></Protected>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </StoreProvider>
  );
}
