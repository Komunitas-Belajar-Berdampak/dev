import { getToken, getUser } from '@/lib/authStorage';
import { roleHomePath } from '@/lib/homepath';
import { Navigate, useLocation } from 'react-router-dom';

export default function RoleRedirect() {
  const location = useLocation();
  const token = getToken();
  const user = getUser();

  if (!token || !user) {
    return <Navigate to='/auth/login' state={{ from: location }} replace />;
  }

  return <Navigate to={roleHomePath(user.namaRole)} replace />;
}
