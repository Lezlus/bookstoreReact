import FavoriteService from '../../services/favoriteService/favoriteService';
import { useQuery } from '@tanstack/react-query';
import { favoriteKeys } from '../../components/favorites/queries';

const getFavorite = async (id: string) => {
  let res = await FavoriteService.getById(id);
  console.log('favorite retrieved');
  return res;
}

export const useFavorite = (id: string, userId: string | undefined) => useQuery(favoriteKeys.detail(id), () => getFavorite(id), {
  enabled: !!userId
});