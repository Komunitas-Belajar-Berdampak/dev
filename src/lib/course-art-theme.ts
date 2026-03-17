export type CourseArtVariant = {
  wrapper: string;
  icon: string;
  iconClass: string;
  circleWrapper: string;
  circleDecorPrimary: string;
  circleDecorSecondary: string;
  circleIconClass: string;
};

const VARIANTS: CourseArtVariant[] = [
  {
    wrapper: 'bg-gradient-to-br from-purple-300 via-fuchsia-200 to-blue-200',
    icon: 'mdi:shape-outline',
    iconClass: 'text-5xl text-purple-800/80',
    circleWrapper: 'bg-purple',
    circleDecorPrimary: 'bg-white/35',
    circleDecorSecondary: 'bg-purple-950/35',
    circleIconClass: 'text-white/90',
  },
  {
    wrapper: 'bg-gradient-to-br from-emerald-200 via-teal-200 to-sky-200',
    icon: 'mdi:triangle-outline',
    iconClass: 'text-5xl text-emerald-800/80',
    circleWrapper: 'bg-gradient-to-br from-emerald-200 via-teal-200 to-sky-200',
    circleDecorPrimary: 'bg-white/35',
    circleDecorSecondary: 'bg-emerald-950/15',
    circleIconClass: 'text-emerald-950/60',
  },
  {
    wrapper: 'bg-gradient-to-br from-amber-200 via-orange-200 to-rose-200',
    icon: 'mdi:hexagon-multiple-outline',
    iconClass: 'text-5xl text-orange-800/80',
    circleWrapper: 'bg-gradient-to-br from-amber-200 via-orange-200 to-rose-200',
    circleDecorPrimary: 'bg-white/35',
    circleDecorSecondary: 'bg-orange-950/15',
    circleIconClass: 'text-orange-950/60',
  },
  {
    wrapper: 'bg-gradient-to-br from-slate-200 via-indigo-200 to-violet-200',
    icon: 'mdi:circle-outline',
    iconClass: 'text-5xl text-indigo-800/80',
    circleWrapper: 'bg-gradient-to-br from-slate-200 via-indigo-200 to-violet-200',
    circleDecorPrimary: 'bg-white/35',
    circleDecorSecondary: 'bg-indigo-950/15',
    circleIconClass: 'text-indigo-950/60',
  },
  {
    wrapper: 'bg-gradient-to-br from-pink-200 via-rose-200 to-yellow-200',
    icon: 'mdi:rhombus-split-outline',
    iconClass: 'text-5xl text-rose-800/80',
    circleWrapper: 'bg-gradient-to-br from-pink-200 via-rose-200 to-yellow-200',
    circleDecorPrimary: 'bg-white/35',
    circleDecorSecondary: 'bg-rose-950/15',
    circleIconClass: 'text-rose-950/60',
  },
  {
    wrapper: 'bg-gradient-to-br from-cyan-200 via-sky-200 to-indigo-200',
    icon: 'mdi:octagon-outline',
    iconClass: 'text-5xl text-cyan-800/80',
    circleWrapper: 'bg-gradient-to-br from-cyan-200 via-sky-200 to-indigo-200',
    circleDecorPrimary: 'bg-white/35',
    circleDecorSecondary: 'bg-cyan-950/15',
    circleIconClass: 'text-cyan-950/60',
  },
  {
    wrapper: 'bg-gradient-to-br from-lime-200 via-green-200 to-emerald-200',
    icon: 'mdi:pentagon-outline',
    iconClass: 'text-5xl text-green-800/80',
    circleWrapper: 'bg-gradient-to-br from-lime-200 via-green-200 to-emerald-200',
    circleDecorPrimary: 'bg-white/35',
    circleDecorSecondary: 'bg-green-950/15',
    circleIconClass: 'text-green-950/60',
  },
  {
    wrapper: 'bg-gradient-to-br from-red-200 via-pink-200 to-purple-200',
    icon: 'mdi:square-outline',
    iconClass: 'text-5xl text-red-800/70',
    circleWrapper: 'bg-gradient-to-br from-red-200 via-pink-200 to-purple-200',
    circleDecorPrimary: 'bg-white/35',
    circleDecorSecondary: 'bg-red-950/15',
    circleIconClass: 'text-red-950/60',
  },
  {
    wrapper: 'bg-gradient-to-br from-blue-200 via-cyan-200 to-emerald-200',
    icon: 'mdi:vector-polygon',
    iconClass: 'text-5xl text-sky-800/80',
    circleWrapper: 'bg-gradient-to-br from-blue-200 via-cyan-200 to-emerald-200',
    circleDecorPrimary: 'bg-white/35',
    circleDecorSecondary: 'bg-sky-950/15',
    circleIconClass: 'text-sky-950/60',
  },
  {
    wrapper: 'bg-gradient-to-br from-violet-200 via-fuchsia-200 to-rose-200',
    icon: 'mdi:star-four-points-outline',
    iconClass: 'text-5xl text-fuchsia-800/75',
    circleWrapper: 'bg-gradient-to-br from-violet-200 via-fuchsia-200 to-rose-200',
    circleDecorPrimary: 'bg-white/35',
    circleDecorSecondary: 'bg-fuchsia-950/15',
    circleIconClass: 'text-fuchsia-950/60',
  },
  {
    wrapper: 'bg-gradient-to-br from-stone-200 via-amber-100 to-lime-200',
    icon: 'mdi:triangle',
    iconClass: 'text-5xl text-amber-800/75',
    circleWrapper: 'bg-gradient-to-br from-stone-200 via-amber-100 to-lime-200',
    circleDecorPrimary: 'bg-white/35',
    circleDecorSecondary: 'bg-amber-950/15',
    circleIconClass: 'text-amber-950/60',
  },
  {
    wrapper: 'bg-gradient-to-br from-slate-300 via-zinc-200 to-blue-200',
    icon: 'mdi:vector-square',
    iconClass: 'text-5xl text-slate-700/80',
    circleWrapper: 'bg-gradient-to-br from-slate-300 via-zinc-200 to-blue-200',
    circleDecorPrimary: 'bg-white/35',
    circleDecorSecondary: 'bg-slate-950/20',
    circleIconClass: 'text-slate-900/65',
  },
];

function hashStringToIndex(s: string, mod: number) {
  let hash = 0;
  for (let i = 0; i < s.length; i++) {
    hash = (hash * 31 + s.charCodeAt(i)) >>> 0;
  }
  return hash % mod;
}

export function getCourseArtVariant(seed: string): CourseArtVariant {
  return VARIANTS[hashStringToIndex(seed || 'seed', VARIANTS.length)];
}
