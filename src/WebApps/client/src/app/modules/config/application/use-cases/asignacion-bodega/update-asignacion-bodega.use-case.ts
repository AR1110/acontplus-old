import {  Injectable } from '@angular/core';
import {BaseUseCase} from "@core/base-use-case";
import { Observable } from 'rxjs';
import {ApiResponse} from "@core/models/api-response";
import {AsignacionBodegaList} from "@modules/config/domain/models/user-customer/asignacion-bodega.model";
import {AsignacionBodegaRepository} from "@modules/config/domain/repositories/asignacion-bodega.repository";

@Injectable({
  providedIn: 'root',
})
export class UpdateAsignacionBodegaUseCase implements BaseUseCase<ApiResponse, Partial<AsignacionBodegaList>> {
  constructor(private repo:AsignacionBodegaRepository) {
  }

  execute(params: Partial<AsignacionBodegaList>): Observable<ApiResponse<unknown>> {
        return this.repo.update(params)
    }



}
