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
  {
    circleWrapper: 'bg-gradient-to-br from-primary via-purple to-primary/80',
    circleDecorPrimary: 'bg-white/24',
    circleDecorSecondary: 'bg-black/34',
    circleIcon: 'mdi:shape-plus-outline',
    circleIconClass: 'text-primary-foreground/90',
  },
  {
    circleWrapper: 'bg-gradient-to-br from-tertiary via-purple to-primary',
    circleDecorPrimary: 'bg-white/22',
    circleDecorSecondary: 'bg-black/32',
    circleIcon: 'mdi:cards-diamond-outline',
    circleIconClass: 'text-primary-foreground/90',
  },
  {
    circleWrapper: 'bg-gradient-to-br from-purple via-primary/95 to-tertiary',
    circleDecorPrimary: 'bg-white/24',
    circleDecorSecondary: 'bg-black/30',
    circleIcon: 'mdi:select-group',
    circleIconClass: 'text-primary-foreground/90',
  },
  {
    circleWrapper: 'bg-gradient-to-br from-primary/95 via-tertiary to-purple',
    circleDecorPrimary: 'bg-white/20',
    circleDecorSecondary: 'bg-black/35',
    circleIcon: 'mdi:graph-outline',
    circleIconClass: 'text-primary-foreground/90',
  },
  {
    circleWrapper: 'bg-gradient-to-br from-accent via-white to-secondary',
    circleDecorPrimary: 'bg-primary/12',
    circleDecorSecondary: 'bg-purple/18',
    circleIcon: 'mdi:orbit',
    circleIconClass: 'text-primary/80',
  },
  {
    circleWrapper: 'bg-gradient-to-br from-secondary via-accent to-purple/25',
    circleDecorPrimary: 'bg-white/45',
    circleDecorSecondary: 'bg-primary/20',
    circleIcon: 'mdi:hexagon-multiple-outline',
    circleIconClass: 'text-primary/80',
  },
  {
    circleWrapper: 'bg-gradient-to-br from-primary via-tertiary/90 to-purple/90',
    circleDecorPrimary: 'bg-white/23',
    circleDecorSecondary: 'bg-black/33',
    circleIcon: 'mdi:circle-slice-8',
    circleIconClass: 'text-primary-foreground/90',
  },
  {
    circleWrapper: 'bg-gradient-to-br from-purple via-tertiary to-primary/90',
    circleDecorPrimary: 'bg-white/24',
    circleDecorSecondary: 'bg-black/30',
    circleIcon: 'mdi:blur-radial',
    circleIconClass: 'text-primary-foreground/90',
  },
  {
    circleWrapper: 'bg-gradient-to-br from-tertiary/95 via-primary to-purple/85',
    circleDecorPrimary: 'bg-white/20',
    circleDecorSecondary: 'bg-black/36',
    circleIcon: 'mdi:scatter-plot-outline',
    circleIconClass: 'text-primary-foreground/90',
  },
  {
    circleWrapper: 'bg-gradient-to-br from-primary/90 via-purple/95 to-tertiary/90',
    circleDecorPrimary: 'bg-white/24',
    circleDecorSecondary: 'bg-black/34',
    circleIcon: 'mdi:relation-many-to-many',
    circleIconClass: 'text-primary-foreground/90',
  },
  {
    circleWrapper: 'bg-gradient-to-br from-secondary via-accent to-primary/20',
    circleDecorPrimary: 'bg-white/40',
    circleDecorSecondary: 'bg-primary/18',
    circleIcon: 'mdi:vector-combine',
    circleIconClass: 'text-primary/78',
  },
  {
    circleWrapper: 'bg-gradient-to-br from-primary via-tertiary to-primary',
    circleDecorPrimary: 'bg-white/22',
    circleDecorSecondary: 'bg-black/35',
    circleIcon: 'mdi:transit-connection-variant',
    circleIconClass: 'text-primary-foreground/90',
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
