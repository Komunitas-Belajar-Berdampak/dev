import { cn } from '@/lib/cn';
import type { AboutNavItem } from '../constants';
import { ABOUT_NAV_TITLE } from '../constants';

type AboutSectionNavigationProps = {
  mode: 'mobile' | 'desktop';
  sections: AboutNavItem[];
  activeSection: string;
};

const AboutSectionNavigation = ({ mode, sections, activeSection }: AboutSectionNavigationProps) => {
  if (mode === 'mobile') {
    return (
      <nav className='mb-6 flex gap-2 overflow-x-auto pb-2 lg:hidden'>
        {sections.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            className={cn(
              'whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
              activeSection === section.id ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card text-foreground/80 hover:border-primary/40 hover:text-primary',
            )}
          >
            {section.label}
          </a>
        ))}
      </nav>
    );
  }

  return (
    <div className='sticky top-8 rounded-2xl border border-border bg-card p-4 shadow-sm'>
      <p className='px-2 text-xs font-semibold uppercase tracking-[0.14em] text-primary'>{ABOUT_NAV_TITLE}</p>
      <nav className='mt-3 space-y-1'>
        {sections.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            className={cn(
              'block rounded-lg border px-3 py-2 text-sm font-medium transition-all',
              activeSection === section.id ? 'border-primary bg-primary/10 text-primary' : 'border-transparent text-foreground/75 hover:border-primary/25 hover:bg-secondary/70 hover:text-primary',
            )}
          >
            {section.label}
          </a>
        ))}
      </nav>
    </div>
  );
};

export default AboutSectionNavigation;
