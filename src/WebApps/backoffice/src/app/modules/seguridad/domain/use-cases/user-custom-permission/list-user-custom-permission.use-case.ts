import {  Injectable } from '@angular/core';
import {BaseUseCase} from "@core/base-use-case";
import { Observable } from 'rxjs';
import {UserCustomPermissionResponse} from "@modules/seguridad/domain/models/user-custom-permission.model";
import {UserCustomPermissionRepository} from "@modules/seguridad/domain/repositories/user-custom-permission.repository";
@Injectable({
  providedIn: 'root',
})
export class ListUserCustomPermissionUseCase implements BaseUseCase<UserCustomPermissionResponse, any> {
  constructor(private repo:UserCustomPermissionRepository) {
  }

  execute(params: any): Observable<UserCustomPermissionResponse> {
        return this.repo.list(params)
    }





}
