import AuthLayout from '@/components/layouts/Auth';
import DefaultLayout from '@/components/layouts/Default';
import Dosen from '@/components/pages/Dosen/DosenCourses';
import MatakuliahDetail from '@/components/pages/Dosen/Matakuliah/Detail/MatakuliahDetail';
import MatakuliahLayout from '@/components/pages/Dosen/Matakuliah/index';
import StudyGroupLayout from '@/components/pages/Dosen/StudyGroup';
import AddStudyGroup from '@/components/pages/Dosen/StudyGroup/Add';
import AddPost from '@/components/pages/Dosen/StudyGroup/AddPost';
import StudyGroupDetail from '@/components/pages/Dosen/StudyGroup/Detail';
import EditStudyGroup from '@/components/pages/Dosen/StudyGroup/Edit';
import EditPost from '@/components/pages/Dosen/StudyGroup/EditPost';
import KontribusiMahasiswaDetail from '@/components/pages/Dosen/StudyGroup/Kontribusi';
import StudyGroupList from '@/components/pages/Dosen/StudyGroup/List';
import StudyGroupMain from '@/components/pages/Dosen/StudyGroup/Main';
import TopikPembahasanDetail from '@/components/pages/Dosen/StudyGroup/TopikDetail';
import ErrorPage from '@/components/pages/Error';
import Login from '@/components/pages/Login';
import AddPostMhs from '@/components/pages/Mahasiswa/StudyGroup/AddPost';
import StudyGroupDetailMhs from '@/components/pages/Mahasiswa/StudyGroup/Detail';
import EditPostMhs from '@/components/pages/Mahasiswa/StudyGroup/EditPost';
import KontribusiMahasiswaDetailMhs from '@/components/pages/Mahasiswa/StudyGroup/Kontribusi';
import StudyGroupListMhs from '@/components/pages/Mahasiswa/StudyGroup/List';
import StudyGroupMainMhs from '@/components/pages/Mahasiswa/StudyGroup/Main';
import TopikPembahasanDetailMhs from '@/components/pages/Mahasiswa/StudyGroup/TopikDetail';
import FakultasPage from '@/components/pages/SuperAdmin/Fakultas/FakultasPage';
import MatakuliahPage from '@/components/pages/SuperAdmin/Matakuliah/MatakuliahPage';
import ProgramStudiPage from '@/components/pages/SuperAdmin/ProgramStudi/ProgramStudiPage';
import SuperAdmin from '@/components/pages/SuperAdmin/SuperAdmin';
import TahunAkademikDanSemesterPage from '@/components/pages/SuperAdmin/TahunAkademikDanSemester/TahunAkademikDanSemesterPage';
import PertemuanDetail from '@/components/pages/Dosen/Matakuliah/Pertemuan/PertemuanDetail';
import MahasiswaList from '@/components/pages/Dosen/Matakuliah/Mahasiswa/MahasiswaList';
import MateriTugasPage from "@/components/pages/Dosen/Matakuliah/MateriTugas/MateriTugasPage";
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
                path: ':id/pertemuan/:pertemuanId',
                element: <PertemuanDetail />,
              },
              {
                path: ":id/mahasiswa",
                element: <MahasiswaList />,
              },
              {
                path: ":id/materi-tugas",
                element: <MateriTugasPage />,
              },

            ],
          },
          {
            path: 'study-groups',
            element: <StudyGroupLayout />,
            children: [
              {
                index: true,
                path: '',
                element: <StudyGroupMain />,
              },
              {
                path: ':namaMatkul/:idMatkul',
                element: <StudyGroupList />,
              },
              {
                path: ':namaMatkul/:idMatkul/add',
                element: <AddStudyGroup />,
              },
              {
                path: ':namaMatkul/:idMatkul/:namaSg/:idSg/edit',
                element: <EditStudyGroup />,
              },
              {
                path: ':namaMatkul/:idMatkul/:namaSg/:idSg',
                element: <StudyGroupDetail />,
              },
              {
                path: ':namaMatkul/:idMatkul/:namaSg/:idSg/kontribusi/:namaAnggota/:idAnggota',
                element: <KontribusiMahasiswaDetail />,
              },
              {
                path: ':namaMatkul/:idMatkul/:namaSg/:idSg/:namaTopik/:idTopik',
                element: <TopikPembahasanDetail />,
              },
              {
                path: ':namaMatkul/:idMatkul/:namaSg/:idSg/:namaTopik/:idTopik/new-discussion',
                element: <AddPost />,
              },
              {
                path: ':namaMatkul/:idMatkul/:namaSg/:idSg/:namaTopik/:idTopik/edit-discussion/:idPost',
                element: <EditPost />,
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
          {
            path: 'study-groups',
            element: <StudyGroupLayout />,
            children: [
              {
                index: true,
                element: <StudyGroupMainMhs />,
              },
              {
                path: ':namaMatkul/:idMatkul',
                element: <StudyGroupListMhs />,
              },
              {
                path: ':namaMatkul/:idMatkul/:namaSg/:idSg',
                element: <StudyGroupDetailMhs />,
              },
              {
                path: ':namaMatkul/:idMatkul/:namaSg/:idSg/kontribusi/:namaAnggota/:idAnggota',
                element: <KontribusiMahasiswaDetailMhs />,
              },
              {
                path: ':namaMatkul/:idMatkul/:namaSg/:idSg/:namaTopik/:idTopik',
                element: <TopikPembahasanDetailMhs />,
              },
              {
                path: ':namaMatkul/:idMatkul/:namaSg/:idSg/:namaTopik/:idTopik/new-discussion',
                element: <AddPostMhs />,
              },
              {
                path: ':namaMatkul/:idMatkul/:namaSg/:idSg/:namaTopik/:idTopik/edit-discussion/:idPost',
                element: <EditPostMhs />,
              },
            ],
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
