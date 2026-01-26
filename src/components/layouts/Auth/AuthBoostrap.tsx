import { me } from '@/api/auth';
import { getToken, removeToken, removeUser, setUser } from '@/lib/authStorage';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function AuthBootstrap() {
  const token = getToken();
  const navigate = useNavigate();
  const location = useLocation();

  const q = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: me,
    enabled: !!token,
    retry: false,
  });

  useEffect(() => {
    if (q.data?.user) {
      setUser(q.data.user);
    }
  }, [q.data]);

  useEffect(() => {
    if (!q.isError) return;

    removeToken();
    removeUser();

    if (location.pathname !== '/auth/login') {
      navigate('/auth/login', { replace: true });
    }
  }, [q.isError, navigate, location.pathname]);

  return null;
}
