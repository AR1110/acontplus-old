import { inject, Injectable } from '@angular/core';
import { SolicitudUsuarioRepository } from '@modules/config/data/repositories/solicitud-usuario.repository';

@Injectable({
  providedIn: 'root',
})
export class SolicitudUsuarioUseCase {
  private readonly _repo = inject(SolicitudUsuarioRepository);

  getFilter() {
    return this._repo.getFilter();
  }

  getAll<T>(obj: T) {
    return this._repo.getAll(obj);
  }

  put<T>(obj: T) {
    return this._repo.put(obj);
  }
}
