import {  Injectable } from '@angular/core';
import {BaseUseCase} from "@core/base-use-case";
import { Observable } from 'rxjs';
import {ImportacionResponse} from "@modules/config/domain/models/importacion.model";
import {ImportacionRepository} from "@modules/config/domain/repositories/importacion.repository";

@Injectable({
  providedIn: 'root',
})
export class GetFormDataImportacionUseCase implements BaseUseCase<ImportacionResponse, any> {
  constructor(private repo: ImportacionRepository) {
  }

  execute(): Observable<ImportacionResponse> {
       return this.repo.getFormData()
    }


}
