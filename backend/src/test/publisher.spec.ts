import { ProductSchemaType } from "../api/schema/index";
import { PublisherShape } from '../api/models/publisher.model';
import chai from 'chai';
import sinonChai from 'sinon-chai';
import sinon from 'sinon';

chai.use(sinonChai);
const expect = chai.expect;

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

let product3: ProductSchemaType = {
  id: 3,
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

let publisher: PublisherShape = {
  id: 1,
  name: 'Kodansha',
  products: [product, product2, product3]
}

const testPublishersAPI = {
  get: (id: number) => {
    return publisher
  }
}

let filteredBooks: FilteredProductSet;

describe('Publisher', () => {
  before(() => {
    filteredBooks = new FilteredProductSet();
  })

  describe('Getting publishers for filtering products', () => {

    afterEach(() => {
      filteredBooks.clear();
    })

    it('get /publishers/:id retrieves a single publisher with all products attached to this publisher', () => {
      sinon.stub(testPublishersAPI, 'get').returns(publisher);
      let res = testPublishersAPI.get(1);

      expect(res.id).to.equal(publisher.id);
      expect(res.products).to.eql(publisher.products);
    })

    it('Filtering products by publishers will be done by having a set of products', () => {
      let product3: ProductSchemaType = {
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
      filteredBooks.add(product3)

      let res = testPublishersAPI.get(1);

      res.products!.forEach(product => filteredBooks.add(product))

      expect(filteredBooks.size).to.equal(3)
    })
  })
})