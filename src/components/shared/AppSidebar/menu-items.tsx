import type { Role } from '@/types/role';
import { Icon } from '@iconify/react';
import type { ReactElement } from 'react';

type MenuItem = {
  title: string;
  path: string;
  icon: ReactElement;
  role: Role[];
};

const menuItems: MenuItem[] = [
  {
    title: 'Home',
    path: '/admin',
    icon: <Icon icon='akar-icons:dashboard' />,
    role: ['SUPER_ADMIN'],
  },
  {
    title: 'Data User',
    path: '/admin/users',
    icon: <Icon icon='mdi:account-multiple' />,
    role: ['SUPER_ADMIN'],
  },
  {
    title: 'Data Fakultas',
    path: '/admin/faculties',
    icon: <Icon icon='mdi:account-multiple' />,
    role: ['SUPER_ADMIN'],
  },
  {
    title: 'Data Program Studi',
    path: '/admin/majors',
    icon: <Icon icon='mdi:account-multiple' />,
    role: ['SUPER_ADMIN'],
  },
  {
    title: 'Data Tahun Akademik dan Semester',
    path: '/admin/academic-terms',
    icon: <Icon icon='mdi:account-multiple' />,
    role: ['SUPER_ADMIN'],
  },
  {
    title: 'Data Matakuliah',
    path: '/admin/courses',
    icon: <Icon icon='mdi:account-multiple' />,
    role: ['SUPER_ADMIN'],
  },
  {
    title: 'Home Page',
    path: '/',
    icon: <Icon icon='akar-icons:dashboard' />,
    role: ['DOSEN'],
  },
  {
    title: 'Courses',
    path: '/dosen/courses',
    icon: <Icon icon='tabler:book' />,
    role: ['DOSEN'],
  },

  {
    title: 'Study Groups',
    path: '/dosen/study-groups',
    icon: <Icon icon='fluent:people-community-16-regular' />,
    role: ['DOSEN'],
  },
];

export default menuItems;
