import { Injectable, inject } from '@angular/core';
import { VehicleRepository } from '@mechanical/domain/repositories/vehicle.repository';

@Injectable({
  providedIn: 'root',
})
export class VehicleUseCase {
  private repo = inject(VehicleRepository);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  getDataForm() {
    return this.repo.getDataForm();
  }

  getId(id: number, loader?: boolean) {
    return this.repo.getId(id, loader);
  }

  remove(id: number) {
    return this.repo.remove(id);
  }

  post<T>(data: T) {
    return this.repo.post(data);
  }

  put<T>(id: number, data: T) {
    return this.repo.put(id, data);
  }

  putState(id: number, state: boolean) {
    return this.repo.putState(id, state);
  }
}
