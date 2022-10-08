import CartService from "../../services/cartService/cartService";
import { useQuery } from "@tanstack/react-query";
import { cartKeys } from "../../components/cart/queries";

const getCart = async () => {
  const res = await CartService.get();
  console.log('cart retrieved')
  return res;
}

export const useCart = () => useQuery(cartKeys.detail, getCart);