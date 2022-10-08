import { User } from '../../api/models';

interface UserRegisterResponse  {
  message: {userTaken: boolean, msgError: boolean}
}

interface UserAuthResponse {
  isAuthenticated: boolean;
  user: User | null;
}

export type { UserRegisterResponse, UserAuthResponse }