import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ApiPaths } from '@enums/api-paths';
import { GenericResponse } from '@models/structure-response.model';
import { environment } from '@env/environment';
import { Entidad } from '@models/admin/entidad.model';
import { ApiPathsCliente } from '@app/enums/api-paths-cliente';

@Injectable({
  providedIn: 'root'
})
export class EntidadService {
  private BASE_URL_CLIENTE = environment.baseClienteUrl;
  private URL_CLIENTE = this.BASE_URL_CLIENTE + ApiPathsCliente.Entidad

  constructor(private http:HttpClient, @Inject('BASE_URL') baseUrl: string){}

  getAll(){
    return this.http.get<GenericResponse>(`${this.URL_CLIENTE}/Get/${JSON.stringify({tipo:'G'})}`);
  }

  save(data:Entidad){
    return this.http.post<GenericResponse>(`${this.URL_CLIENTE}/Post`, data);
  }

  update(idEntidad:number, data:Entidad){
    return this.http.put<GenericResponse>(`${this.URL_CLIENTE}/Put/${idEntidad}`, data);
  }

  delete(id:number){
    return this.http.delete<GenericResponse>(`${this.URL_CLIENTE}/Delete/${id}`);
  }

}
