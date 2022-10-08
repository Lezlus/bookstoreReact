import { UserLoginType, UserRegisterType } from '../types';
import { FetchOptions } from './utility';
import { AuthResponse, RegisterAuthResponse } from './auth/authServiceTypes';

class AuthService {
  static baseUrl: string = 'http://localhost:5000/users'

  private static fetchUserData<T>(url: string, errorRes: T, options: FetchOptions): Promise<T> {
    return fetch(url, {
      headers: {'Content-Type': 'application/json; charset=UTF-8'},
      ...options,
    }).then((res) => {
      if (!res.ok) {
        return errorRes
      }
      return res.json() as Promise<T>
    }).catch(err => {
      return errorRes
    }) 
  }

  static login(user: UserLoginType): Promise<AuthResponse> {
    return AuthService.fetchUserData<AuthResponse>(`${this.baseUrl}/login`, {
      isAuthenticated: false,
      user: null
    }, {method: 'POST', credentials: 'include', body: JSON.stringify(user)})
  }

  static register(user: UserRegisterType): Promise<RegisterAuthResponse> {
    return AuthService.fetchUserData<RegisterAuthResponse>(`${this.baseUrl}/register`, {
      message: {userTaken: true, msgError: true}
    }, {method: 'POST', credentials: 'include', body: JSON.stringify(user)})
  }

  static logout(): Promise<AuthResponse> {
    return AuthService.fetchUserData<AuthResponse>(`${this.baseUrl}/logout`, {
      isAuthenticated: false,
      user: null
    }, {method: 'GET', credentials: 'include'})
  }

  static isAuthenticated(): Promise<AuthResponse> {
    return AuthService.fetchUserData(`${this.baseUrl}/authenticated`, {
      isAuthenticated: false, 
      user: null
    }, {method: 'GET', credentials: 'include'})
  }
}
export default AuthService;