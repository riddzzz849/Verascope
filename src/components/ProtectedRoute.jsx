
import { Outlet } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';

export default function ProtectedRoute({ unauthenticatedElement, fallback }) {
  const { isLoadingAuth, authError } = useAuth();

  if (isLoadingAuth) {
    return fallback || (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="h-8 w-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
      </div>
    );
  }

  if (authError && authError.type === 'auth_required') {
    return unauthenticatedElement;
  }

  if (authError && authError.type === 'user_not_registered') {
    return unauthenticatedElement;
  }

  return <Outlet />;
}

