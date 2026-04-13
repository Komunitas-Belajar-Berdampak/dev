import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { ABOUT_BACK_BUTTON_LABEL, ABOUT_HERO } from '../constants';

type AboutHeroHeaderProps = {
  onBack: () => void;
};

const AboutHeroHeader = ({ onBack }: AboutHeroHeaderProps) => {
  return (
    <header className='relative overflow-hidden border-b border-border bg-secondary/40'>
      <div className='pointer-events-none absolute -left-16 top-10 h-52 w-52 rounded-full bg-primary/15 blur-3xl' />
      <div className='pointer-events-none absolute -right-12 bottom-6 h-44 w-44 rounded-full bg-tertiary/15 blur-3xl' />

      <div className='relative mx-auto w-full max-w-[1200px] px-4 pb-12 pt-10 sm:px-6 lg:px-8 lg:pb-16 lg:pt-12'>
        <Button type='button' variant='ghost' size='sm' onClick={onBack} className='border text-primary shadow-sm text-sm'>
          <ArrowLeft className='size-4' />
          {ABOUT_BACK_BUTTON_LABEL}
        </Button>

        <p className='mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-primary'>{ABOUT_HERO.eyebrow}</p>
        <h1 className='mt-4 max-w-4xl text-3xl font-bold tracking-wide text-primary sm:text-4xl'>{ABOUT_HERO.title}</h1>
        <p className='mt-5 max-w-3xl text-sm leading-7 text-foreground/80 sm:leading-8'>{ABOUT_HERO.description}</p>
      </div>
    </header>
  );
};

export default AboutHeroHeader;
