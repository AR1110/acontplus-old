export abstract class BaseUseCase<TCommand, TResult> {
  abstract execute(command: TCommand): Promise<TResult>;
}

export abstract class BaseQuery<TQuery, TResult> {
  abstract execute(query: TQuery): Promise<TResult>;
}

export interface Command {
  readonly timestamp: Date;
}

export interface Query {
  readonly timestamp: Date;
}

export abstract class BaseCommand implements Command {
  public readonly timestamp: Date;

  constructor() {
    this.timestamp = new Date();
  }
}

export abstract class BaseQueryParams implements Query {
  public readonly timestamp: Date;

  constructor() {
    this.timestamp = new Date();
  }
}
