import DefaultLayout from '@/components/layouts/Default';
import Courses from '@/components/pages/Courses';
import Home from '@/components/pages/Home';
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
];

export default routes;
