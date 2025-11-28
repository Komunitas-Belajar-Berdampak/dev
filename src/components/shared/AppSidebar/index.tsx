import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { Link } from 'react-router-dom';
import menuItems from './menu-items';

const AppSidebar = () => {
  return (
    <Sidebar collapsible='icon' className='border-black/10'>
      <SidebarHeader>
        <SidebarMenu className='py-4 px-2'>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size={'lg'}>
              <Link to={'/'} className='flex gap-3'>
                {/* buat logo */}
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
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.title} className='py-1'>
                <SidebarMenuButton asChild>
                  <Link to={item.path} className='flex items-center gap-4'>
                    {item.icon}
                    <span className='text-sm font-medium tracking-wide hover:font-semibold'>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter></SidebarFooter>
    </Sidebar>
  );
};
export default AppSidebar;
