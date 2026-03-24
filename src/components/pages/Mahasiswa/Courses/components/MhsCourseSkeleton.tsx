function SkeletonBlock({ className = "" }: { className?: string }) {
  return (
    <div
      className={["animate-pulse rounded-md bg-gray-200/80", className].join(
        " ",
      )}
    />
  );
}

function CourseCardSkeleton() {
  return (
    <div className="flex flex-col rounded-2xl border-2 border-black bg-white shadow-[5px_5px_0_0_#000] overflow-hidden">
      <div className="h-32 bg-gray-200/80 animate-pulse" />
      <div className="flex-1 p-4 space-y-3">
        <SkeletonBlock className="h-4 w-[80%]" />
        <SkeletonBlock className="h-3 w-full" />
        <SkeletonBlock className="h-3 w-[92%]" />
        <div className="flex flex-wrap gap-3 pt-1">
          <SkeletonBlock className="h-3 w-14" />
          <SkeletonBlock className="h-3 w-20" />
          <SkeletonBlock className="h-3 w-28" />
        </div>
        <div className="flex items-center gap-2 pt-1">
          <SkeletonBlock className="h-3 w-4 rounded-full" />
          <SkeletonBlock className="h-3 w-36" />
        </div>
      </div>
      <div className="p-4 pt-0">
        <SkeletonBlock className="h-10 w-full rounded-md" />
      </div>
    </div>
  );
}

export default function CoursesSkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 py-8">
      {Array.from({ length: count }).map((_, i) => (
        <CourseCardSkeleton key={i} />
      ))}
    </div>
  );
}
