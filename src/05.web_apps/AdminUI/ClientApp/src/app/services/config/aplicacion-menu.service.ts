import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ApiPaths } from "@enums/api-paths";
import { AplicacionMenuCreateDTO, AplicacionMenuUpdateDTO } from "@models/config/aplicacion-menu.model";
import { StructureResponse } from "@models/structure-response.model";
import { environment } from "@env/environment";
import { map } from "rxjs";

@Injectable({
  providedIn:'root'
})

export class AplicacionMenuService{
  baseUrl: string = environment.baseUrl;
  url: string =`${this.baseUrl}${ApiPaths.AplicacionMenu}`

  constructor(
    private http:HttpClient
  ){}

  getAll(){
    return this.http.get<StructureResponse>(`${this.url}/Get/${JSON.stringify({tipo:'G'})}`)
    .pipe(map(data=>JSON.parse(data.payload)))
  }

  save(data:AplicacionMenuCreateDTO){
    return this.http.post<StructureResponse>(`${this.url}/Post`, data)
    .pipe(map(res=>JSON.parse(res.payload)[0]))
  }

  update(id:number, data:AplicacionMenuUpdateDTO){
    return this.http.put<StructureResponse>(`${this.url}/Put?id=${id}`, data)
    .pipe(map(res=>JSON.parse(res.payload)[0]))
  }

  delete(id:number){
    return this.http.delete<StructureResponse>(`${this.url}/Delete?id=${id}`)
    .pipe(map(data=>JSON.parse(data.payload)[0]))
  }

  getAllAplicacion(){
    return this.http.get<StructureResponse>(`${this.baseUrl}api/Aplicacion/Get/${JSON.stringify({tipo:'O'})}`)
    .pipe(map(data=>JSON.parse(data.payload)))
  }

  getAllMenu(){
    return this.http.get<StructureResponse>(`${this.baseUrl}${ApiPaths.Menu}/GetAll`)
    .pipe(map(data=>JSON.parse(data.payload)))
  }

  getSubMenuByMenu(idMenu:number){
    return this.http.get<StructureResponse>(`${this.baseUrl}${ApiPaths.SubMenu}/GetSubMenuByMenu/${idMenu}`)
    .pipe(map(data=>JSON.parse(data.payload)))
  }



}
