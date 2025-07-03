import { DomainEvent } from './domain-event';
import {EntityId} from "@core/domain/entity-id";

export abstract class BaseEntity<TId extends EntityId> {
  private _domainEvents: DomainEvent[] = [];

  constructor(protected readonly _id: TId) {}

  get id(): TId {
    return this._id;
  }

  get domainEvents(): readonly DomainEvent[] {
    return this._domainEvents;
  }

  protected recordEvent(event: DomainEvent): void {
    this._domainEvents.push(event);
  }

  clearEvents(): void {
    this._domainEvents = [];
  }

  equals(entity: BaseEntity<TId>): boolean {
    if (!(entity instanceof this.constructor)) {
      return false;
    }
    return this._id === entity._id;
  }
}
