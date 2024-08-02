import {inject, Injectable} from '@angular/core';
import {PATHS_API} from "@core/constants/global.constants";
import {CONFIG_PATHS} from "@modules/config/enums/config.enums";
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private url = `${PATHS_API.CONFIG}${CONFIG_PATHS.COMPANY}`
  private http = inject(HttpClient)

  getAll(){
    let json = JSON.stringify({
      tipo: 1
    })

    return this.http.get(`${this.url}?json=${json}`).pipe(
      map((response:any)=>{
        let {companies} = response;
        return {
          companies
        }
      })
    )

  }


  put<T>(id:number, data:T){
    return this.http.put(`${this.url}${id}`, {data})
  }

}
