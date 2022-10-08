import { FavoriteShape, FavoriteItemShape } from "../../../backend/src/api/models";
import { FavoriteItemCreateData, FavoriteItemDeleteData } from "../../../backend/src/types/create";

interface FavoriteItem extends FavoriteItemShape {
  
}

interface Favorite extends FavoriteShape {

}

interface FavoriteItemCreate extends FavoriteItemCreateData {

}

interface FavoriteItemDelete extends FavoriteItemDeleteData {

}

export type { FavoriteItem, Favorite, FavoriteItemCreate, FavoriteItemDelete }