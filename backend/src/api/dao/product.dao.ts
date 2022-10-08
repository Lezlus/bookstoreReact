import { Product, Genre, Publisher } from '../models';
import { SortRequest, PriceFilter } from '../../types/request/product';
import { OrderByDirection } from 'objection';

interface ProductDAOInterface {
  getAllProducts: (sort: SortRequest) => Promise<Product[]>
  getProduct: (id: number) => Promise<Product>
}

class ProductDAO implements ProductDAOInterface {
  async getAllProducts(sortType?: SortRequest, priceFilter?: PriceFilter) {
    let books: Product[];
    if (sortType) {
      let sort = sortType.split(':');
      let order: OrderByDirection = sort[1] === 'asc' ? 'ASC' : 'DESC';
      sort[0] = sort[0] === 'relevance' ? 'id' : sort[0]

      books = await Product.query()
      .where((builder) => {
        if (priceFilter) {
          if (priceFilter === '<5') {
            builder.where('price', '<', 5)
          } else if (priceFilter === '5-10') {
            builder.whereBetween('price', [5, 10])
          } else if (priceFilter === '10-25') {
            builder.whereBetween('price', [10, 25])
          } else if (priceFilter === '25<') {
            builder.where('price', '>', 25)
          }
        }
      }).orderBy(sort[0], order)
    } else {
      books = await Product.query()
        .where((builder) => {
          if (priceFilter) {
            if (priceFilter === '<5') {
              builder.where('price', '<', 5)
            } else if (priceFilter === '5-10') {
              builder.whereBetween('price', [5, 10])
            } else if (priceFilter === '10-25') {
              builder.whereBetween('price', [10, 25])
            } else if (priceFilter === '25<') {
              builder.where('price', '>', 25)
            }
          }
        })
    }
    return books
  }

  async getProduct(id: number) {
    const book = await Product.query()
      .findById(id)
      .withGraphFetched('[publisher, genres]');

    if (!book) {
      throw new Error('Product Not Found')
    }
    return book
  }

  async getProductBySlug(slug: string) {
    const book = await Product.query().findOne({slug})
      .withGraphFetched('[publisher, genres]')

    if (!book) {
      throw new Error('Product Not Found')
    }
    return book
  }

  async filterProductsByGenre(genres: string[], sortType?: SortRequest, priceFilter?: PriceFilter ) {
    let books: Product[];
    if (sortType) {
      let sort = sortType.split(':');
      let order: OrderByDirection = sort[1] === 'asc' ? 'ASC' : 'DESC';
      sort[0] = sort[0] === 'relevance' ? 'id' : sort[0]
      books = await Product.query()
      .from(
        Product.query()
        .distinctOn('products.id')
        .joinRelated('genres')
        .whereIn('genres.name', genres)
        .andWhere((builder) => {
          if (priceFilter) {
            if (priceFilter === '<5') {
              builder.andWhere('price', '<', 5)
            } else if (priceFilter === '5-10') {
              builder.andWhereBetween('price', [5, 10])
            } else if (priceFilter === '10-25') {
              builder.andWhereBetween('price', [10, 25])
            } else if (priceFilter === '25<') {
              builder.andWhere('price', '>', 25)
            }
          }
        })
        .as('filteredProducts')
      )
      .orderBy(sort[0], order)
      
    } else {
      console.log('no sort')
      books = await Product.query()
      .distinctOn('products.id')
      .joinRelated('genres')
      .whereIn('genres.name', genres)
      .andWhere((builder) => {
        if (priceFilter) {
          if (priceFilter === '<5') {
            builder.andWhere('price', '<', 5)
          } else if (priceFilter === '5-10') {
            builder.andWhereBetween('price', [5, 10])
          } else if (priceFilter === '10-25') {
            builder.andWhereBetween('price', [10, 25])
          } else if (priceFilter === '25<') {
            builder.andWhere('price', '>', 25)
          }
        }
      })
    }
    return books;
  }

  async filterProductsByPublisherAndGenre(publishers: string[], genres: string[], sortType?: SortRequest, priceFilter?: PriceFilter) {
    let books: Product[];
    if (sortType) {
      let sort = sortType.split(':');
      let order: OrderByDirection = sort[1] === 'asc' ? 'ASC' : 'DESC';
      sort[0] = sort[0] === 'relevance' ? 'id' : sort[0]

      books = await Product.query()
        .from(
          Product.query()
          .distinctOn('products.id')
          .joinRelated('[genres, publisher]')
          .whereIn('genres.name', genres)
          .andWhere((builder) => {
            builder.whereIn('publisher.name', publishers)
          })
          .andWhere((builder) => {
            if (priceFilter) {
              if (priceFilter === '<5') {
                builder.andWhere('price', '<', 5)
              } else if (priceFilter === '5-10') {
                builder.andWhereBetween('price', [5, 10])
              } else if (priceFilter === '10-25') {
                builder.andWhereBetween('price', [10, 25])
              } else if (priceFilter === '25<') {
                builder.andWhere('price', '>', 25)
              }
            }
          })
          .as('filteredProducts')
        )
        .orderBy(sort[0], order)
        
    } else {
      books = await Product.query()
      .distinctOn('products.id')
      .joinRelated('[genres, publisher]')
      .whereIn('genres.name', genres)
      .andWhere((builder) => {
        builder.whereIn('publisher.name', publishers)
      })
      .andWhere((builder) => {
        if (priceFilter) {
          if (priceFilter === '<5') {
            builder.andWhere('price', '<', 5)
          } else if (priceFilter === '5-10') {
            builder.andWhereBetween('price', [5, 10])
          } else if (priceFilter === '10-25') {
            builder.andWhereBetween('price', [10, 25])
          } else if (priceFilter === '25<') {
            builder.andWhere('price', '>', 25)
          }
        }
      })
    }
    return books;
  }

  async filterProductsByPublisher(publishersToParse: string[], sortType?: SortRequest, priceFilter?: PriceFilter) {
    let books: Product[];

    if (sortType) {
      let sort = sortType.split(':');
      let order: OrderByDirection = sort[1] === 'asc' ? 'ASC' : 'DESC';
      sort[0] = sort[0] === 'relevance' ? 'id' : sort[0]

      books = await Product.query()
        .joinRelated('publisher')
        .whereIn('publisher.name', publishersToParse)
        .andWhere((builder) => {
          if (priceFilter) {
            if (priceFilter === '<5') {
              builder.andWhere('price', '<', 5)
            } else if (priceFilter === '5-10') {
              builder.andWhereBetween('price', [5, 10])
            } else if (priceFilter === '10-25') {
              builder.andWhereBetween('price', [10, 25])
            } else if (priceFilter === '25<') {
              builder.andWhere('price', '>', 25)
            }
          }
        }).orderBy(sort[0], order)
    } else {
      books = await Product.query()
      .joinRelated('publisher')
      .whereIn('publisher.name', publishersToParse)
      .andWhere((builder) => {
        if (priceFilter) {
          if (priceFilter === '<5') {
            builder.andWhere('price', '<', 5)
          } else if (priceFilter === '5-10') {
            builder.andWhereBetween('price', [5, 10])
          } else if (priceFilter === '10-25') {
            builder.andWhereBetween('price', [10, 25])
          } else if (priceFilter === '25<') {
            builder.andWhere('price', '>', 25)
          }
        }
      })
    }
    return books;
  }
}

const productDAO = new ProductDAO()
export { productDAO, ProductDAOInterface }