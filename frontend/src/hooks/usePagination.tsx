import { useMemo } from 'react';
const DOTS = '...';

type PaginationHookProps = {
  totalCount: number
  pageSize: number
  siblingCount: number
  currentPage: number
}

const range = (start: number, end: number): number[] => {
  let length = end - start + 1;
  return Array.from({length}, (_, idx) => idx + start);
}

const usePagination = (props: PaginationHookProps) => {
  const {siblingCount = 1, totalCount, pageSize, currentPage} = props;
  const paginationRange = useMemo(() => {
    const totalPageCount = Math.ceil(totalCount/ pageSize);
    const totalPageNumbers = siblingCount + 5;
  
    // Case 1 if the num of pages < totalPages we want to show. We return [1..totalPageCount]
    if (totalPageNumbers >= totalPageCount) {
      return range(1, totalPageCount).map(String);
    }

    // Calculate left and right sibling index
    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPageCount);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPageCount - 2

    const firstPageIndex = 1
    const lastPageIndex = totalPageCount;

    // Case 2
    // No left dots to show, but right dots to be shown
    if (shouldShowLeftDots && !shouldShowRightDots) {
      let rightItemCount = 3 + 2 * siblingCount;
      let rightRange = range(totalPageCount - rightItemCount + 1, totalPageCount).map(String);
      return [firstPageIndex.toString(), DOTS, ...rightRange];
    }

    // Case 4: Both left and right dots to be shown
    if (shouldShowRightDots && shouldShowLeftDots) {
      let middleRange = range(leftSiblingIndex, rightSiblingIndex).map(String);
      return [firstPageIndex.toString(), DOTS, ...middleRange, DOTS, lastPageIndex.toString()];
    }

    // Else return an empty string array
    return ['']

  }, [totalCount, pageSize, siblingCount, currentPage])
  return paginationRange   
} 

export { DOTS, usePagination, PaginationHookProps }