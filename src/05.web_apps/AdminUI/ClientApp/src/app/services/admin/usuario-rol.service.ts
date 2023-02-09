import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiPaths } from '@app/enums/api-paths';
import { GenericResponse, StructureResponse } from '@models/structure-response.model';
import { environment } from '@env/environment';
import { UsuarioRol } from '@models/admin/usuario-rol.model';
import {map, tap} from 'rxjs';
import { ApiPathsCliente } from '@app/enums/api-paths-cliente';

@Injectable({
  providedIn: 'root'
})

export class UsuarioRolService {
  BASE_URL         = environment.baseUrl;
  URL              = this.BASE_URL + ApiPaths.UsuarioRol;

  BASE_URL_CLIENTE = environment.baseClienteUrl;

  constructor(private http:HttpClient){}

  getAll(){
    return this.http.get<StructureResponse>(`${this.BASE_URL_CLIENTE}${ApiPathsCliente.UsuarioRol}/Get/${JSON.stringify({tipo:'G'})}`)
    .pipe(map(res=>JSON.parse(res.data)))
  }

  save(data:UsuarioRol){
    return this.http.post<GenericResponse>(`${this.BASE_URL_CLIENTE}${ApiPathsCliente.UsuarioRol}/Post`, data)
  }

  update(id:number, codRol:string){
    return this.http.put<GenericResponse>(`${this.BASE_URL_CLIENTE}${ApiPathsCliente.UsuarioRol}/Put/${id}/${codRol}`, codRol);
  }

  delete(id:number){
    return this.http.delete<GenericResponse>(`${this.BASE_URL_CLIENTE}${ApiPathsCliente.UsuarioRol}/Delete/${id}`);
  }

  //Obtenemos los usuarios registrados del sistema principal
  getAllUsuario(typeList:number){
    return this.http.get<GenericResponse>(`${this.BASE_URL_CLIENTE}${ApiPathsCliente.Usuario}/Get/${JSON.stringify({typeList})}`)
    .pipe(
      map(res=>JSON.parse(res.data))
    )
  }

  //Obtenemos las Entidades registrados del sistema principal
  getAllEntidad(typeList:number){
    return this.http.get<GenericResponse>(`${this.BASE_URL_CLIENTE}${ApiPathsCliente.Entidad}/Get/${JSON.stringify({typeList})}`)
    .pipe(
      map(res=>JSON.parse(res.data))
    )
  }

  getAllRol(){
    return this.http.get<StructureResponse>(`${this.BASE_URL_CLIENTE}${ApiPathsCliente.Rol}/Get/${JSON.stringify({})}`)
    .pipe(
      map(response=>JSON.parse(response.data)));
  }






}
