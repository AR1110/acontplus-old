import { Injectable } from '@angular/core';
import {BaseUseCase} from "@core/base-use-case";
import {
  AsignacionPuntoEmisionRepository
} from "@modules/config/domain/repositories/asignacion-punto-emision.repository";
import {ApiResponse} from "@core/models/api-response";
import {AsignacionPuntoEmisionList} from "@modules/config/domain/models/user-customer/asignacion-punto-emision.model";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CreateAsignacionPuntoEmisionUseCase implements BaseUseCase<ApiResponse, Partial<AsignacionPuntoEmisionList>> {
  constructor(private repo: AsignacionPuntoEmisionRepository) {
  }

  execute(params: Partial<AsignacionPuntoEmisionList>): Observable<ApiResponse<unknown>> {
        return this.repo.create(params)
    }



}
