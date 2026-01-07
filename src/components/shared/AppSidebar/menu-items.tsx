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
    role: ['admin'],
  },
  {
    title: 'Data User',
    path: '/admin/users',
    icon: <Icon icon='mdi:account-multiple' />,
    role: ['admin'],
  },
  {
    title: 'Data Fakultas',
    path: '/admin/faculties',
    icon: <Icon icon='mdi:account-multiple' />,
    role: ['admin'],
  },
  {
    title: 'Data Program Studi',
    path: '/admin/majors',
    icon: <Icon icon='mdi:account-multiple' />,
    role: ['admin'],
  },
  {
    title: 'Data Tahun Akademik dan Semester',
    path: '/admin/academic-terms',
    icon: <Icon icon='mdi:account-multiple' />,
    role: ['admin'],
  },
  {
    title: 'Data Matakuliah',
    path: '/admin/courses',
    icon: <Icon icon='mdi:account-multiple' />,
    role: ['admin'],
  },
  {
    title: 'Home Page',
    path: '/',
    icon: <Icon icon='akar-icons:dashboard' />,
    role: ['dosen'],
  },
  {
    title: 'Courses',
    path: '/courses',
    icon: <Icon icon='tabler:book' />,
    role: ['dosen'],
  },

  {
    title: 'Study Groups',
    path: '/study-groups',
    icon: <Icon icon='fluent:people-community-16-regular' />,
    role: ['dosen'],
  },
];

export default menuItems;
