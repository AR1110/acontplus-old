import { Injectable } from '@angular/core';
import {BaseUseCase} from "@core/base-use-case";
import {ApiResponse} from "@core/models/api-response";
import {AsignacionEstabRepository} from "@modules/config/domain/repositories/asignacion-estab.repository";

@Injectable({
  providedIn: 'root',
})
export class CreateAsignacionEstabUseCase implements BaseUseCase<ApiResponse, any> {
  constructor(private repo: AsignacionEstabRepository) {
  }

  execute(params: any)  {
        return this.repo.create(params)
    }

}
