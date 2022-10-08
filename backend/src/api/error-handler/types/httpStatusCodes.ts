type StatusCodes = 200 | 201 | 400 | 401 |  404 | 500

type StatusCodesTypes = {
  OK: StatusCodes,
  Created: StatusCodes
  BAD_REQUEST: StatusCodes,
  NOT_FOUND: StatusCodes,
  INTERNAL_SERVER: StatusCodes,
  Unauthorized: StatusCodes
}

const httpStatusCodes: StatusCodesTypes = {
  OK: 200,
  Created: 201,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER: 500,
  Unauthorized: 401
}

export { httpStatusCodes, StatusCodes }