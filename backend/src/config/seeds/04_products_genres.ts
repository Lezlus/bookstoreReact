import type { Knex } from 'knex';
import { CreateProductGenreType, CreateProductType } from '../../api/schema/index';
import { promises as fs } from 'fs';

const GENRES: {[key: string]: number} = {
  'Fantasy': 1,
  'Romance': 2,
  'Action': 3,
  'Horror': 4,
  'Drama': 5,
  'Comedy': 6,
  'Science Fiction': 7,
  'Mystery': 8,
  'Documentary': 9,
  'Erotica': 10
}

function ensurePropertyFound<T>(argument: T | undefined | null, message: string = 'This value was promised to be there'): T {
  if (argument === undefined || argument === null) {
    throw new TypeError(message);
  }
  return argument
}

type JsonBook = {
  title: string,
  description: string,
  price: string,
  image_link_url: string,
  image_link_url_detailed: string,
  publisher: string,
  media: string,
  genre: string,
  themes: string,
  age_rating: string,
  release_date: string,
  page_count: string,
  dimensional_weight: string,
  written_language: string,
  is_erotica: boolean,
  retail_price: string,
  rightstuf_url: string,
  slug: string,
}

type ProductId = {
  id: number,
}

type FullProduct = ProductId & CreateProductType

let product_genres: CreateProductGenreType[] = [];
let jsonProducts: JsonBook[];

const readBookData = async (file: string, productGenresData: CreateProductGenreType[], 
  jsonData: JsonBook[], products: FullProduct[]): Promise<void> => {

  let jsonString = await fs.readFile(file, 'utf-8')
  jsonData = JSON.parse(jsonString);

  for (let book of products) {
    let foundBook: JsonBook = ensurePropertyFound(jsonData.find(jsonBook => jsonBook.title === book.title))
    let genreArr: string[] = foundBook.genre.split(',');
    for (let genre of genreArr) {
      let productGenre: CreateProductGenreType = {
        product_id: book.id,
        genre_id: GENRES[genre.trim()]
      }

      productGenresData.push(productGenre)
    }
  }
}



export async function seed(knex: Knex): Promise<void> {
  let books = await knex.select().from<FullProduct>('products')
  await readBookData('./data/book_info_1.json', product_genres, jsonProducts, books)
  await knex('products_genres').insert(product_genres)
}