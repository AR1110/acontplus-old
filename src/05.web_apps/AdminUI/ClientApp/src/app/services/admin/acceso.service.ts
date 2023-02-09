import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ApiPaths } from "@app/enums/api-paths";
import { StructureResponse } from "@app/models/structure-response.model";
import { environment } from "@env/environment";
import { TodoItemNode } from "@models/admin/acceso.model";
import { Observable } from "rxjs";
import { map, tap } from "rxjs/operators";

@Injectable({
  providedIn:'root'
})

export class AccesoService{
  BASE_URL = environment.baseUrl;
  usuarios=[];

  constructor(private http:HttpClient){}

  searchUser(search:string){
   return this.http.get<StructureResponse>(`${this.BASE_URL}${ApiPaths.Usuario}/Search`,{
    params:{
      busqueda:search
    }
  }).pipe(
    map(response=>{
      return JSON.parse(response.payload)
    })
    )

  }

  getUsuarioRolByUser(idUsuario:number){
    return this.http.get<StructureResponse>(`${this.BASE_URL + ApiPaths.UsuarioRol}/GetByUser`, {
      params:{
        id:idUsuario
      }
    }).pipe(
      map(response=>JSON.parse(response.payload))
    )
  }







}
