import { Outlet } from "react-router-dom";
interface MatakuliahContext {
  title?: string;
  breadcrumbs?: { label: string; href?: string }[];
}

export default function MatakuliahLayout() {
  return (
    <div
      className="
        w-full
        max-w-[1400px]
        mx-auto
        px-4 sm:px-6 lg:px-8
        space-y-6 sm:space-y-8
      "
    >
      <Outlet
        context={{
          title: "",
          breadcrumbs: [],
        } satisfies MatakuliahContext}
      />
    </div>
  );
}
