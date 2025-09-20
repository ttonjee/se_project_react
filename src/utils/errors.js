// Custom error classes for the WTWR application

// Base application error class
export class ApplicationError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Validation errors (400)
export class ValidationError extends ApplicationError {
  constructor(message) {
    super(message, 400);
  }
}

// Authentication errors (401)
export class AuthError extends ApplicationError {
  constructor(message) {
    super(message, 401);
  }
}

// Forbidden errors (403)
export class ForbiddenError extends ApplicationError {
  constructor(message) {
    super(message, 403);
  }
}

// Not found errors (404)
export class NotFoundError extends ApplicationError {
  constructor(message) {
    super(message, 404);
  }
}

// Conflict errors (409)
export class ConflictError extends ApplicationError {
  constructor(message) {
    super(message, 409);
  }
}

// Server errors (500)
export class ServerError extends ApplicationError {
  constructor(message) {
    super(message, 500);
  }
}

// Network errors (for connection issues)
export class NetworkError extends ApplicationError {
  constructor(message) {
    super(message, 0); // 0 indicates network connectivity issue
  }
}

// HTTP status code constants
export const ERROR_CODES = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
};

// Helper function to create appropriate error from HTTP status code
export function createErrorFromStatus(status, message = '') {
  switch (status) {
    case ERROR_CODES.BAD_REQUEST:
      return new ValidationError(message || 'Bad Request');
    case ERROR_CODES.UNAUTHORIZED:
      return new AuthError(message || 'Unauthorized');
    case ERROR_CODES.FORBIDDEN:
      return new ForbiddenError(message || 'Forbidden');
    case ERROR_CODES.NOT_FOUND:
      return new NotFoundError(message || 'Not Found');
    case ERROR_CODES.CONFLICT:
      return new ConflictError(message || 'Conflict');
    case ERROR_CODES.INTERNAL_SERVER_ERROR:
      return new ServerError(message || 'Internal Server Error');
    default:
      if (status >= 500) {
        return new ServerError(message || 'Server Error');
      } else if (status >= 400) {
        return new ValidationError(message || 'Client Error');
      } else {
        return new ApplicationError(message || 'Unknown Error', status);
      }
  }
}
