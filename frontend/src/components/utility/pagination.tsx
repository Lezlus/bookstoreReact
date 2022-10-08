import classnames from 'classnames';
import { usePagination, DOTS, PaginationHookProps } from '../../hooks/usePagination';
import './pagination.scss';
import { Link } from 'react-router-dom';

type PaginationProps = PaginationHookProps & {className: string};

const Pagination = (props: PaginationProps) => {
  const {
    totalCount,
    siblingCount = 1,
    currentPage,
    pageSize,
    className
  } = props;

  const paginationRange = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize,
  });

  // If there are less than 2 items in pagination range we shall not render the component
  if (currentPage === 0 || paginationRange.length < 2) {
    return null;
  }

  let lastPage = paginationRange[paginationRange.length - 1]
  return (
    <ul className={classnames('pagination-container', { [className]: className})}>
      <Link to={`/books/${currentPage - 1}`} className={classnames('pagination-item', { disabled: currentPage === 1 })}>
        <li className={classnames('pagination-item', { disabled: currentPage === 1 })}>
          <div className="arrow left" />
        </li>
      </Link>
      {paginationRange.map(pageNumber => {
        if (pageNumber === DOTS) {
          return <li key={pageNumber}  className="pagination-item dots">&#8230</li>
        }
        return (
          <Link key={pageNumber} to={`/books/${pageNumber}`}>
            <li className={classnames('pagination-item', { selected: pageNumber === `${currentPage}`})}>
              {pageNumber}
            </li>
          </Link>
        )
      })}
      <Link to={`/books/${currentPage + 1}`} className={classnames('pagination-item', { disabled: currentPage === parseInt(lastPage) })}>
        <li className={classnames('pagination-item', { disabled: currentPage === parseInt(lastPage) })}>
          <div className="arrow right" />
        </li>
      </Link>
    </ul>
  )
  
}

export default Pagination;