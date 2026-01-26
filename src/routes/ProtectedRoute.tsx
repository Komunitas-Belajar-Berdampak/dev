import { getToken, getUser } from '@/lib/authStorage';
import { roleHomePath } from '@/lib/homepath';
import type { Role } from '@/types/role';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  redirectTo?: string;
  allowedRoles: Role[];
}

export default function ProtectedRoute({ allowedRoles, redirectTo = '/auth/login' }: ProtectedRouteProps) {
  const location = useLocation();
  const token = getToken();
  const user = getUser();

  if (!token || !user) return <Navigate to={redirectTo} state={{ from: location }} replace />;

  if (allowedRoles?.length && !allowedRoles.includes(user.namaRole)) {
    return <Navigate to={roleHomePath(user.namaRole)} replace />;
  }

  return <Outlet />;
}
