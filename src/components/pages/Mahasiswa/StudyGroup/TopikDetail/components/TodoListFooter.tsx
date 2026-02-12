import { Button } from '@/components/ui/button';
import { TableCell, TableFooter, TableRow } from '@/components/ui/table';
import { Icon } from '@iconify/react';

type TodoListFooterProps = {
  disabled?: boolean;
  onNew: () => void;
};

function TodoListFooter({ disabled = false, onNew }: TodoListFooterProps) {
  return (
    <TableFooter>
      <TableRow>
        <TableCell colSpan={4} className='text-center'>
          <Button type='button' variant='link' disabled={disabled} onClick={onNew}>
            <Icon icon='ic:round-add-box' className='size-5' />
            New To Do
          </Button>
        </TableCell>
      </TableRow>
    </TableFooter>
  );
}

export default TodoListFooter;
