import {inject, Injectable} from "@angular/core";
import {PATHS, PATHS_API} from "@/enums/main.enum";
import {map} from "rxjs/operators";
import {HttpClient} from "@angular/common/http";


@Injectable({
  providedIn:'root'
})
export class EmailConfigService {
  private http = inject(HttpClient);
  private url = `${PATHS_API.CONFIG}${PATHS.EMAIL_CONFIG}`;
  
  getDataFormNotificacion<T>(params:T){ 
    let json = JSON.stringify({
      tipo: 2,
      ...params
    }) 
    return this.http.get(`${this.url}Get?json=${json}`).pipe(
      map((response:any)=>{
        let data = {
          correos: [],
          telefonos: []
        }
        if (response.code === "1") {
          let [mainData] = JSON.parse(response.payload);
          let { correo, telefono } = mainData[0];

          data.correos = correo ? correo.split(/[\|;]/) : [];
          data.telefonos = telefono ? telefono.split(/[\|;]/) : [];

        }
        return data;
      })
    )
    }

  
}
