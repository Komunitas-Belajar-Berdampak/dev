import { useEffect, useRef, useState, type ReactNode } from 'react';

const STICKY_TOP_OFFSET = 64;

type TopikDetailStickyToolbarProps = {
  children: ReactNode;
};

const TopikDetailStickyToolbar = ({ children }: TopikDetailStickyToolbarProps) => {
  const toolbarRef = useRef<HTMLDivElement>(null);
  const [isStuck, setIsStuck] = useState(false);

  useEffect(() => {
    let animationFrame = 0;

    const updateStuckState = () => {
      window.cancelAnimationFrame(animationFrame);

      animationFrame = window.requestAnimationFrame(() => {
        const toolbar = toolbarRef.current;
        if (!toolbar) return;

        setIsStuck(toolbar.getBoundingClientRect().top <= STICKY_TOP_OFFSET);
      });
    };

    updateStuckState();
    window.addEventListener('scroll', updateStuckState, { passive: true });
    window.addEventListener('resize', updateStuckState);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener('scroll', updateStuckState);
      window.removeEventListener('resize', updateStuckState);
    };
  }, []);

  return (
    <div ref={toolbarRef} className='topik-detail-sticky-toolbar' data-stuck={isStuck}>
      {children}
    </div>
  );
};

export default TopikDetailStickyToolbar;
