import { HttpClient } from '@angular/common/http';
import { Inject, Injectable} from '@angular/core';
import { Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
    
    constructor(private http: HttpClient, @Inject("BASE_URL") private baseUrl: string) {}

    login(username: string, password: string): Observable<any>{
        let body = {
            username,
            password
        }
        return this.http.post(`${this.baseUrl}api/Login/Login`, body)
    }
    
}
