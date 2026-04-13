import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Icon } from '@iconify/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Fragment } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { logout } from '@/api/auth';
import { getUser, removeToken, removeUser } from '@/lib/authStorage';
import menuItems from './menu-items';

const Header = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const user = getUser();
  const nama = user?.nama;

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSettled: () => {
      removeToken();
      removeUser();
      queryClient.clear();
      navigate('/auth/login', { replace: true });
    },
  });

  return (
    <header className='w-full z-10 sticky top-0 bg-background/90 backdrop-blur-lg'>
      <nav className='w-full py-2.5 px-4 flex border-b border-primary justify-between items-center '>
        <SidebarTrigger className=' text-primary' />

        <div className='flex flex-row gap-6  items-center'>
          <p className='text-primary font-semibold text-sm md:text-base'>
            Hello, <span className='underline underline-offset-4'>{nama}</span>!
          </p>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={'outline'} size={'icon'} className='shadow-none'>
                <Icon icon='iconamoon:profile-fill' className='text-primary' width={20} />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align='start' className='w-46'>
              <DropdownMenuGroup>
                {menuItems.map((item, index) => {
                  const isLast = index === menuItems.length - 2;
                  const isLogout = item.title?.toLowerCase() === 'logout';

                  return (
                    <Fragment key={`${item.title}-${index}`}>
                      {isLast && <DropdownMenuSeparator />}

                      {isLogout ? (
                        <DropdownMenuItem disabled={logoutMutation.isPending} onSelect={() => logoutMutation.mutate()}>
                          <span className='text-xs md:text-sm  flex items-center gap-2 w-full text-foreground/70'>{logoutMutation.isPending ? 'Logging out...' : item.title}</span>
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem asChild>
                          <Link to={item.link} className='text-xs md:text-sm flex items-center gap-2 w-full text-foreground/70'>
                            {item.title}
                          </Link>
                        </DropdownMenuItem>
                      )}
                    </Fragment>
                  );
                })}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
    </header>
  );
};

export default Header;
