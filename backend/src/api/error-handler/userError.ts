import { BaseError } from "./baseError";
import { ErrorCode } from "./types/errorCode";
import { UserAuthResponse } from '../../types/response';
import { StatusCodes, httpStatusCodes } from './types/httpStatusCodes';

class UserAPIError extends BaseError<UserAuthResponse> {
  constructor(name: string, statusCode: StatusCodes = httpStatusCodes.Unauthorized, 
    description: string=ErrorCode.NotFound, isOperational: boolean=true) {
      super(name, statusCode, isOperational, description, 
        {isAuthenticated: false, user: null});
  }
}

export { UserAPIError }