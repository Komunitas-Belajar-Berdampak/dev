import { Check, ClipboardList, Clock2 } from 'lucide-react';

export const listIcons = [
  {
    label: 'completed',
    icon: <Check className='text-white' size={12} />,
  },
  {
    label: 'On Progress',
    icon: <Clock2 className='text-primary' size={16} />,
  },
  {
    label: 'Do',
    icon: <ClipboardList className='text-primary' size={16} />,
  },
];
