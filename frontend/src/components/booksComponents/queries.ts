import { ProductSortType } from "../../types";

const bookKeys = {
  all: ['books'] as const,
  lists: () => [...bookKeys.all, 'list'] as const,
  list: (page: string, sort: ProductSortType, price: string, publishers: string, genres: string) => 
    [...bookKeys.lists(), page, { sort: sort.type, price, publishers, genres }] as const,
  details: () => [...bookKeys.all, 'details'] as const,
  detail: (name: string) => [...bookKeys.details(), name] as const,
}

export { bookKeys };