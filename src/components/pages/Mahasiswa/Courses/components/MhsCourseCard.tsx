import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import CourseCardArt from "@/components/shared/Courses/CourseCardArt";
import type { Course } from "@/types/course";

const MhsCourseCard = ({ course }: { course: Course }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col rounded-2xl border-2 border-black bg-white shadow-[5px_5px_0_0_#000] overflow-hidden">
      <CourseCardArt seed={course.id} />

      <div className="flex-1 p-4 space-y-2">
        <h3 className="font-bold text-sm leading-snug">
          {course.kodeMatkul} - {course.namaMatkul}
        </h3>
        <p className="text-xs text-gray-600 line-clamp-3">
          {course.deskripsi || "-"}
        </p>
        <div className="flex flex-wrap gap-3 text-[11px] text-gray-500">
          <span className="flex items-center gap-1">
            <Icon icon="mdi:book-outline" />
            {course.sks} SKS
          </span>
          <span className="flex items-center gap-1">
            <Icon icon="mdi:account-group-outline" />
            Kelas {course.kelas}
          </span>
          <span className="flex items-center gap-1">
            <Icon icon="mdi:school-outline" />
            {course.periode ?? "-"}
          </span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-gray-500">
          <Icon icon="mdi:account-outline" />
          <span className="line-clamp-1">
            {Array.isArray(course.pengajar)
              ? course.pengajar.map((p) => p.nama).join(", ")
              : (course.pengajar ?? "-")}
          </span>
        </div>
      </div>

      <div className="p-4 pt-0">
        <Button
          onClick={() => navigate(`/mahasiswa/courses/${course.id}`)}
          className="w-full bg-blue-900 text-white shadow-[3px_3px_0_0_#000] hover:translate-x-0.5 hover:translate-y-0.5 transition"
          type="button"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default MhsCourseCard;
