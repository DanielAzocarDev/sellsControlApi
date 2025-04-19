export class HttpError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name; // Set the error name to the class name
  }
}

export class ValidationError extends HttpError {
  constructor(message: string) {
    super(message, 400); // Bad Request
  }
}

export class AuthenticationError extends HttpError {
  constructor(message: string) {
    super(message, 401); // Unauthorized
  }
}

export class NotFoundError extends HttpError {
  constructor(message: string = 'Resource not found') {
    super(message, 404);
  }
}

export class AuthorizationError extends HttpError {
    constructor(message: string = 'Authorization failed') {
        super(message, 403);
    }
}

// Puedes añadir más clases de error según necesites (e.g., DatabaseError, ConflictError, etc.)
