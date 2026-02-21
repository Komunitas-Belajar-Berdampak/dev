import { useQuery } from "@tanstack/react-query";
import { MaterialService } from "../services/material.service";

export function useMaterialsByCourse(idCourse?: string) {
  return useQuery({
    queryKey: ["materials-by-course", idCourse],
    queryFn: () => MaterialService.getMaterialsByCourse(idCourse as string),
    enabled: !!idCourse,
  });
}