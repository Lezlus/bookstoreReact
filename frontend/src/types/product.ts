import { ProductShape } from "../../../backend/src/api/models/product.model";
import { SortRequest, GenreRequest, PublisherRequest } from '../../../backend/src/types/request/product';

interface Product extends ProductShape {

}

interface ProductSortType {
    type: SortRequest
}

interface ProductGenreType {
    type: GenreRequest
}

interface ProductPublisherType {
    type: PublisherRequest
}

export type { Product, ProductSortType, ProductGenreType, ProductPublisherType, SortRequest }