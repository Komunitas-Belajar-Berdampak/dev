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
    role: ['mahasiswa', 'dosen'],
  },
  {
    title: 'Home',
    path: '/super-admin',
    icon: <Icon icon='akar-icons:dashboard' />,
    role: ['admin'],
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

  {
    title: 'Data User',
    path: '/super-admin/users',
    icon: <Icon icon='mdi:account-multiple' />,
    role: ['admin'],
  },
  {
    title: 'Data Fakultas',
    path: '/super-admin/faculties',
    icon: <Icon icon='mdi:account-multiple' />,
    role: ['admin'],
  },
  {
    title: 'Data Program Studi',
    path: '/super-admin/majors',
    icon: <Icon icon='mdi:account-multiple' />,
    role: ['admin'],
  },
  {
    title: 'Data Tahun Akademik dan Semester',
    path: '/super-admin/academic_terms',
    icon: <Icon icon='mdi:account-multiple' />,
    role: ['admin'],
  },
  {
    title: 'Data Matakuliah',
    path: '/super-admin/courses',
    icon: <Icon icon='mdi:account-multiple' />,
    role: ['admin'],
  },

];

export default menuItems;
