import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { ReactNode } from 'react';

type TodoListTableProps = {
  headers: string[];
  children: ReactNode;
  footer?: ReactNode;
};

function TodoListTable({ headers, children, footer }: TodoListTableProps) {
  return (
    <div className='mt-6 w-full rounded-xl border border-accent shadow-sm overflow-hidden'>
      <Table>
        <TableHeader>
          <TableRow>
            {headers.map((header) => (
              <TableHead key={header} className='text-primary w-screen font-semibold'>
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
