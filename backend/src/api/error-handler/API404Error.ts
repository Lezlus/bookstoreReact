import { BaseError } from "./baseError";
import { ErrorBody } from './types/errorBody';
import { ErrorCode } from "./types/errorCode";
import { StatusCodes, httpStatusCodes } from './types/httpStatusCodes';

class API404Error extends BaseError {
  constructor(name: string, statusCode: StatusCodes = httpStatusCodes.NOT_FOUND, 
    description: string=ErrorCode.NotFound, isOperational: boolean=true) {
      super(name, statusCode, isOperational, description, {});
  }
}

export { API404Error }