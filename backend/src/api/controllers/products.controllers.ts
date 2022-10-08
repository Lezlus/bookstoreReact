import { Request, Response, NextFunction } from 'express';
import { productDAO } from '../dao/product.dao';
import { ProductResponse, ProductsResponse, CustomExpressResponse, GenreProductsResponse, PublisherProductsResponse } from '../../types/response';
import { SortRequest, GenreRequest, PublisherRequest, PriceFilter } from '../../types/request/product';



const getAllProducts = async (req: Request<{}, {}, {}, {order?: SortRequest, price?: PriceFilter}>, res: CustomExpressResponse<ProductsResponse>, next: NextFunction): Promise<void> => {
  const sortType = req.query.order;
  const priceType = req.query.price;
  
  const products = await productDAO.getAllProducts(sortType, priceType);
  res.status(200).json({products, count: products.length});
}

const getProductsByGenre = async (req: Request<{name: string}, {}, {}, {order?: SortRequest, price?: PriceFilter}>, res: CustomExpressResponse<ProductsResponse>, next: NextFunction): Promise<void> => {
  const genre = req.params.name;
  const sort = req.query.order;
  const priceFilter = req.query.price;

  const genresToFilter = genre.split(',');

  const products = await productDAO.filterProductsByGenre(genresToFilter, sort, priceFilter);
  res.status(200).json({products, count: products.length});
}

const getProductsByPublisher = async (req: Request<{name: PublisherRequest}, {}, {}, {order?: SortRequest, price?: PriceFilter}>, res: CustomExpressResponse<ProductsResponse>, next: NextFunction): Promise<void> => {
  const publisher = req.params.name;
  const sort = req.query.order;
  const priceFilter = req.query.price;

  const publishersToFIlter = publisher.split(',');
  const products = await productDAO.filterProductsByPublisher(publishersToFIlter, sort, priceFilter);

  res.status(200).json({products, count: products.length});
}

const gerProductsByPublisherAndGenre = async (req: Request<{publishers: string, genres: string}, {}, {}, {order?: SortRequest, price?: PriceFilter}>, res: CustomExpressResponse<ProductsResponse>, next: NextFunction): Promise<void> => {
  const publishers = req.params.publishers.split(',');
  const genres = req.params.genres.split(',');
  const sort = req.query.order;
  const priceFilter = req.query.price;


  const products = await productDAO.filterProductsByPublisherAndGenre(publishers, genres, sort, priceFilter)

  res.status(200).json({products, count: products.length});

}

const getProduct = async (req: Request<{id: string}>, res: CustomExpressResponse<ProductResponse>, next: NextFunction): Promise<void> => {
  const id = req.params.id;
  const product = await productDAO.getProduct(parseInt(id));
  res.status(200).json({product});
}

const getProductBySlug = async (req: Request<{slug: string}>, res: CustomExpressResponse<ProductResponse>, next: NextFunction): Promise<void> => {
  const slug = req.params.slug;
  const product = await productDAO.getProductBySlug(slug);
  res.status(200).json({product});
}

export { getProduct, getAllProducts, 
  getProductsByGenre, getProductsByPublisher, gerProductsByPublisherAndGenre, getProductBySlug }