import AuthLayout from '@/components/layouts/Auth';
import DefaultLayout from '@/components/layouts/Default';
import Dosen from '@/components/pages/Dosen/DosenCourses';
import MatakuliahDetail from '@/components/pages/Dosen/Matakuliah/Detail/MatakuliahDetail';
import MatakuliahLayout from '@/components/pages/Dosen/Matakuliah/index';
import ErrorPage from '@/components/pages/Error';
import Login from '@/components/pages/Login';
import FakultasPage from '@/components/pages/SuperAdmin/Fakultas/FakultasPage';
import MatakuliahPage from '@/components/pages/SuperAdmin/Matakuliah/MatakuliahPage';
import ProgramStudiPage from '@/components/pages/SuperAdmin/ProgramStudi/ProgramStudiPage';
import SuperAdmin from '@/components/pages/SuperAdmin/SuperAdmin';
import TahunAkademikDanSemesterPage from '@/components/pages/SuperAdmin/TahunAkademikDanSemester/TahunAkademikDanSemesterPage';
import PertemuanDetail from '@/components/pages/Dosen/Matakuliah/Pertemuan/PertemuanDetail';
import MahasiswaList from '@/components/pages/Dosen/Matakuliah/Mahasiswa/MahasiswaList';
import UserPage from '@/components/pages/SuperAdmin/Users/UserPage';
import { type RouteObject } from 'react-router-dom';
import GuestRoute from './GuestRoute';
import ProtectedRoute from './ProtectedRoute';
import RoleRedirect from './RoleRedirect';

const routes: RouteObject[] = [
  {
    element: (
      <GuestRoute>
        <AuthLayout />
      </GuestRoute>
    ),
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
        index: true,
        element: <RoleRedirect />,
      },
      {
        element: <ProtectedRoute allowedRoles={['SUPER_ADMIN']} />,
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
        element: <ProtectedRoute allowedRoles={['DOSEN']} />,
        path: '/dosen',
        children: [
          {
            path: '',
            index: true,
            element: <Dosen />,
          },
          {
            path: 'courses',
            element: <MatakuliahLayout />,
            children: [
              {
                index: true,
              },
              {
                path: ':id',
                element: <MatakuliahDetail />,
              },
              {
                path: ':matkulId/pertemuan/:pertemuanId',
                element: <PertemuanDetail />,
              },
              {
                path: ":matkulId/mahasiswa",
                element: <MahasiswaList />,
              },
            ],
          },
        ],
      },
      {
        element: <ProtectedRoute allowedRoles={['MAHASISWA']} />,
        path: '/mahasiswa',
        children: [
          {
            path: '',
            index: true,
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <ErrorPage />,
  },
];

export default routes;
