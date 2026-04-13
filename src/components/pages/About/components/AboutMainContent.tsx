import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';
import { ABOUT_COMMUNITY_LINKS, ABOUT_CONTENT_SECTIONS, ABOUT_TEAM_SECTION, ABOUT_TECH_DOCS, ABOUT_TECH_LINK_SECTION } from '../constants';

const AboutMainContent = () => {
  return (
    <>
      {ABOUT_CONTENT_SECTIONS.map((section) => (
        <section key={section.id} id={section.id} className='scroll-mt-24 rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8'>
          <h2 className='text-2xl font-bold tracking-wide text-primary '>{section.title}</h2>

          <div className='mt-4 space-y-4 text-sm leading-7 text-foreground/85 sm:leading-8'>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}

            {section.id === 'teknologi' ? (
              <div className='space-y-4 pt-2'>
                <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
                  <Card className='bg-secondary/30'>
                    <CardHeader>
                      <CardTitle className='text-sm font-semibold uppercase tracking-[0.14em] text-primary'>{ABOUT_TECH_LINK_SECTION.communityTitle}</CardTitle>
                      <CardDescription className='text-xs text-foreground/70'>{ABOUT_TECH_LINK_SECTION.communityDescription}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className='space-y-3 text-sm leading-6 text-foreground/85'>
                        {ABOUT_COMMUNITY_LINKS.map((link) => (
                          <li key={link.href}>
                            <div className='hover:underline text-primary items-center gap-1.5 '>
                              <a href={link.href} target='_blank' rel='noreferrer' className='flex items-center gap-2 justify-start'>
                                <span>{link.label}</span>
                                <ExternalLink className='size-3.5' />
                              </a>
                            </div>
                            {link.description ? <p className='mt-1 text-xs text-foreground/70'>{link.description}</p> : null}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className='bg-secondary/30'>
                    <CardHeader>
                      <CardTitle className='text-sm font-semibold uppercase tracking-[0.14em] text-primary'>{ABOUT_TECH_LINK_SECTION.docsTitle}</CardTitle>
                      <CardDescription className='text-xs text-foreground/70'>{ABOUT_TECH_LINK_SECTION.docsDescription}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className='flex flex-wrap gap-2'>
                        {ABOUT_TECH_DOCS.map((doc) => (
                          <li key={doc.href}>
                            <Badge asChild variant='outline' className='hover:border-primary/40 hover:bg-primary/5'>
                              <a href={doc.href} target='_blank' rel='noreferrer'>
                                {doc.label}
                              </a>
                            </Badge>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : null}
          </div>
        </section>
      ))}

      <section id={ABOUT_TEAM_SECTION.id} className='scroll-mt-24 rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8'>
        <h2 className='text-2xl font-bold tracking-wide text-primary sm:text-3xl'>{ABOUT_TEAM_SECTION.title}</h2>

        <div className='mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2'>
          <div className='rounded-xl border border-border shadow-sm bg-secondary/35 p-4 sm:p-5'>
            <h3 className='text-sm font-semibold uppercase tracking-[0.14em] text-primary'>{ABOUT_TEAM_SECTION.mentorLabel}</h3>
            <p className='mt-3 text-sm leading-7 text-foreground/85'>{ABOUT_TEAM_SECTION.mentorName}</p>
          </div>

          <div className='rounded-xl border border-border shadow-sm bg-secondary/35 p-4 sm:p-5'>
            <h3 className='text-sm font-semibold uppercase tracking-[0.14em] text-primary'>{ABOUT_TEAM_SECTION.studentsLabel}</h3>
            <ul className='mt-3 space-y-2 text-sm leading-7 text-foreground/85 '>
              {ABOUT_TEAM_SECTION.students.map((student) => (
                <li key={student}>{student}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutMainContent;
