export type StudyGroupVariant = {
  circleWrapper: string;
  circleDecorPrimary: string;
  circleDecorSecondary: string;
  circleIcon: string;
  circleIconClass: string;
};

const VARIANTS: StudyGroupVariant[] = [
  {
    circleWrapper: 'bg-gradient-to-br from-primary via-purple to-tertiary',
    circleDecorPrimary: 'bg-white/25',
    circleDecorSecondary: 'bg-black/30',
    circleIcon: 'mdi:triangle-outline',
    circleIconClass: 'text-white/90',
  },
  {
    circleWrapper: 'bg-gradient-to-br from-primary via-tertiary to-primary/85',
    circleDecorPrimary: 'bg-white/20',
    circleDecorSecondary: 'bg-black/35',
    circleIcon: 'mdi:square-outline',
    circleIconClass: 'text-primary-foreground/90',
  },
  {
    circleWrapper: 'bg-gradient-to-br from-purple via-primary to-tertiary',
    circleDecorPrimary: 'bg-white/25',
    circleDecorSecondary: 'bg-black/30',
    circleIcon: 'mdi:circle-outline',
    circleIconClass: 'text-primary-foreground/90',
  },
  {
    circleWrapper: 'bg-gradient-to-br from-tertiary via-primary to-purple',
    circleDecorPrimary: 'bg-white/20',
    circleDecorSecondary: 'bg-black/35',
    circleIcon: 'mdi:octagon-outline',
    circleIconClass: 'text-primary-foreground/90',
  },
  {
    circleWrapper: 'bg-gradient-to-br from-purple via-tertiary to-primary',
    circleDecorPrimary: 'bg-white/25',
    circleDecorSecondary: 'bg-black/30',
    circleIcon: 'mdi:star-four-points-outline',
    circleIconClass: 'text-primary-foreground/90',
  },
  {
    circleWrapper: 'bg-gradient-to-br from-primary/90 via-purple to-primary',
    circleDecorPrimary: 'bg-white/20',
    circleDecorSecondary: 'bg-black/35',
    circleIcon: 'mdi:rhombus-outline',
    circleIconClass: 'text-primary-foreground/90',
  },
  {
    circleWrapper: 'bg-gradient-to-br from-tertiary via-primary to-tertiary/85',
    circleDecorPrimary: 'bg-white/20',
    circleDecorSecondary: 'bg-black/35',
    circleIcon: 'mdi:pentagon-outline',
    circleIconClass: 'text-primary-foreground/90',
  },
  {
    circleWrapper: 'bg-gradient-to-br from-accent via-secondary to-accent',
    circleDecorPrimary: 'bg-primary/15',
    circleDecorSecondary: 'bg-primary/20',
    circleIcon: 'mdi:rhombus-split-outline',
    circleIconClass: 'text-primary/80',
  },
  {
    circleWrapper: 'bg-gradient-to-br from-primary via-primary/85 to-purple',
    circleDecorPrimary: 'bg-white/20',
    circleDecorSecondary: 'bg-black/35',
    circleIcon: 'mdi:hexagon-outline',
    circleIconClass: 'text-primary-foreground/90',
  },
  {
    circleWrapper: 'bg-gradient-to-br from-purple via-primary to-purple/85',
    circleDecorPrimary: 'bg-white/22',
    circleDecorSecondary: 'bg-black/32',
    circleIcon: 'mdi:triangle',
    circleIconClass: 'text-primary-foreground/90',
  },
  {
    circleWrapper: 'bg-gradient-to-br from-tertiary via-primary to-tertiary',
    circleDecorPrimary: 'bg-white/22',
    circleDecorSecondary: 'bg-black/34',
    circleIcon: 'mdi:vector-square',
    circleIconClass: 'text-primary-foreground/90',
  },
  {
    circleWrapper: 'bg-gradient-to-br from-secondary via-accent to-secondary',
    circleDecorPrimary: 'bg-primary/12',
    circleDecorSecondary: 'bg-primary/22',
    circleIcon: 'mdi:vector-polygon',
    circleIconClass: 'text-primary/75',
  },
];

function hashStringToIndex(s: string, mod: number) {
  let hash = 0;
  for (let i = 0; i < s.length; i++) {
    hash = (hash * 31 + s.charCodeAt(i)) >>> 0;
  }
  return hash % mod;
}

export function getStudyGroupVariant(seed: string): StudyGroupVariant {
  return VARIANTS[hashStringToIndex(seed || 'seed', VARIANTS.length)];
}
