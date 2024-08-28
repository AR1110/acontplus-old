import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Observable, throwError} from 'rxjs';
import {jwtDecode} from 'jwt-decode';
import {PATHS, PATHS_API} from "@/enums/main.enum";
import {isCustomUrl} from "@core/interceptors/inject-session.interceptor";
import {ApiResponse} from "@/models/api-response";
import {isValidField} from '@/core/utils/utils';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  currentUser = {};
  private url = `${PATHS_API.SECURITY}${PATHS.ACCOUNT}`;

  constructor(
    private http: HttpClient,
    public router: Router,
  ) {
  }


  setDataEstab<T>(dataEstab: T) {
    localStorage.setItem("data_estab", JSON.stringify(dataEstab))
  }

  getDataEstab() {
    let dataEstab = localStorage.getItem("data_estab");
    try {
      return (typeof dataEstab == 'string') ? JSON.parse(dataEstab) : null
    } catch (e) {
      return null;
    }

  }

  isAuthenticated(): boolean {
    const authToken = this.getToken();
    let expired = false;
    if (isValidField(authToken)) {
      const decodedJwt = jwtDecode(authToken as string);
      const expiration = Number(decodedJwt.exp);
      const now = new Date();
      const currentTimeUTC = Math.floor(now.getTime() / 1000);
      if (expiration < currentTimeUTC) {
        expired = true;
      }
    } else {
      expired = true;
    }
    return !expired;
  };


  // Sign-in
  login(username: string, password: string): Observable<ApiResponse> {
    const url = `${this.url}login`;
    const userAgent = JSON.stringify({
      application: "Restaurant",
      browser: navigator.userAgent
    })
    const body = {
      username,
      password,
      userAgent,
      external: true,
    }

    return this.http.post<ApiResponse>(`${url}`, body, {
      context: isCustomUrl()
    })


  }

  setToken(token: string) {
    localStorage.setItem("token", token)
  }

  getToken() {
    return localStorage.getItem('token');
  }

  setUserData(userData: any) {
    localStorage.setItem("user_data", JSON.stringify(userData))
  }

  getUserData() {
    let userDataStr = localStorage.getItem("user_data");
    if (userDataStr) {
      return JSON.parse(userDataStr)
    }
    return null
  }

  parseJwt() {
    try {
      let token = this.getToken();
      if (token) {
        return JSON.parse(atob(token.split('.')[1]));
      }
    } catch (e) {
      return null;
    }
  }

  logout() {

    Object.keys(localStorage).forEach(function (key) {
      localStorage.removeItem(key);
    });
    this.router.navigate(['/', 'auth']);

  }

  // User profile
  // getUserProfile(id: any): Observable<any> {
  //   let api = `${this.URL}/user-profile/${id}`;
  //   return this.http.get(api, { headers: this.headers }).pipe(
  //     map((res) => {
  //       return res || {};
  //     }),
  //     catchError(this.handleError)
  //   );
  // }

  // Error
  handleError(error: HttpErrorResponse) {
    let msg = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      console.log('client error');
      msg = error.error.message;
    } else {
      // server-side error
      console.log('server error', error.error);
      msg = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(() => new Error(msg));
  }
}
