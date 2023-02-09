import { SubscriptionLike } from "rxjs";

export class SubSink {
  protected _subs: SubscriptionLike[] = [];

  constructor() {}

  add(...subscriptions: SubscriptionLike[]) {
    this._subs = this._subs.concat(subscriptions);
  }

  set sink(subscription: SubscriptionLike) {
    this._subs.push(subscription);
  }
  
  unsubscribe() {
    this._subs.forEach((sub) => sub && sub.unsubscribe());
    this._subs = [];
  }
}
