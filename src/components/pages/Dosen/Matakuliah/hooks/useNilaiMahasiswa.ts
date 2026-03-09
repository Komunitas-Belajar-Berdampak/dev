import { useQuery } from "@tanstack/react-query";
import { AssignmentService } from "../services/assignment.service";
import { SubmissionService } from "../services/submission.service";

export type NilaiMahasiswaItem = {
  id: string;
  judul: string;
  nilai: number | null;
  maxNilai: number;
  submittedAt: string | null;
};

async function fetchNilaiMahasiswa(
  idCourse: string,
  idMahasiswa: string
): Promise<NilaiMahasiswaItem[]> {
  const assignments = await AssignmentService.getAssignmentsByCourse(idCourse);

  const results = await Promise.all(
    assignments.map(async (assignment) => {
      try {
        const submissions = await SubmissionService.getAll(assignment.id);
        const milik = submissions.find((s) => s.mahasiswa?.id === idMahasiswa);
        return {
          id: assignment.id,
          judul: assignment.judul,
          nilai: milik?.grade ?? null,
          maxNilai: 100,
          submittedAt: milik?.submittedAt ?? null,
        } as NilaiMahasiswaItem;
      } catch {
        return {
          id: assignment.id,
          judul: assignment.judul,
          nilai: null,
          maxNilai: 100,
          submittedAt: null,
        } as NilaiMahasiswaItem;
      }
    })
  );

  return results;
}

export function useNilaiMahasiswa(idCourse?: string, idMahasiswa?: string) {
  return useQuery({
    queryKey: ["nilai-mahasiswa", idCourse, idMahasiswa],
    queryFn: () => fetchNilaiMahasiswa(idCourse as string, idMahasiswa as string),
    enabled: Boolean(idCourse) && Boolean(idMahasiswa),
  });
}