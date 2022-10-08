import { StatusCodes } from './types/httpStatusCodes';
import { ErrorBody } from './types/errorBody';

class BaseError<T = {}> extends Error {
  name: string;
  isOperational: boolean;
  statusCode: StatusCodes;
  responseBody: ErrorBody & T

  constructor(name: string, statusCode: StatusCodes, 
    isOperational: boolean, description: string, body: T) {
    super(description);
    Object.setPrototypeOf(this, new.target.prototype);
    this.statusCode = statusCode;
    this.name = name;
    this.isOperational = isOperational;
    this.responseBody = {isError: true, message: name, ...body}
  }
}

export { BaseError }