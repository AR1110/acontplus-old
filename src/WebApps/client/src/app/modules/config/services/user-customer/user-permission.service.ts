import { Injectable } from "@angular/core";
import { PATHS_API } from "@core/constants/global.constants";

import { HttpClient } from "@angular/common/http";
import { CONFIG_PATHS } from "@modules/config/domain/enums/config.enums";
import {ApiResponse} from "@core/models/api-response";


@Injectable({
  providedIn: 'root'
})


export class UserPermissionService {

  private url = `${PATHS_API.CONFIG}${CONFIG_PATHS.USER_PERMISSION}`

  constructor(
    private http: HttpClient
  ) { }


  checkHasPermission<T>(params: T) {

    const paramsStr = JSON.stringify(params)
    return this.http.get<ApiResponse>(`${this.url}CheckHasPermission/${paramsStr}`)
  }

}
