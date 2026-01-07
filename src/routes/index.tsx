import { createBrowserRouter, Navigate } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import SuperAdminLayout from "@/components/layouts/SuperAdmin";
import SuperAdmin from "@/components/pages/SuperAdmin/SuperAdmin";
import UserPage from "@/components/pages/SuperAdmin/Users/UserPage";
import FakultasPage from "@/components/pages/SuperAdmin/Fakultas/FakultasPage";
import ProgramStudiPage from "@/components/pages/SuperAdmin/ProgramStudi/ProgramStudiPage";
import TahunAkademikDanSemesterPage from "@/components/pages/SuperAdmin/TahunAkademikDanSemester/TahunAkademikDanSemesterPage";
import MatakuliahPage from "@/components/pages/SuperAdmin/Matakuliah/MatakuliahPage";
import DosenLayout from "@/components/layouts/Dosen";
import Dosen from "@/components/pages/Dosen/Dosen";
// import DosenDashboard from "@/components/pages/Dosen/Dashboard/DosenDashboard";
// import DosenCourses from "@/components/pages/Dosen/Courses/DosenCourses";
// import DosenStudyGroups from "@/components/pages/Dosen/StudyGroups/DosenStudyGroups";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/super-admin" replace />,
  },
  {
    path: "/super-admin",
    element: (
      <ProtectedRoute allowedRoles={["admin"]}>
        <SuperAdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <SuperAdmin />,
      },
      {
        path: "users",
        element: <UserPage />,
      },
      {
        path: "faculties",
        element: <FakultasPage />,
      },
      {
        path: "majors",
        element: <ProgramStudiPage />,
      },
      {
        path: "academic_terms",
        element: <TahunAkademikDanSemesterPage />,
      },
      {
        path: "courses",
        element: <MatakuliahPage />,
      },
    ],
  },

  {
  path: "/dosen",
    element: (
      <ProtectedRoute allowedRoles={["dosen"]}>
        <DosenLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Dosen/>,
      },
      // {
      //   path: "dashboard",
      //   element: <DosenDashboard />,
      // },
      // {
      //   path: "courses",
      //   element: <DosenCourses />,
      // },
      // {
      //   path: "study-groups",
      //   element: <DosenStudyGroups />,
      // }
    ],
  }

]);

export default router;
