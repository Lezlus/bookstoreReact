import { JSONSchema, Model, ModelObject, RelationMappingsThunk } from 'objection';
import { db } from '../../config/db';
import { Publisher } from './publisher.model';
import { Genre, GenreShape } from './genre.model'
import { PublisherSchemaType, GenreSchemaType } from '../schema/index';

Model.knex(db);

export class Product extends Model {
  id: number;
  slug: string;
  title: string;
  desc: string;
  price: string;
  media: string;

  publisher_id: number;
  publisher: PublisherSchemaType;

  genres: GenreSchemaType[];

  release_date: Date;
  themes: string;
  age_rating: string;
  page_count: string;
  dimensional_weight: string;
  is_erotica: boolean;
  img_path_lg: string;
  img_path_sm: string;

  static tableName = 'products';
  // static get jsonSchema(): JSONSchema {
  //   return {
  //     type: 'object',
  //     properties: {
  //       id: {type: 'integ'}
  //     }
  //   }
  // }

  static relationMappings: RelationMappingsThunk = () => ({
    publisher: {
      relation: Model.BelongsToOneRelation,
      modelClass: Publisher,
      join: {
        from: 'products.publisher_id',
        to: 'publishers.id'
      }
    },
    genres: {
      relation: Model.ManyToManyRelation,
      modelClass: Genre,
      join: {
        from: 'products.id',
        through: {
          from: 'products_genres.product_id',
          to: 'products_genres.genre_id'
        },
        to: 'genres.id'
      }
    }
  })

}

export type ProductShape = ModelObject<Product>