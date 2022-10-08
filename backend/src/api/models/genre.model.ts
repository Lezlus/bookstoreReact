import { Model, ModelObject, RelationMappings, RelationMappingsThunk } from 'objection';
import { db } from '../../config/db';
import { Product } from './product.model';
import { ProductSchemaType } from '../schema/index';

Model.knex(db);

export class Genre extends Model {
  id: number;
  name: string;
  products: ProductSchemaType[];
  created_at: string;
  updated_at: string;

  static tableName = 'genres';

  static relationMappings: RelationMappingsThunk = () => ({
    products: {
      relation: Model.ManyToManyRelation,
      modelClass: Product,
      join: {
        from: 'genres.id',
        through: {
          from: 'products_genres.genre_id',
          to: 'products_genres.product_id'
        },
        to:  'products.id'
      }
    }
  })

}

export type GenreShape = ModelObject<Genre>