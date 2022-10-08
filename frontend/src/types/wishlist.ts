import { WishlistShape, WishlistItemShape }from '../../../backend/src/api/models';
import { WishlistCreateData, WishlistItemCreateData } from '../../../backend/src/types/create';
import { WishlistUpdateData, WishlistItemUpdateData } from '../../../backend/src/types/update';
import { WishListSchemaType } from '../../../backend/src/api/schema';

interface Wishlist extends WishListSchemaType {

}

interface DetailedWishlist extends WishlistShape {

}

interface WishlistCreate extends WishlistCreateData {

}

interface WishlistUpdate extends WishlistUpdateData {

}

interface WishlistItem extends WishlistItemShape {
}

interface WishlistItemUpdate extends WishlistItemUpdateData {

}

interface WishlistItemCreate extends WishlistItemCreateData {

}

export type { Wishlist, DetailedWishlist, WishlistItem, 
  WishlistCreate, WishlistUpdate, WishlistItemUpdate, WishlistItemCreate }