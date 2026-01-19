import {  Injectable } from '@angular/core';
import {BaseUseCase} from "@core/base-use-case";
import {UserCustomPermissionRepository} from "@modules/seguridad/domain/repositories/user-custom-permission.repository";
import {ApiResponse} from "acontplus-utils";
@Injectable({
  providedIn: 'root',
})
export class UpdateUserCustomPermissionUseCase implements BaseUseCase<ApiResponse, any> {
  constructor(private repo:UserCustomPermissionRepository) {
  }

  execute( params:any)  {
        return this.repo.update(params)
    }





}
