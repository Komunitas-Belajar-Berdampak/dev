import { Clock4, Edit, Mail, XSquareIcon } from 'lucide-react';

export const listOption = [
  {
    label: 'APPROVED',
    icon: <Edit size={15} className='text-primary' />,
  },
  {
    label: 'REQUEST',
    icon: <Mail size={15} className='text-primary' />,
  },
  {
    label: 'PENDING',
    icon: <Clock4 size={15} className='text-primary' />,
  },
  {
    label: 'REJECTED',
    icon: <XSquareIcon size={15} className='text-primary' />,
  },
];
