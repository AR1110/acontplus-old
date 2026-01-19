import {  Injectable } from '@angular/core';
import {BaseUseCase} from "@core/base-use-case";
import {ActionRepository} from "@modules/seguridad/domain/repositories/action.repository";
import {ApiResponse} from "acontplus-utils";
@Injectable({
  providedIn: 'root',
})
export class UpdateActionUseCase implements BaseUseCase<ApiResponse, any> {
  constructor(private repo:ActionRepository) {
  }

  execute(params: any)  {
        return this.repo.update(params)
    }





}
