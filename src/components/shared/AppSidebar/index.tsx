import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { getCurrentUserRole } from '@/lib/auth';
import { Link, useLocation } from 'react-router-dom';
import menuItems from './menu-items';

const AppSidebar = () => {
  const location = useLocation();

  const role = getCurrentUserRole();

  const filteredMenuItems = menuItems.filter((item) => item.role.includes(role));

  return (
    <Sidebar collapsible='icon' className='border-black/10'>
      <SidebarHeader>
        <SidebarMenu className='py-4 px-2'>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size={'lg'}>
              <Link to={'/'} className='flex gap-3'>
                <div className='size-8 flex justify-center items-center rounded-md bg-primary' />
                <span className='font-bold text-xl md:group-data-[collapsible=icon]:hidden'>KBB</span>
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
