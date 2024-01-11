import { Injectable } from "@angular/core";
import { PATHS_API } from "@core/constants/global.constants";
import { CONFIG_PATHS } from "../constants/config.constants";
import { HttpClient } from "@angular/common/http";


@Injectable({
  providedIn: 'root'
})


export class UserPermissionService {

  private url = `${PATHS_API.CONFIG}${CONFIG_PATHS.USER_PERMISSION}`

  constructor(
    private http: HttpClient
  ) { }


  checkHasPermission<T>(params: T) {
    
    let paramsStr = JSON.stringify(params)
    return this.http.get(`${this.url}CheckHasPermission/${paramsStr}`)
  }

}