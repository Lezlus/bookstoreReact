import type { Knex } from 'knex';
import { CreateGenreType } from '../../api/schema/index';
import { readJsonFile } from '../utils/readJson';

let genres: CreateGenreType[] = [];
let jsonGenres: string[] = [];

export async function seed(knex: Knex): Promise<void> {
  await readJsonFile('./data/genres_1.json', genres, jsonGenres);
  await knex('genres').insert(genres);
}