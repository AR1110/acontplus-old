import {  Injectable } from '@angular/core';
import {BaseUseCase} from "@core/base-use-case";
import { Observable } from 'rxjs';
import {
  UserCustomPermissionDataForm,
} from "@modules/seguridad/domain/models/user-custom-permission.model";
import {UserCustomPermissionRepository} from "@modules/seguridad/domain/repositories/user-custom-permission.repository";
@Injectable({
  providedIn: 'root',
})
export class GetUserCustomPermissionFormDataUseCase implements BaseUseCase<UserCustomPermissionDataForm, any> {
  constructor(private repo:UserCustomPermissionRepository) {
  }

  execute( ): Observable<UserCustomPermissionDataForm> {
        return this.repo.getFormData()
    }





}
