import AuthLayout from '@/components/layouts/Auth';
import DefaultLayout from '@/components/layouts/Default';
import Courses from '@/components/pages/Courses';
import Home from '@/components/pages/Home';
import Login from '@/components/pages/Login';
import type { RouteObject } from 'react-router-dom';

const routes: RouteObject[] = [
  {
    element: <DefaultLayout />,
    children: [
      {
        path: '/',
        index: true,
        element: <Home />,
      },
      {
        path: '/courses',
        element: <Courses />,
      },
    ],
  },
  {
    element: <AuthLayout />,
    path: '/auth/login',
    children: [
      {
        index: true,
        element: <Login />,
      },
    ],
  },
];

export default routes;
