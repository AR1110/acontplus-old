import {   Injectable } from '@angular/core';
import {BaseUseCase} from "@core/base-use-case";
import {GuiaRemisionRepository} from "@billing/domain/repositories/guia-remision.repository";
import {ApiResponse} from "@core/models/api-response";
import {GuiaRemisionDataForm} from "@billing/domain/models/guia-remision.model";

@Injectable({
  providedIn: 'root',
})
export class GetGuiaRemisionFormDataUseCase implements BaseUseCase<ApiResponse<GuiaRemisionDataForm>, void> {
  constructor(private repo: GuiaRemisionRepository) {
  }

  execute( )  {
    return this.repo.getFormData()
    }

}
