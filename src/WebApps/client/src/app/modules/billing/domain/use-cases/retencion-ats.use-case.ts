import { inject, Injectable } from '@angular/core';
import { RetencionAtsRepository } from '../repositories/retencion-ats.repository';

@Injectable({
  providedIn: 'root',
})
export class RetencionAtsUseCase {
  private readonly _retencionAtsRepository = inject(RetencionAtsRepository);

  getDataForm(parameters: unknown) {
    return this._retencionAtsRepository.getDataForm(parameters);
  }

  getAll<T>(parameters: T) {
    return this._retencionAtsRepository.getAll(parameters);
  }

  getDocs(parameters: unknown) {
    return this._retencionAtsRepository.getDocs(parameters);
  }

  create<T>(data: T) {
    return this._retencionAtsRepository.create(data);
  }
}
