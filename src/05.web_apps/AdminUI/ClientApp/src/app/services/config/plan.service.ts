import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class PlanService {
  baseUrl ='https://localhost:7224/'
  constructor(private httpClient: HttpClient) { }

  getAll(){
    return this.httpClient.get(`${this.baseUrl}api/Menu/Get/${JSON.stringify({test:'test'})}`);
    // return this.httpClient.get(this.baseUrl + 'api/Menu' + '/Get/' + '{"test": "test"}');
  }
}
