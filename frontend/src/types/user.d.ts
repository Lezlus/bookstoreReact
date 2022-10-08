import { UserShape } from '../../../backend/src/api/models';

type UserLoginType = {
  username: string
  password: string
}

type UserRegisterType = {
  first_name: string
  last_name: string
  username: string
  password: string
}

interface User extends UserShape {

}

export type { UserLoginType, User, UserRegisterType }