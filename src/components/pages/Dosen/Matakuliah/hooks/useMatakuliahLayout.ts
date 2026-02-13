import { useOutletContext } from "react-router-dom";

export interface MatakuliahLayoutContext {
  title?: string;
  breadcrumbs?: { label: string; href?: string }[];
}

export function useMatakuliahLayout() {
  return useOutletContext<MatakuliahLayoutContext>();
}
