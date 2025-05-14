import {  Injectable } from '@angular/core';
import {BaseUseCase} from "@core/base-use-case";
import {
  AsignacionPuntoEmisionList,
  AsignacionPuntoEmisionResponse
} from "@modules/config/domain/models/user-customer/asignacion-punto-emision.model";
import {
  AsignacionPuntoEmisionRepository
} from "@modules/config/domain/repositories/asignacion-punto-emision.repository";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ListAsignacionPuntoEmisionUseCase implements BaseUseCase<AsignacionPuntoEmisionResponse, Partial<AsignacionPuntoEmisionList>> {
  constructor(private repo: AsignacionPuntoEmisionRepository) {
  }

  execute(params: Partial<AsignacionPuntoEmisionList>): Observable<AsignacionPuntoEmisionResponse> {
       return this.repo.list(params)
    }





}
