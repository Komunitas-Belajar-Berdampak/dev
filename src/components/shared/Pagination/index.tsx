import { PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, Pagination as UiPagination } from '@/components/ui/pagination';
import { cn } from '@/lib/cn';

type PaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
  className?: string;
  disabled?: boolean;
};

type PageItem = number | 'ellipsis';

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const getPageItems = (page: number, totalPages: number, siblingCount: number): PageItem[] => {
  if (totalPages <= 1) return [1];

  const safePage = clamp(page, 1, totalPages);
  const safeSibling = Math.max(0, siblingCount);

  const totalNumbers = safeSibling * 2 + 5;
  if (totalPages <= totalNumbers) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const leftSiblingIndex = Math.max(safePage - safeSibling, 1);
  const rightSiblingIndex = Math.min(safePage + safeSibling, totalPages);

  const showLeftEllipsis = leftSiblingIndex > 2;
  const showRightEllipsis = rightSiblingIndex < totalPages - 1;

  const items: PageItem[] = [1];

  if (showLeftEllipsis) {
    items.push('ellipsis');
  } else {
    for (let i = 2; i < leftSiblingIndex; i++) items.push(i);
  }

  for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
    if (i !== 1 && i !== totalPages) items.push(i);
  }

  if (showRightEllipsis) {
    items.push('ellipsis');
  } else {
    for (let i = rightSiblingIndex + 1; i < totalPages; i++) items.push(i);
  }

  items.push(totalPages);
  return items;
};

const Pagination = ({ page, totalPages, onPageChange, siblingCount = 1, className, disabled = false }: PaginationProps) => {
  const safeTotal = Math.max(1, totalPages);
  const safePage = clamp(page, 1, safeTotal);

  if (safeTotal <= 1) return null;

  const items = getPageItems(safePage, safeTotal, siblingCount);

  const goTo = (nextPage: number) => {
    if (disabled) return;
    onPageChange(clamp(nextPage, 1, safeTotal));
  };

  return (
    <UiPagination className={cn(className)}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href='#'
            onClick={(e) => {
              e.preventDefault();
              goTo(safePage - 1);
            }}
            aria-disabled={disabled || safePage === 1}
            className={cn((disabled || safePage === 1) && 'pointer-events-none opacity-50')}
          />
        </PaginationItem>

        {items.map((item, index) => {
          if (item === 'ellipsis') {
            return (
              <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }

          const isActive = item === safePage;
          return (
            <PaginationItem key={item}>
              <PaginationLink
                href='#'
                isActive={isActive}
                onClick={(e) => {
                  e.preventDefault();
                  goTo(item);
                }}
                aria-disabled={disabled}
                className={cn(disabled && 'pointer-events-none opacity-50')}
              >
                {item}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        <PaginationItem>
          <PaginationNext
            href='#'
            onClick={(e) => {
              e.preventDefault();
              goTo(safePage + 1);
            }}
            aria-disabled={disabled || safePage === safeTotal}
            className={cn((disabled || safePage === safeTotal) && 'pointer-events-none opacity-50')}
          />
        </PaginationItem>
      </PaginationContent>
    </UiPagination>
  );
};

export default Pagination;
