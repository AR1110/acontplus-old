import { BehaviorSubject, map } from 'rxjs';

export class GenericStoreBehaviorSubjectService<T> {
  private readonly state = new BehaviorSubject({} as T);

  constructor() {}

  public select<K extends keyof T>(key: K): BehaviorSubject<T[K]> {
    return this.state.pipe(map((state) => state[key])) as BehaviorSubject<T[K]>;
  }

  public set<K extends keyof T>(key: K, data: T[K]) {
    const currentState = this.state.value;
    const newState = { ...currentState, [key]: data };
    this.state.next(newState);
  }

  public setState(partialState: Partial<T>): void {
    const currentState = this.state.value;
    const newState = { ...currentState, ...partialState };
    this.state.next(newState);
  }
}
