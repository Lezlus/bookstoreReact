const favoriteKeys = {
  detail: (id: string) => ['favorites', 'detail', id] as const
}

export { favoriteKeys }