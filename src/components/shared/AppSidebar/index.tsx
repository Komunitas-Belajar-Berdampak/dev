import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar';
import { getUser } from '@/lib/authStorage';
import { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import menuItems from './menu-items';

const AppSidebar = () => {
  const location = useLocation();
  const { isMobile, setOpen, setOpenMobile } = useSidebar();
  const previousPathRef = useRef(location.pathname);

  const user = getUser();

  const filteredMenuItems = menuItems.filter((item) => user?.namaRole && item.role.includes(user.namaRole));

  useEffect(() => {
    const previousPath = previousPathRef.current;
    const currentPath = location.pathname;
    if (previousPath === currentPath) return;

    if (isMobile) {
      setOpenMobile(false);
    } else {
      setOpen(false);
    }

    previousPathRef.current = currentPath;
  }, [isMobile, location.pathname, setOpen, setOpenMobile]);

  return (
    <Sidebar collapsible='icon' className='border-black/10'>
      <SidebarHeader>
        <SidebarMenu className='py-4 px-2'>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size={'lg'}>
              <Link to={'/'} className='flex gap-3'>
                <img src='/img/logo.png' alt='logo komunitas belajar berdapampak' className='size-8 flex justify-center items-center rounded-md bg-primary' />
                <span className='font-bold text-xs leading-tight md:group-data-[collapsible=icon]:hidden'>
                  <span className='block'>Komunitas</span>
                  <span className='block'>Belajar Berdampak</span>
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className='px-2'>
        <SidebarGroup>
          <SidebarMenu>
            {filteredMenuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <SidebarMenuItem key={item.title} className='py-1'>
                  <SidebarMenuButton asChild isActive={isActive}>
                    <Link to={item.path} className='flex items-center gap-4'>
                      {item.icon}
                      <span className='text-sm tracking-wide hover:font-semibold'>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter></SidebarFooter>
    </Sidebar>
  );
};
export default AppSidebar;
