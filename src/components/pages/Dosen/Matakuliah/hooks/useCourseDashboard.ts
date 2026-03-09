import { useQuery } from "@tanstack/react-query";
import { CourseDashboardService } from "../services/courseDashboard.service";

export function useCourseDashboard(idCourse?: string) {
  return useQuery({
    queryKey: ["course-dashboard", idCourse],
    queryFn: () => CourseDashboardService.getCourseDashboard(idCourse as string),
    enabled: Boolean(idCourse),
  });
}

export function useMeetingDashboard(idCourse?: string, pertemuan?: number | string) {
  return useQuery({
    queryKey: ["meeting-dashboard", idCourse, pertemuan],
    queryFn: () => CourseDashboardService.getMeetingDashboard(idCourse as string, pertemuan as number),
    enabled: Boolean(idCourse) && pertemuan !== undefined,
  });
}