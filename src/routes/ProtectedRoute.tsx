import type { Role } from '@/types/role';
import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles: Role[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const adminRole: Role = 'admin';
  const dosenRole: Role = 'dosen';

  if (!allowedRoles.includes(adminRole) && !allowedRoles.includes(dosenRole)) {
    return <Navigate to='/' replace />;
  }

  return children;
}

// sementara nanti ku edit lagi yaa
