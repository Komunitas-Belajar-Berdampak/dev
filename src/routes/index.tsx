import { createBrowserRouter, Navigate } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import SuperAdminLayout from "@/components/layouts/SuperAdmin";
import SuperAdmin from "@/components/pages/SuperAdmin/SuperAdmin";
import UserPage from "@/components/pages/SuperAdmin/Users/UserPage";
import FakultasPage from "@/components/pages/SuperAdmin/Fakultas/FakultasPage";
import ProgramStudiPage from "@/components/pages/SuperAdmin/ProgramStudi/ProgramStudiPage";
import TahunAkademikDanSemesterPage from "@/components/pages/SuperAdmin/TahunAkademikDanSemester/TahunAkademikDanSemesterPage";
import MatakuliahPage from "@/components/pages/SuperAdmin/Matakuliah/MatakuliahPage";

const router = createBrowserRouter([
  {
    path: "/", // 👈 ROOT
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
]);

export default router;
