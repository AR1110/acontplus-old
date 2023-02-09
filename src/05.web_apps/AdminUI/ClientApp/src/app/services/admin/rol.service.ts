import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, inject } from '@angular/core';
import { ApiPaths } from '@app/enums/api-paths';
import { ApiPathsCliente } from '@app/enums/api-paths-cliente';
import { GenericResponse, StructureResponse} from '@models/structure-response.model';
import { environment } from '@env/environment';
import { Rol } from '@app/models/admin/rol.model';
import {map, switchMap, tap} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RolService {
  BASE_URL = environment.baseUrl;
  URL = this.BASE_URL + ApiPaths.Rol;

  baseClienteUrl = environment.baseClienteUrl;
  urlCliente = this.baseClienteUrl + ApiPathsCliente.Rol
  private baseUrl = '';

  constructor(private http:HttpClient,  @Inject('BASE_URL') baseUrl: string){
    this.baseUrl = baseUrl;
  }

  getAll(){
    return this.http.get<StructureResponse>(`${this.baseUrl}${ApiPaths.Rol}/Get/${JSON.stringify({typeList: 1})}`)
    .pipe(map(data=>JSON.parse(data.payload)))
  }

  save(data: any){
    return this.http.post<StructureResponse>(`${this.URL}/Post`, data)
    .pipe(map(response=>JSON.parse(response.payload)[0]))
  }

  update(id:number, data: Rol){
    return this.http.put<StructureResponse>(`${this.URL}/Put?id=${id}`, data)
    .pipe(
      tap(res=>console.log(res)),
      map(data=>JSON.parse(data.payload)[0]))
  }

  delete(id:number){
    return this.http.delete<StructureResponse>(`${this.URL}/Delete?id=${id}`)
    .pipe(map(data=>JSON.parse(data.payload)[0]))
  }

  duplicate(idRol:number, data:any){
    return this.http.post<StructureResponse>(`${this.URL}/Duplicate?id=${idRol}`, data)
    .pipe(map(data=>JSON.parse(data.payload)[0]))
  }

  getAllPlanCliente(){
    return this.http.get<StructureResponse>(`${this.BASE_URL}${ApiPaths.PlanCliente}/Get/${JSON.stringify({typeList:1})}`)
    .pipe(map(data=>JSON.parse(data.payload)))
  }



  updateRolCliente(data:any){
    return this.http.put(`${this.baseClienteUrl}apiCliente/Rol/Put/'P'/'Politica'`, data).pipe(
      tap(response=>{
        console.log(response)
      })
    )
  }




}
