import type { Knex } from 'knex';
import { CreatePublisherType } from '../../api/schema/index';
import { readJsonFile } from '../utils/readJson';

let publishers: CreatePublisherType[] = [];
let jsonPlublishers: string[] = []




export async function seed(knex: Knex): Promise<void> {
  await readJsonFile('./data/publishers_1.json', publishers, jsonPlublishers);
  await knex('publishers').insert(publishers)
}