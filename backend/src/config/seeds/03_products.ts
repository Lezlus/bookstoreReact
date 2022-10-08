import type { Knex } from 'knex';
import { CreateProductType } from '../../api/schema/index';
import { promises as fs } from 'fs';
import Decimal from 'decimal.js';

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

const PUBLISHERS: {[key: string]: number} = {
  'KODANSHA COMICS': 1,
  'SEVEN SEAS': 2,
  'VIZ BOOKS': 3,
  'DENPA': 4,
  'VERTICAL': 5,
  'DARK HORSE MANGA': 6,
  'SQUARE ENIX MANGA': 7,
  'YEN PRESS': 8,
  'ONE PEACE': 9,
  'GHOST SHIP': 10,
  'SUBLIME': 11,
  'J-NOVEL CLUB': 12,
  'SHOJO BEAT': 13,
  'FAKKU': 14
}

const invalidWin10Chars: string[] = ['<', '>', ':', '"', '/', '\\', '|', 
  '?', '*'];

const stripInvalidChars = (word: string): string => {
  let tempTitle = word;
  for (let invalidChar in invalidWin10Chars) {
    if (word.includes(invalidChar)) {
      tempTitle = word.replace(invalidChar, '').trim();
    }
  }
  return tempTitle;
}

let products: CreateProductType[] = [];
let jsonProducts: JsonBook[];

const readBookData = async (file: string, bookData: CreateProductType[], jsonData:JsonBook[]): Promise<void> => {
  let jsonString = await fs.readFile(file, 'utf-8');
  jsonData = JSON.parse(jsonString);

  for (let book of jsonData) {
    const [month, day, year] = book.release_date.split('/');
    let release_date = new Date(parseInt(year), parseInt(month), parseInt(day));
    let urlTitle = stripInvalidChars(book.title);
  
    let product: CreateProductType = {
      title: book.title,
      slug: book.slug,
      desc: book.description,
      price: book.price,
      media: book.media,
      publisher_id: PUBLISHERS[book.publisher],
      release_date,
      themes: book.themes,
      age_rating: book.age_rating,
      page_count: book.page_count,
      dimensional_weight: book.dimensional_weight,
      is_erotica: book.is_erotica,
      img_path_lg: `\\book_images\\big\\${urlTitle}_lg.jpg`,
      img_path_sm: `\\book_images\\small\\${urlTitle}_sm.jpg`
      
    }
    
    bookData.push(product);
  }
}

export async function seed(knex: Knex): Promise<void> {
  await readBookData('./data/book_info_1.json', products, jsonProducts);
  await knex('products').insert(products);
}