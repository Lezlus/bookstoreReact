import { Model, ModelObject, RelationMappings, RelationMappingsThunk } from 'objection';
import { FavoriteItem, FavoriteItemShape } from './favorite_items.model';
import { db } from '../../config/db';

Model.knex(db);

export class Favorite extends Model {
  id: string;
  user_id: string;
  favorite_items: FavoriteItemShape[]

  static tableName: string = 'favorites';

  static relationMappings: RelationMappingsThunk = () => ({
    favorite_items: {
      relation: Model.HasManyRelation,
      modelClass: FavoriteItem,
      join: {
        from: 'favorites.id',
        to: 'favorite_items.favorite_id'
      }
    }
  })
}

export type FavoriteShape = ModelObject<Favorite>