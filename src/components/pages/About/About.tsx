import { getToken, getUser } from '@/lib/authStorage';
import { roleHomePath } from '@/lib/homepath';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AboutHeroHeader from './components/AboutHeroHeader';
import AboutMainContent from './components/AboutMainContent';
import AboutSectionNavigation from './components/AboutSectionNavigation';
import { ABOUT_BACK_FALLBACK_GUEST_PATH, ABOUT_NAV_ITEMS } from './constants';

const About = () => {
  const [activeSection, setActiveSection] = useState<string>(ABOUT_NAV_ITEMS[0]?.id ?? '');
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    const token = getToken();
    const user = getUser();
    if (token && user) {
      navigate(roleHomePath(user.namaRole), { replace: true });
      return;
    }

    navigate(ABOUT_BACK_FALLBACK_GUEST_PATH, { replace: true });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visibleEntry?.target?.id) {
          setActiveSection(visibleEntry.target.id);
        }
      },
      {
        rootMargin: '-25% 0px -55% 0px',
        threshold: [0.2, 0.4, 0.6],
      },
    );

    ABOUT_NAV_ITEMS.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className='min-h-screen bg-background text-foreground'>
      <AboutHeroHeader onBack={handleBack} />

      <div className='mx-auto w-full max-w-[1200px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14'>
        <AboutSectionNavigation mode='mobile' sections={ABOUT_NAV_ITEMS} activeSection={activeSection} />

        <div className='grid grid-cols-1 gap-8 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-12'>
          <aside className='hidden lg:block'>
            <AboutSectionNavigation mode='desktop' sections={ABOUT_NAV_ITEMS} activeSection={activeSection} />
          </aside>

          <main className='space-y-8'>
            <AboutMainContent />
          </main>
        </div>
      </div>
    </div>
  );
};

export default About;
