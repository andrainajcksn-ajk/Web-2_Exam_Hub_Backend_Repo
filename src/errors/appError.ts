
export class AppError extends Error {
  public readonly statusCode: number;

  constructor(statusCode: number, message: string ) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class BadRequestError extends AppError {
  constructor(message = 'Données invalides') {
    super(400, message);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Non authentifié') {
    super(401, message);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Non autorisé') {
    super(403, message);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Introuvable') {
    super(404, message);
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Conflit') {
    super(409, message);
  }
}