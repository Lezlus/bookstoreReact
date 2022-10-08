import { GenreShape } from '../api/models/genre.model';
import { ProductSchemaType } from '../api/schema/index';
import chai from 'chai';
import sinonChai from 'sinon-chai';
import sinon from 'sinon';

chai.use(sinonChai);
const expect = chai.expect;

let product: ProductSchemaType = {
  id: 1,
  title: 'To Your Eternity',
  slug: 'to-your-eternity',
  desc: '',
  price: '6.43',
  media: '',
  publisher_id: 1,
  release_date: new Date(1990, 4, 7),
  themes: '',
  age_rating: '',
  page_count: '',
  dimensional_weight: '',
  is_erotica: false,
  img_path_lg: '/toyoureternity',
  img_path_sm: ''
}

let product2: ProductSchemaType = {
  id: 2,
  title: 'To Your Eternity',
  slug: 'to-your-eternity',
  desc: '',
  price: '6.43',
  media: '',
  publisher_id: 1,
  release_date: new Date(1990, 4, 7),
  themes: '',
  age_rating: '',
  page_count: '',
  dimensional_weight: '',
  is_erotica: false,
  img_path_lg: '/toyoureternity',
  img_path_sm: ''
}


let genre: GenreShape = {
  id: 1,
  name: 'Horror',
  products: [product, product2]
}

class FilteredProductSet extends Set<ProductSchemaType> {
	add(value: ProductSchemaType): this {
		let found = false;
		this.forEach(product => {
			if (product.id === value.id) {
				found = true
			}
		})

		if (!found) {
			super.add(value);
		}
		return this;
	}
}

let filteredProducts: FilteredProductSet;

const testGenresAPI = {
  get: (id: number) => {
    return genre
  }
}

describe('Genre', () => {
  before(() => {
    filteredProducts = new FilteredProductSet();
  })

  describe('Getting filtered Products via Genres', () => {
    it('get /genres/:id retrieves a single genre with related products', () => {
      let res = testGenresAPI.get(1);

      expect(res.id).to.equal(genre.id);
      expect(res.products).to.equal(genre.products);
    })

    it('Filtering genres dumps the data into a set of products', () => {
      filteredProducts.add(product);
      filteredProducts.add(product2);

      let res = testGenresAPI.get(1);
      res.products!.forEach(product => filteredProducts.add(product))

      expect(filteredProducts.size).to.equal(2);

    })
  })
})