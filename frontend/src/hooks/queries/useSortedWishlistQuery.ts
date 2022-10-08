import WishlistService from "../../services/wishlistService/wishlistService";
import { useQuery } from "@tanstack/react-query";
import { wishlistKeys } from "../../components/wishlistComponents/queries";
import { SortObjectType, compareAlphabetically, comparePrice, 
  compareDate, customSortArray, customSortArrayReversed } from "../../components/utility/itemSorting";
import { DetailedWishlist, WishlistItem } from "../../types";
import { useMemo } from "react";

const getSortedWishlistItems = (sortObj: SortObjectType, wishlistItems: WishlistItem[]) => {
  switch (sortObj.type) {
    case 'sortByName':
      return customSortArray(wishlistItems, (a, b) => {
        return compareAlphabetically(a.product.title, b.product.title)
      })
    
    case 'sortByNameReversed':
      return customSortArray(wishlistItems, (a, b) => {
        return compareAlphabetically(a.product.title, b.product.title)
      }).reverse()

    case 'sortByPrice':
      return customSortArray(wishlistItems, (a, b) => {
        return comparePrice(a.product.price, b.product.price)
      })

    case 'sortByPriceReversed':
      return customSortArray(wishlistItems, (a, b) => {
        return comparePrice(a.product.price, b.product.price)
      }).reverse()
    // case 'sortByDateAdded':
    //   return customSortArray(wishlistItems, (a, b) => {
    //     
    //   })
    case 'defaultReversed':
      return wishlistItems.reverse()

    default:
      return wishlistItems
  }
}

const getWishlist = async (id: string) => {
  let res = await WishlistService.getById(id);
  console.log('wishlist retrieved')
  return res;
}

export const useSortedWishlistQuery = (id: string, sortObj: SortObjectType = {type: 'default'}) => {
  const { data, ...rest } = useQuery(wishlistKeys.detail(id), () => getWishlist(id));

  const sortedData = useMemo(() => {
    console.log('memo called')
    const wishlist = data?.wishlist!
    if (sortObj.type === 'default') return wishlist;
    let sortedWishlistItems = getSortedWishlistItems(sortObj, wishlist.wishlist_items);
    wishlist.wishlist_items = sortedWishlistItems
    return wishlist
  }, [data, sortObj])

  return {data: sortedData, ...rest}
}