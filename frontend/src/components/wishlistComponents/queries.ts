const wishlistKeys = {
  all: ['todos'] as const,
  detail: (id: string) => ['wishlists', 'detail', id] as const
}

export { wishlistKeys }