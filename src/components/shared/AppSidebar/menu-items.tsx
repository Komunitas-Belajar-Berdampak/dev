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
    title: 'Dashboard',
    path: '/',
    icon: <Icon icon='akar-icons:dashboard' />,
    role: ['admin', 'mahasiswa', 'dosen'],
  },
  {
    title: 'Courses',
    path: '/courses',
    icon: <Icon icon='tabler:book' />,
    role: ['dosen', 'mahasiswa'],
  },
  {
    title: 'Study Groups',
    path: '/study-groups',
    icon: <Icon icon='fluent:people-community-16-regular' />,
    role: ['dosen', 'mahasiswa'],
  },
];

export default menuItems;
