export abstract class DomainException extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, DomainException.prototype);
  }
}

export class InvalidOperationException extends DomainException {
  constructor(operation: string, reason: string) {
    super(`Invalid operation '${operation}': ${reason}`);
  }
}

export class ValidationException extends DomainException {
  constructor(field: string, value: any, rule: string) {
    super(`Validation failed for field '${field}' with value '${value}': ${rule}`);
  }
}
