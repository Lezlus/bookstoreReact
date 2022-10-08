export { getProduct, getAllProducts, getProductBySlug,
  getProductsByGenre, getProductsByPublisher, gerProductsByPublisherAndGenre } from './products.controllers';
export { getPublisher } from './publishers.controllers';
export { getGenre } from './genres.controllers';
export { register, login, logout, authenticated } from './users.controllers';
export { createWishlist, getWishlist, updateWishlist, deleteWishlist } from './wishlist.controller';
export { createWishlistItem, deleteWishlistItems, updateWishlistItemQuantity } from './wishlist_item.controller';
export { getFavorite } from './favorite.controller';
export { createFavoriteItem, deleteFavoriteItem } from './favorite_item.controller';
export { getCart, addItemToCart, removeItemFromCart, addItemsToCart, 
  changeItemQuantity, checkoutCart} from './cart.controller';
export { getOrderDetail } from './orderDetail.controller';
export { getCoupons, getCoupon } from './coupon.controller';