import chai from 'chai';
import sinonChai from 'sinon-chai';
import sinon from 'sinon';
import { ProductShape } from '../api/models/product.model';
import { faker } from '@faker-js/faker';
import { PublisherSchemaType, GenreSchemaType } from '../api/schema/index';


chai.use(sinonChai);
const expect = chai.expect;

let publisher: PublisherSchemaType = {
  id: 1,
  name: 'Viz Books'
}

let genre1: GenreSchemaType = {
  id: 1,
  name: 'Horror'
}

let genre2: GenreSchemaType = {
  id: 2,
  name: 'military'
}

const testProductsAPI = {
  getOne: (id: number) => {

    let book: ProductShape = {
      id,
      title: 'To Your Eternity',
      slug: 'to-your-eternity',
      desc: '',
      price: 6.43,
      media: '',
      publisher_id: 1,
      publisher,
      genres: undefined,
      release_date: new Date(1990, 4, 7),
      themes: '',
      age_rating: '',
      page_count: '',
      dimensional_weight: '',
      is_erotica: false,
      img_path_lg: '/toyoureternity',
      img_path_sm: ''
    }
    return book
  },
  getAll: () => {
    let books: ProductShape[] = []
    let amountBooks = 3;
    for (let i = 0; i < amountBooks; i++) {
      let book: ProductShape = {
        id: faker.datatype.number(),
        title: faker.commerce.product(),
        slug: 'to-your-et',
        desc: '',
        price: faker.datatype.float(),
        media: '',
        publisher_id: faker.datatype.number(),
        publisher,
        genres: undefined,
        release_date: faker.date.birthdate(),
        themes: '',
        age_rating: '',
        page_count: '',
        dimensional_weight: '',
        is_erotica: false,
        img_path_lg: '/toyoureternity',
        img_path_sm: ''
      }

      books.push(book)
    }
    return books;
  }
}



describe('Product', () => {
  before(() => {
  })

  describe('Getting books', () => {
    it('get /books should return all books in the db', async () => {
      let book1: ProductShape = {
        id: 1,
        title: 'To Your Eternity',
        slug: 'to-your-eternity',
        desc: '',
        price: 6.32,
        media: '',
        publisher_id: 1,
        publisher: undefined,
        genres: undefined,
        release_date: new Date(1990, 4, 7),
        themes: '',
        age_rating: '',
        page_count: '',
        dimensional_weight: '',
        is_erotica: false,
        img_path_lg: '/toyoureternity',
        img_path_sm: ''
      }

      let book2: ProductShape = {
        id: 2,
        title: 'Attack on Titan',
        slug: 'attack-on-titan',
        desc: '',
        price: 6.32,
        media: '',
        publisher_id: 1,
        publisher: undefined,
        genres: undefined,
        release_date: new Date(1990, 4, 7),
        themes: '',
        age_rating: '',
        page_count: '',
        dimensional_weight: '',
        is_erotica: false,
        img_path_lg: '/attackontitan',
        img_path_sm: ''
      }

      let book3: ProductShape = {
        id: 3,
        title: 'Vagabond',
        slug: 'vagabond',
        desc: '',
        price: 6.32,
        media: '',
        publisher_id: 1,
        publisher: undefined,
        genres: undefined,
        release_date: new Date(1990, 4, 7),
        themes: '',
        age_rating: '',
        page_count: '',
        dimensional_weight: '',
        is_erotica: false,
        img_path_lg: '/vagabond',
        img_path_sm: ''
      }
      let books: ProductShape[] = [book1, book2, book3];
      sinon.stub(testProductsAPI, 'getAll').returns(books)
      let allBooks = testProductsAPI.getAll();
      let i = 0;

      for (let book of allBooks) {
        let comparedBook = books[i];
        i++
        expect(book).to.deep.equal(comparedBook);
      }
    })
    it('get /books/:id Returns a single book with publisher and genres information', () => {
      let book: ProductShape = {
        id: 2,
        title: 'Attack on Titan',
        slug: 'attack-on-titan',
        desc: '',
        price: 6.32,
        media: '',
        publisher_id: 1,
        publisher,
        genres: [genre1, genre2],
        release_date: new Date(1990, 4, 7),
        themes: '',
        age_rating: '',
        page_count: '',
        dimensional_weight: '',
        is_erotica: false,
        img_path_lg: '/attackontitan',
        img_path_sm: ''
      }

      sinon.stub(testProductsAPI, 'getOne').returns(book);

      let resBook = testProductsAPI.getOne(2);
      let resPublisher = resBook.publisher
      let genres = resBook.genres

      expect(resPublisher).to.deep.equal(publisher);
      expect(genres).to.eql([genre1, genre2]);
    })
  })
}) 