import { Navigate } from 'react-router-dom';
import type { Role } from '@/types/role';
import type { JSX } from 'react/jsx-runtime';

interface ProtectedRouteProps {
  children: JSX.Element;
  allowedRoles: Role[];
}

export default function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const userRole: Role = 'admin'; // 🔴 dummy (sementara)

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
