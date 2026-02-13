import { Icon } from "@iconify/react";

type Variant = {
  wrapper: string;
  icon: string;
  iconClass: string;
};

const VARIANTS: Variant[] = [
  {
    wrapper: "bg-gradient-to-br from-purple-300 via-fuchsia-200 to-blue-200",
    icon: "mdi:shape-outline",
    iconClass: "text-5xl text-purple-800/80",
  },
  {
    wrapper: "bg-gradient-to-br from-emerald-200 via-teal-200 to-sky-200",
    icon: "mdi:vector-triangle",
    iconClass: "text-5xl text-emerald-800/80",
  },
  {
    wrapper: "bg-gradient-to-br from-amber-200 via-orange-200 to-rose-200",
    icon: "mdi:hexagon-multiple-outline",
    iconClass: "text-5xl text-orange-800/80",
  },
  {
    wrapper: "bg-gradient-to-br from-slate-200 via-indigo-200 to-violet-200",
    icon: "mdi:chart-bubble",
    iconClass: "text-5xl text-indigo-800/80",
  },
  {
    wrapper: "bg-gradient-to-br from-pink-200 via-rose-200 to-yellow-200",
    icon: "mdi:blur",
    iconClass: "text-5xl text-rose-800/80",
  },
  {
    wrapper: "bg-gradient-to-br from-cyan-200 via-sky-200 to-indigo-200",
    icon: "mdi:atom-variant",
    iconClass: "text-5xl text-cyan-800/80",
  },
  {
    wrapper: "bg-gradient-to-br from-lime-200 via-green-200 to-emerald-200",
    icon: "mdi:leaf-circle-outline",
    iconClass: "text-5xl text-green-800/80",
  },
  {
    wrapper: "bg-gradient-to-br from-red-200 via-pink-200 to-purple-200",
    icon: "mdi:shape-plus-outline",
    iconClass: "text-5xl text-red-800/70",
  },
];

function hashStringToIndex(s: string, mod: number) {
  // deterministic "random" based on id (stable per course)
  let hash = 0;
  for (let i = 0; i < s.length; i++) {
    hash = (hash * 31 + s.charCodeAt(i)) >>> 0;
  }
  return hash % mod;
}

export default function CourseCardArt({ seed }: { seed: string }) {
  const v = VARIANTS[hashStringToIndex(seed || "seed", VARIANTS.length)];

  return (
    <div
      className={[
        "h-32 flex items-center justify-center relative overflow-hidden",
        v.wrapper,
      ].join(" ")}
    >
      {/* abstract blobs */}
      <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-white/25 blur-sm" />
      <div className="absolute -bottom-12 -left-12 w-40 h-40 rounded-full bg-black/10 blur-md" />
      <div className="absolute top-6 left-8 w-16 h-16 rotate-12 rounded-2xl bg-white/20" />
      <div className="absolute bottom-6 right-10 w-10 h-10 rotate-45 rounded-xl bg-white/15" />

      {/* icon */}
      <Icon icon={v.icon} className={v.iconClass} />

      {/* subtle grain pattern */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.10] bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.35)_1px,transparent_1px)] [background-size:10px_10px]" />
    </div>
  );
}
