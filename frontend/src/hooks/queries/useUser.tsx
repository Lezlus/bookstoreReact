import AuthService from "../../services/authService";
import { AuthResponse } from '../../services/auth/authServiceTypes';
import { useQuery } from "@tanstack/react-query";
import { userKeys } from '../../components/userQueries';

const getUserAuth = async (): Promise<AuthResponse> => {
  let res = await AuthService.isAuthenticated()
  console.log(res);
  return res;
}

export const useUser = () => useQuery<AuthResponse>(userKeys.user, getUserAuth)