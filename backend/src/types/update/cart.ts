type CartItemDeleteData = {
  cart_item_id: string;
}

type CartItemUpdateData = {
  cart_item_id: string;
  quantity: number;
}

export { CartItemDeleteData, CartItemUpdateData }