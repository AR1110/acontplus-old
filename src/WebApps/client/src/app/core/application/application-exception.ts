export abstract class ApplicationException extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, ApplicationException.prototype);
  }
}

export class EntityNotFoundException extends ApplicationException {
  constructor(entityName: string, id: string | number) {
    super(`${entityName} with id '${id}' was not found`);
  }
}

export class EntityAlreadyExistsException extends ApplicationException {
  constructor(entityName: string, field: string, value: string) {
    super(`${entityName} with ${field} '${value}' already exists`);
  }
}

export class UnauthorizedException extends ApplicationException {
  constructor(operation: string) {
    super(`Unauthorized to perform operation: ${operation}`);
  }
}

export class ValidationException extends ApplicationException {
  constructor(errors: Record<string, string[]>) {
    const errorMessages = Object.entries(errors)
      .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
      .join('; ');
    super(`Validation failed: ${errorMessages}`);
  }
}
