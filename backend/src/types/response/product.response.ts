import { ProductSchemaType } from "../../api/schema";
import { Product, Genre, Publisher } from '../../api/models';

interface ProductResponse {
  product: Product;
}

interface ProductsResponse {
  products: Product[];
  count: number
}

interface GenreProductsResponse {
  genres: Genre[];
  count: number
}

interface PublisherProductsResponse {
  publishers: Publisher[];
  count: number;
}

export { ProductResponse, ProductsResponse, GenreProductsResponse, PublisherProductsResponse};
