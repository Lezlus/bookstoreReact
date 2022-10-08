import WishlistService from "../../services/wishlistService/wishlistService";
import { useQuery } from "@tanstack/react-query";
import { wishlistKeys } from "../../components/wishlistComponents/queries";

const getWishlist = async (id: string) => {
  let res = await WishlistService.getById(id);
  console.log('wishlist retrieved')
  return res;
}

export const useWishlist = (id: string) => useQuery(wishlistKeys.detail(id), () => getWishlist(id))