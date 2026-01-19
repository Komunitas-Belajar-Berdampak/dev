import AuthLayout from '@/components/layouts/Auth';
import DefaultLayout from '@/components/layouts/Default';
import MatakuliahLayout from '@/components/pages/Dosen/Matakuliah/index';
import Dosen from '@/components/pages/Dosen/DosenCourses';
import Login from '@/components/pages/Login';
import MatakuliahDetail from '@/components/pages/Dosen/Matakuliah/Detail/MatakuliahDetail';
import FakultasPage from '@/components/pages/SuperAdmin/Fakultas/FakultasPage';
import MatakuliahPage from '@/components/pages/SuperAdmin/Matakuliah/MatakuliahPage';
import ProgramStudiPage from '@/components/pages/SuperAdmin/ProgramStudi/ProgramStudiPage';
import SuperAdmin from '@/components/pages/SuperAdmin/SuperAdmin';
import TahunAkademikDanSemesterPage from '@/components/pages/SuperAdmin/TahunAkademikDanSemester/TahunAkademikDanSemesterPage';
import UserPage from '@/components/pages/SuperAdmin/Users/UserPage';
import { Navigate, type RouteObject } from 'react-router-dom';

const routes: RouteObject[] = [
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
  {
    element: <DefaultLayout />,
    children: [
      {
        path: '/',
        index: true,
        // sementara diarahkan ke admin dlu aja pertama kali * nnti gnti /admin /dosen sesuai role
        element: <Navigate to={'/dosen'} replace />,
      },
      {
        path: '/admin',
        children: [
          {
            path: '',
            index: true,
            element: <SuperAdmin />,
          },
          {
            path: 'users',
            element: <UserPage />,
          },
          {
            path: 'faculties',
            element: <FakultasPage />,
          },
          {
            path: 'majors',
            element: <ProgramStudiPage />,
          },
          {
            path: 'academic-terms',
            element: <TahunAkademikDanSemesterPage />,
          },
          {
            path: 'courses',
            element: <MatakuliahPage />,
          },
        ],
      },
      {
        path: '/dosen',
        children: [
          {
            path: '',
            index: true,
            element: <Dosen />,
          },

          {
            path: "/dosen/matakuliah",
            element: <MatakuliahLayout />,
            children: [
              {
                path: ":id",
                element: <MatakuliahDetail />,
              },
            ],
          },
        ],
      },
    ],
  },
];

export default routes;
