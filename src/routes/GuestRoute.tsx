import { getToken, getUser } from '@/lib/authStorage';
import { roleHomePath } from '@/lib/homepath';
import type { PropsWithChildren } from 'react';
import { Navigate } from 'react-router-dom';

type GuestRouteProps = PropsWithChildren;

export default function GuestRoute({ children }: GuestRouteProps) {
  const token = getToken();
  const user = getUser();

  if (token && user) {
    return <Navigate to={roleHomePath(user.namaRole)} replace />;
  }

  return <>{children}</>;
}
