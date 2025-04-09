import {  Injectable } from '@angular/core';
import {BaseUseCase} from "@core/base-use-case";
import { Observable } from 'rxjs';
import {GeneralConfigRepository} from "@modules/config/domain/repositories/general-config.repository";
import {GeneralConfigResponse} from "@modules/config/domain/models/general-config.model";

@Injectable({
  providedIn: 'root',
})
export class ListGeneralConfigUseCase implements BaseUseCase<GeneralConfigResponse, string> {
  constructor(private repo: GeneralConfigRepository) {
  }

  execute(params: string): Observable<GeneralConfigResponse> {
       return this.repo.list(params)
    }


}
