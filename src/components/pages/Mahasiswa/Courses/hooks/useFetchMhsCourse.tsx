import { getCourses } from "@/api/course";
import { parseDeskripsi } from "@/components/pages/Dosen/Matakuliah/hooks/useMatakuliahLayout";
import { getUser } from "@/lib/authStorage";
import { useQuery } from "@tanstack/react-query";

interface CourseFilters {
  kelas?: string;
  periode?: string;
  status?: string;
  sks?: string;
}

const useFetchMhsCourse = (filters: CourseFilters = {}) => {
  const user = getUser();

  const {
    data,
    isPending: coursePending,
    error,
    refetch,
  } = useQuery({
    queryKey: ["mhs-course", user?.nrp, filters],
    queryFn: async () => {
      const courses = await getCourses({
        nrp: user?.nrp,
        ...filters,
      });

      return (courses.data ?? []).map((course) => ({
        ...course,
        deskripsi: parseDeskripsi(course.deskripsi),
      }));
    },
    enabled: !!user?.nrp,
  });

  return {
    courses: data ?? [],
    coursePending,
    error,
    refetch,
  };
};

export default useFetchMhsCourse;
