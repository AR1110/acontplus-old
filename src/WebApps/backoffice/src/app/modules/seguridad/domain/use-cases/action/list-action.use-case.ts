import {  Injectable } from '@angular/core';
import {BaseUseCase} from "@core/base-use-case";
import {ActionRepository} from "@modules/seguridad/domain/repositories/action.repository";
import {ActionResponse} from "@modules/seguridad/domain/models/action.model";
@Injectable({
  providedIn: 'root',
})
export class ListActionUseCase implements BaseUseCase<ActionResponse, any> {
  constructor(private repo:ActionRepository) {
  }

  execute(params: any)  {
        return this.repo.list(params)
    }





}
