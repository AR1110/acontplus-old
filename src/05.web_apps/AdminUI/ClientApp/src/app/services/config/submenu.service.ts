import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Submenu, CreateDTO, UpdateDTO} from "@models/config/submenu.model";
import { StructureResponse } from "@models/structure-response.model";
import { environment } from "@env/environment";
import { map, tap } from "rxjs";


@Injectable({
  providedIn: 'root'
})

export class SubmenuService{
  appiUrl = environment.baseUrl;

  constructor(private http: HttpClient){}

  getAll(){
    return this.http.get<StructureResponse>(`${this.appiUrl}api/SubMenu/Get/${JSON.stringify({tipo:'G'})}`)
    .pipe(
      map(data=>JSON.parse(data.payload))
    )
  }

  getMenuAll(){
    return this.http.get<StructureResponse>(`${this.appiUrl}api/Menu/GetAll`);
  }

  save(data:CreateDTO){
    let params =JSON.stringify(data);
    return this.http.post<StructureResponse>(`${this.appiUrl}api/SubMenu/Post?json=${params}`,null);
  }

  update(id:number, data:UpdateDTO){
    let params =JSON.stringify(data);
    return this.http.put<StructureResponse>(`${this.appiUrl}api/SubMenu/Put?id=${id}&json=${params}`, null)
  }

  delete(id:string){
    return this.http.delete<StructureResponse>(`${this.appiUrl}api/SubMenu/Delete/${id}`);
  }

}
