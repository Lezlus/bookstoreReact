import { User } from '../../types';
interface AuthResponse {
  isAuthenticated: boolean
  user: User | null;
}

interface RegisterAuthResponse {
  message: {userTaken: boolean, msgError: boolean};
}

export type { AuthResponse, RegisterAuthResponse }