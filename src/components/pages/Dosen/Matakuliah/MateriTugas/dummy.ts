import type { Material, Assignment } from "../types";

export const dummyMaterials: Material[] = [
  {
    _id: "691c20d2306c2145928b1748",
    idMeeting: "691c208a7b173b778514124f",
    idCourse: "691c1f17306c2145928b173a",
    pathFile: "materials/IN243-A-2025/meet01/slide-bab1.pdf",
    namaFile: "slide-bab1.pdf",
    tipe: "application/pdf",
    status: "HIDE",
    createdAt: "2025-11-18T07:31:30.624+00:00",
    updatedAt: "2025-11-18T07:31:30.624+00:00",
    __v: 0,
  },
];

export const dummyAssignments: Assignment[] = [
  {
    _id: "692029e16ca638b7f9183731",
    idMeeting: "691c208a7b173b778514124f",
    judul: "Tugas 1 - Pendahuluan",
    statusTugas: false,
    tenggat: "2025-11-30T16:00:00.000+00:00",
    status: "VISIBLE",
    pathLampiran: "assignments/IN243-A/meet01/tugas1.pdf",
    createdAt: "2025-11-21T08:59:13.831+00:00",
    updatedAt: "2025-11-21T08:59:13.831+00:00",
    __v: 0,
  },
];