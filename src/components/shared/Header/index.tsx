import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Icon } from '@iconify/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Fragment } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { logout } from '@/api/auth';
import { removeToken, removeUser } from '@/lib/authStorage';
import menuItems from './menu-items';

const Header = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

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
    <header className='w-full z-10 '>
      <nav className='w-full py-2.5 px-4 flex border-b border-primary justify-between items-center '>
        <SidebarTrigger className=' text-primary' />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={'outline'} size={'icon'} className='shadow-none'>
              <Icon icon='iconamoon:profile-fill' className='text-primary' width={20} />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align='start' className='w-46'>
            <DropdownMenuGroup>
              {menuItems.map((item, index) => {
                const isLast = index === menuItems.length - 1;
                const isLogout = item.title?.toLowerCase() === 'logout';

                return (
                  <Fragment key={`${item.title}-${index}`}>
                    {isLast && <DropdownMenuSeparator />}

                    {isLogout ? (
                      <DropdownMenuItem disabled={logoutMutation.isPending} onSelect={() => logoutMutation.mutate()}>
                        <span className='flex items-center gap-2 w-full text-foreground/70'>{logoutMutation.isPending ? 'Logging out...' : item.title}</span>
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem asChild>
                        <Link to={item.link} className='flex items-center gap-2 w-full text-foreground/70'>
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
      </nav>
    </header>
  );
};

export default Header;
