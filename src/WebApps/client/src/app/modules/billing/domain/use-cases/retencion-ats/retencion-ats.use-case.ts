import { inject, Injectable } from '@angular/core';
import { RetencionAtsRepository } from '../../repositories/retencion-ats/retencion-ats.repository';

@Injectable({
  providedIn: 'root',
})
export class RetencionAtsUseCase {
  private readonly _retencionAtsRepository = inject(RetencionAtsRepository);

  cancel(id: number) {
    return this._retencionAtsRepository.cancel(id);
  }

  getDataForm(parameters: unknown) {
    return this._retencionAtsRepository.getDataForm(parameters);
  }

  getAll<T>(parameters: T) {
    return this._retencionAtsRepository.getAll(parameters);
  }

  getById(id: number) {
    return this._retencionAtsRepository.getById(id);
  }

  getDocs(parameters: unknown) {
    return this._retencionAtsRepository.getDocs(parameters);
  }

  create<T>(data: T) {
    return this._retencionAtsRepository.create(data);
  }

  update<T>(id: number, data: T) {
    return this._retencionAtsRepository.update(id, data);
  }
}
