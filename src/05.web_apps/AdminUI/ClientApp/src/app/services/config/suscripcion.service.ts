import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Suscripcion } from '@models/config/suscripcion.model';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class SuscripcionService {
  private appiUrl = `${environment.baseUrl}api/Suscripcion`;

  constructor(
    private http: HttpClient
  ) { }

  getAll(){
    return this.http.get<Suscripcion[]>(`${this.appiUrl}/Get/${JSON.stringify({'test':'test'})}`);
  }

  save(data:any){
    return this.http.post(`${this.appiUrl}/Post/`, data);
  }

  update(idSuscripcion:number, data:any){
    return this.http.put(`${this.appiUrl}/Put?id=${idSuscripcion}`, data);
  }

  delete(idSuscripcion:number){
    return this.http.delete(`${this.appiUrl}/Delete?id=${idSuscripcion}`);
  }

}
