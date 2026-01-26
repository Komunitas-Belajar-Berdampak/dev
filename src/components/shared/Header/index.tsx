import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Icon } from '@iconify/react';

import { Link } from 'react-router-dom';
import menuItems from './menu-items';

const Header = () => {
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
              {menuItems.map((item, index) => (
                <>
                  {index === menuItems.length - 1 && <DropdownMenuSeparator />}

                  <DropdownMenuItem key={index}>
                    <Link to={item.link} className='flex items-center gap-2 w-full text-foreground/70'>
                      {item.title}
                    </Link>
                  </DropdownMenuItem>
                </>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>
    </header>
  );
};

export default Header;
