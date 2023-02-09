import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { GenericResponse} from '@models/structure-response.model';
import { environment } from '@env/environment';
import { UsuarioUpdateDTO } from '@app/models/admin/usuario.model';
import { ApiPathsCliente } from '@app/enums/api-paths-cliente';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  BASE_URL_CLIENTE = environment.baseClienteUrl;
  URL_CLIENTE = this.BASE_URL_CLIENTE + ApiPathsCliente.Usuario



  constructor(
    private http:HttpClient,
    @Inject('BASE_URL') baseUrl: string
  ){
    
  }

  getAll(){
    return this.http.get<GenericResponse>(`${this.URL_CLIENTE}/Get/${JSON.stringify({tipo:'G'})}`)
  }

  save(data:any){
    return this.http.post<GenericResponse>(`${this.URL_CLIENTE}/Post/${JSON.stringify(data)}`, {});
  }

  update(id:number, data:UsuarioUpdateDTO){
    return this.http.put<GenericResponse>(`${this.URL_CLIENTE}/Put/${id}/${JSON.stringify(data)}`, {});
  }

  delete(id:number){
    return this.http.delete<GenericResponse>(`${this.URL_CLIENTE}/Delete/${id}`);
  }

}
