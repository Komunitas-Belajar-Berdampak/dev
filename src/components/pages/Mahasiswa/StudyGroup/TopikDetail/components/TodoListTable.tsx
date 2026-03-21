import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { ReactNode } from 'react';

type TodoListTableProps = {
  headers: string[];
  children: ReactNode;
  footer?: ReactNode;
};

function TodoListTable({ headers, children, footer }: TodoListTableProps) {
  return (
    <div className='mt-6 w-full overflow-hidden rounded-xl border border-accent shadow-sm'>
      <Table className='table-fixed'>
        <colgroup>
          <col className='w-[28%] md:w-[34%]' />
          <col className='w-[34%] md:w-[36%]' />
          <col className='w-[20%] md:w-[20%]' />
          <col className='w-[18%] md:w-[10%]' />
        </colgroup>
        <TableHeader>
          <TableRow>
            {headers.map((header) => (
              <TableHead key={header} className='text-primary font-semibold text-xs md:text-sm whitespace-normal'>
                {header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>{children}</TableBody>

        {footer}
      </Table>
    </div>
  );
}

export default TodoListTable;
