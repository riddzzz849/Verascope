
import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
import { ThemeProvider } from 'next-themes';
import Layout from '@/components/Layout';
import Home from '@/pages/Home';
import Report from '@/pages/Report';
import HowItWorks from '@/pages/HowItWorks';
import Methodology from '@/pages/Methodology';
import Limitations from '@/pages/Limitations';
import Trending from '@/pages/Trending';
import Dashboard from '@/pages/Dashboard';
import StartPage from '@/pages/StartPage';
import Settings from '@/pages/Settings';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
// Add page imports here

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin, isAuthenticated } = useAuth();
  const { pathname } = useLocation();
  const isAuthRoute = ['/login', '/register', '/forgot-password', '/reset-password'].some((p) => pathname.startsWith(p));

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors â€” but never block the sign-in/auth routes
  if (authError && !isAuthRoute) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Show the animated start page; "Get Started" takes them to sign-in
      return <StartPage />;
    }
  }

  // Not authenticated (e.g. public app with no session) â†’ animated start page,
  // unless the user is already on a sign-in/auth route
  if (!isAuthenticated && !isAuthRoute) {
    return <StartPage />;
  }

  // Render the main app
  return (
    <Routes>
      <Route path="/welcome" element={<StartPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/report/:id" element={<Report />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/methodology" element={<Methodology />} />
        <Route path="/limitations" element={<Limitations />} />
        <Route path="/trending" element={<Trending />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};


function App() {

  return (
    <AuthProvider>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
        <QueryClientProvider client={queryClientInstance}>
          <Router>
            <ScrollToTop />
            <AuthenticatedApp />
          </Router>
          <Toaster />
        </QueryClientProvider>
      </ThemeProvider>
    </AuthProvider>
  )
}

export default App

