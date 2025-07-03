export abstract class DomainEvent {
  public readonly occurredOn: Date;
  public readonly eventVersion: number;

  constructor(eventVersion = 1) {
    this.occurredOn = new Date();
    this.eventVersion = eventVersion;
  }

  abstract get eventName(): string;
}
