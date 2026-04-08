import AuthLayout from '@/components/layouts/Auth';
import DefaultLayout from '@/components/layouts/Default';
import Dosen from '@/components/pages/Dosen/DosenCourses';
import AllPertemuanDashboard from '@/components/pages/Dosen/Matakuliah/Dashboard/AllPertemuanDashboard';
import DashboardPage from '@/components/pages/Dosen/Matakuliah/Dashboard/DashboardPage';
import PerPertemuanDashboard from '@/components/pages/Dosen/Matakuliah/Dashboard/PerPertemuanDashboard';
import PertemuanDashboardDetail from '@/components/pages/Dosen/Matakuliah/Dashboard/PertemuanDashboardDetail';
import DeskripsiPage from '@/components/pages/Dosen/Matakuliah/Deskripsi/DeskripsiPage';
import MatakuliahDetail from '@/components/pages/Dosen/Matakuliah/Detail/MatakuliahDetail';
import MatakuliahLayout from '@/components/pages/Dosen/Matakuliah/index';
import MahasiswaList from '@/components/pages/Dosen/Matakuliah/Mahasiswa/MahasiswaList';
import ViewNilaiMahasiswaPage from '@/components/pages/Dosen/Matakuliah/Mahasiswa/ViewNilaiMahasiswaPage';
import MateriTugasPage from '@/components/pages/Dosen/Matakuliah/MateriTugas/MateriTugasPage';
import PertemuanMateriTugasDetailPage from '@/components/pages/Dosen/Matakuliah/MateriTugas/PertemuanDetailPage';
import PertemuanDetail from '@/components/pages/Dosen/Matakuliah/Pertemuan/PertemuanDetail';
import EditNilaiPage from '@/components/pages/Dosen/Matakuliah/Submission/EditNilaiPage';
import ViewAllSubmissionPage from '@/components/pages/Dosen/Matakuliah/Submission/ViewAllSubmissionPage';
import ViewSubmissionPage from '@/components/pages/Dosen/Matakuliah/Submission/ViewSubmissionPage';
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
import MhsCourseLayout from '@/components/pages/Mahasiswa/Courses';
import MhsCourseDetailPage from '@/components/pages/Mahasiswa/Courses/components/MhsCourseDetailPage';
import MhsCoursePage from '@/components/pages/Mahasiswa/Courses/components/MhsCoursePage';
import MhsMeetingDetail from '@/components/pages/Mahasiswa/Courses/components/MhsMeetingDetail';
import MhsSubmissionPage from '@/components/pages/Mahasiswa/Courses/components/MhsSubmissionPage';
import MhsDashboard from '@/components/pages/Mahasiswa/Dashboard';
import MhsGradeLayout from '@/components/pages/Mahasiswa/Grades';
import MhsGradePage from '@/components/pages/Mahasiswa/Grades/components/MhsGradePage';
import MhsGradeDetail from '@/components/pages/Mahasiswa/Grades/detail';
import PrivateFileLayout from '@/components/pages/Mahasiswa/PrivateFile';
import PrivateFilePage from '@/components/pages/Mahasiswa/PrivateFile/components/PrivateFilePage';
import CreatePrivateFilePage from '@/components/pages/Mahasiswa/PrivateFile/create';
import EditPrivateFilePage from '@/components/pages/Mahasiswa/PrivateFile/edit';
import AddPostMhs from '@/components/pages/Mahasiswa/StudyGroup/AddPost';
import StudyGroupDetailMhs from '@/components/pages/Mahasiswa/StudyGroup/Detail';
import EditPostMhs from '@/components/pages/Mahasiswa/StudyGroup/EditPost';
import KontribusiMahasiswaDetailMhs from '@/components/pages/Mahasiswa/StudyGroup/Kontribusi';
import StudyGroupListMhs from '@/components/pages/Mahasiswa/StudyGroup/List';
import StudyGroupMainMhs from '@/components/pages/Mahasiswa/StudyGroup/Main';
import TopikPembahasanDetailMhs from '@/components/pages/Mahasiswa/StudyGroup/TopikDetail';
import ProfilePage from '@/components/pages/Profile';
import EditProfilePage from '@/components/pages/Profile/Edit';
import FakultasPage from '@/components/pages/SuperAdmin/Fakultas/FakultasPage';
import MatakuliahDetailPage from '@/components/pages/SuperAdmin/Matakuliah/MatakuliahDetailPage';
import MatakuliahPage from '@/components/pages/SuperAdmin/Matakuliah/MatakuliahPage';
import MatakuliahTable from '@/components/pages/SuperAdmin/Matakuliah/MatakuliahTable';
import ProgramStudiPage from '@/components/pages/SuperAdmin/ProgramStudi/ProgramStudiPage';
import SuperAdmin from '@/components/pages/SuperAdmin/SuperAdmin';
import TahunAkademikDanSemesterDetailPage from '@/components/pages/SuperAdmin/TahunAkademikDanSemester/TahunAkademikDanSemesterDetailPage';
import TahunAkademikDanSemesterPage from '@/components/pages/SuperAdmin/TahunAkademikDanSemester/TahunAkademikDanSemesterPage';
import TahunAkademikDanSemesterTable from '@/components/pages/SuperAdmin/TahunAkademikDanSemester/TahunAkademikDanSemesterTable';
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
        path: '/profile',
        element: <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'DOSEN', 'MAHASISWA']} />,
        children: [
          {
            path: '',
            index: true,
            element: <ProfilePage />,
          },
          {
            path: ':id',
            element: <ProfilePage />,
          },
          {
            path: 'edit',
            element: <EditProfilePage />,
          },
        ],
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
            children: [
              {
                index: true,
                element: <TahunAkademikDanSemesterTable />,
              },
              {
                path: ':id',
                element: <TahunAkademikDanSemesterDetailPage />,
              },
            ],
          },
          {
            path: 'courses',
            element: <MatakuliahPage />,
            children: [
              { index: true, element: <MatakuliahTable /> },
              { path: ':id', element: <MatakuliahDetailPage /> },
            ],
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
                path: ':id/pertemuan/:assignmentId/submissions',
                element: <ViewSubmissionPage />,
              },
              {
                path: ':id/pertemuan/:assignmentId/submissions/all',
                element: <ViewAllSubmissionPage />,
              },
              {
                path: ':id/pertemuan/:assignmentId/submissions/all/edit',
                element: <EditNilaiPage />,
              },
              {
                path: ':id/mahasiswa',
                element: <MahasiswaList />,
              },
              {
                path: ':id/mahasiswa/:idMahasiswa/nilai',
                element: <ViewNilaiMahasiswaPage />,
              },
              {
                path: ':id/deskripsi',
                element: <DeskripsiPage />,
              },
              {
                path: ':id/materi-tugas',
                element: <MateriTugasPage />,
                children: [
                  {
                    index: true,
                  },
                  {
                    path: 'pertemuan/:pertemuanId',
                    element: <PertemuanMateriTugasDetailPage />,
                  },
                ],
              },
              {
                path: ':id/dashboard',
                element: <DashboardPage />,
              },
              {
                path: ':id/dashboard/all',
                element: <AllPertemuanDashboard />,
              },
              {
                path: ':id/dashboard/per-pertemuan',
                element: <PerPertemuanDashboard />,
              },
              {
                path: ':id/dashboard/per-pertemuan/:pertemuanId',
                element: <PertemuanDashboardDetail />,
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
            element: <MhsDashboard />,
          },
          {
            path: 'courses',
            element: <MhsCourseLayout />,
            children: [
              {
                index: true,
                element: <MhsCoursePage />,
              },
              {
                path: ':id',
                element: <MhsCourseDetailPage />,
              },
              {
                path: ':idMatkul/meeting/:idMeeting',
                element: <MhsMeetingDetail />,
              },
              {
                path: ':idMatkul/meeting/:idMeeting/submission/:idAssignment',
                element: <MhsSubmissionPage />,
              },
            ],
          },
          {
            path: 'private-file',
            element: <PrivateFileLayout />,
            children: [
              {
                index: true,
                element: <PrivateFilePage />,
              },
              {
                path: 'create',
                element: <CreatePrivateFilePage />,
              },
              {
                path: 'edit/:id',
                element: <EditPrivateFilePage />,
              },
            ],
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
          {
            path: 'grades',
            element: <MhsGradeLayout />,
            children: [
              {
                index: true,
                element: <MhsGradePage />,
              },
              {
                path: 'courses/:id',
                element: <MhsGradeDetail />,
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
