import { Clock4, DoorOpen, Edit, X } from 'lucide-react';

export const listOption = [
  {
    label: 'APPROVED',
    icon: <Edit size={15} className='text-white size-3.5' />,
  },
  {
    label: 'REQUEST',
    icon: <DoorOpen size={15} className='text-white size-3.5' />,
  },
  {
    label: 'PENDING',
    icon: <Clock4 size={15} className='text-white size-3.5' />,
  },
  {
    label: 'REJECTED',
    icon: <X size={15} className='text-white size-3.5' />,
  },
];
