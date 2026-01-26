import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Link } from 'react-router-dom';
import { Fragment } from 'react/jsx-runtime';

type TitleProps = {
  title: string;
  items?: BreadcrumbItemType[];
};

type BreadcrumbItemType = {
  label: string;
  href?: string;
};

const Title = (props: TitleProps) => {
  const { title, items = [] } = props;

  const hasItems = items.length > 0;

  return (
    <div className='flex flex-col gap-4'>
      <h1 className='text-2xl font-bold text-primary tracking-wide'>{title}</h1>

      {hasItems && (
        <Breadcrumb>
          <BreadcrumbList>
            {items.map((item, index) => {
              const isLast = index === items.length - 1;

              return (
                <Fragment key={index}>
                  <BreadcrumbItem>
                    {!isLast && item.href ? (
                      <BreadcrumbLink asChild>
                        <Link to={item.href} className='text-primary font-medium tracking-wide'>
                          {item.label}
                        </Link>
                      </BreadcrumbLink>
                    ) : (
                      <BreadcrumbPage className='text-primary font-semibold tracking-wide'>{item.label}</BreadcrumbPage>
                    )}
                  </BreadcrumbItem>

                  {!isLast && <BreadcrumbSeparator />}
                </Fragment>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      )}
    </div>
  );
};

export default Title;
