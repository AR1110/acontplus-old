
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiPaths } from '@app/enums/api-paths';
import { AccesoMenuAccionPut, AccesoMenuSubMenuPut} from '@app/models/admin/acceso-menu.model';
import { StructureResponse } from '@app/models/structure-response.model';
import { environment } from '@env/environment';
import { map, pipe } from 'rxjs';

@Injectable({
  providedIn: 'root'
})


export class AccesoMenuService {
  private BASE_URL = environment.baseUrl;
  private URL      = this.BASE_URL + ApiPaths.AccesoMenu;


  constructor(private _http:HttpClient){
  }

  getAll(json:any){
    return this._http.get<StructureResponse>(`${this.URL}/Get/${JSON.stringify(json)}`)
    .pipe(map(data=>JSON.parse(data.payload)));
  }

  update(jsonSubMenu:any, jsonAccion:any){
    const obj = {
      jsonSubMenu: JSON.stringify(jsonSubMenu),
      jsonAccion: JSON.stringify(jsonAccion)
    }
    return this._http.put<StructureResponse>(`${this.URL}/Put`, obj)
    .pipe(map(data=>JSON.parse(data.payload)[0]))

  }

}
