import { ProductResponse, ProductsResponse } from "../../../../backend/src/types/response";
import { fetchData } from "../utility";
import { ProductSortType } from '../../types';

class ProductService {
  static productUrl = 'http://localhost:5000/books';

  static get(sortType: ProductSortType, priceFilter?: string): Promise<ProductsResponse> {
    let queryString = priceFilter ? `order=${sortType.type}&price=${priceFilter}` : `order=${sortType.type}`;
    return fetchData<ProductsResponse>(`${this.productUrl}?${queryString}`, {
      method: 'GET',
      credentials: 'omit'
    })
  }

  static getById(id: number): Promise<ProductResponse> {
    return fetchData<ProductResponse>(`${this.productUrl}/${id}`, {
      method: 'GET',
      credentials: 'omit'
    })
  }

  static getBySlug(name: string): Promise<ProductResponse> {
    return fetchData<ProductResponse>(`${this.productUrl}/${name}`, {
      method: 'GET',
      credentials: 'omit'
    })
  }

  static filterByGenre(name: string, sortType: ProductSortType, priceFilter?: string): Promise<ProductsResponse> {
    let queryString = priceFilter ? `order=${sortType.type}&price=${priceFilter}` : `order=${sortType.type}`;
    return fetchData<ProductsResponse>(`${this.productUrl}/genre/${name}?${queryString}`, {
      method: 'GET',
      credentials: 'omit'
    })
  }

  static filterByPublisher(name: string, sortType: ProductSortType, priceFilter?: string): Promise<ProductsResponse> {
    let queryString = priceFilter ? `order=${sortType.type}&price=${priceFilter}` : `order=${sortType.type}`;
    return fetchData<ProductsResponse>(`${this.productUrl}/publisher/${name}?${queryString}`, {
      method: 'GET',
      credentials: 'omit'
    })
  }

  static filterByPublisherAndGenre(publishers: string, genres: string, sortType: ProductSortType, priceFilter?: string): Promise<ProductsResponse> {
    let queryString = priceFilter ? `order=${sortType.type}&price=${priceFilter}` : `order=${sortType.type}`;
    return fetchData<ProductsResponse>(`${this.productUrl}/genre/${genres}/publisher/${publishers}?${queryString}`, {
      method: 'GET',
      credentials: 'omit'
    })
  }
}

export default ProductService;