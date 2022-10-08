const orderDetailKeys = {
  detail: (id: string) => ['orderDetails', 'detail', id] as const
}

export { orderDetailKeys }