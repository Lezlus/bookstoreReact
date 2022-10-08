import ProductService from "../../services/productService/productService";
import { useQuery } from "@tanstack/react-query";
import { bookKeys } from "../../components/booksComponents/queries";
import { useMemo } from "react";
import { ProductSortType } from "../../types";

const getAllBooksPaginated = async (start: number, end: number, sortObj: ProductSortType, priceFilter?: string) => {
  const res = await ProductService.get(sortObj, priceFilter);
  console.log('retrieved books');
  let slicedProducts = res.products.slice(start, end);
  res.products = slicedProducts;
  return res
}

const getBooksByPublisher = async (start: number, end: number, publishers: string, sortObj: ProductSortType, priceFilter?: string) => {
  const res = await ProductService.filterByPublisher(publishers, sortObj, priceFilter);

  let slicedProducts = res.products.slice(start, end);
  res.products = slicedProducts;
  return res
}

const getBooksByGenre = async (start: number, end: number, genres: string, sortObj: ProductSortType, priceFilter?: string) => {
  const res = await ProductService.filterByGenre(genres, sortObj, priceFilter);

  let slicedProducts = res.products.slice(start, end);
  res.products = slicedProducts;
  return res
}

const getBooksByGenreAndPublisher = async (start: number, end: number, genres: string, publishers: string, 
  sortObj: ProductSortType, priceFilter?: string) => {
  const res = await ProductService.filterByPublisherAndGenre(publishers, genres,
    sortObj, priceFilter);

  let slicedProducts = res.products.slice(start, end);
  res.products = slicedProducts;
  return res
}

const getAllBooks = async () => {
  const res = await ProductService.get({type: 'relevance:asc'});
  return res;
}

export const useAllBooksQuery = () => useQuery(bookKeys.all, getAllBooks);

export const usePaginatedBooksQuery = (page: string, start: number, end: number,
  genres: string[], publishers: string[], sortObj: ProductSortType = {type: 'relevance:asc'}, 
  priceFilter: string) => {
    let priceQuery: string | undefined = priceFilter === 'all' ? undefined : priceFilter;
    const genreFilters = genres.join(',');
    const publisherFilters = publishers.join(',');
    return useQuery(bookKeys.list(page, sortObj, priceFilter, publisherFilters, genreFilters), () => {
      if (genreFilters === '' && publisherFilters === '') {
        return getAllBooksPaginated(start, end, sortObj, priceQuery)
      } else if (genreFilters === '' && publisherFilters !== '') {
        return getBooksByPublisher(start, end, publisherFilters, sortObj, priceQuery)
      } else if (genreFilters !== '' && publisherFilters === '') {
        return getBooksByGenre(start, end, genreFilters, sortObj, priceQuery);
      }

      return getBooksByGenreAndPublisher(start, end, genreFilters, publisherFilters, sortObj, priceQuery);
    })
  }
