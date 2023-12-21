import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, throwError } from 'rxjs';
import { hideLoader, showLoader } from '@core/utils';
import { environment } from 'src/environments/environment';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private URL = environment.API_URL + "Account/"

  headers = new HttpHeaders().set('Content-Type', 'application/json');
  currentUser = {};

  constructor(private http: HttpClient, public router: Router) { }

  // Sign-up
  signUp(user: User): Observable<any> {
    let api = `${this.URL}register`;
    return this.http.post(api, user).pipe(catchError(this.handleError));
  }

  // Sign-in
  signIn(user: User) {
    console.log(user)
    const self = this;
    showLoader();
    return this.http
      .post<any>(`${this.URL}login`, user).subscribe({
        next(res) {
          hideLoader();
          console.log(res)
          localStorage.setItem('access_token', res.token);
          // self.getUserProfile(res._id).subscribe((res) => {
          //   self.currentUser = res;
          self.router.navigate(['/', 'home']);
          // });
        },
        error(err) {
          hideLoader();
          if (err.error.statusCode === 401) {
          }
        },
        complete() {
          hideLoader()
        },
      })
  }

  getToken() {
    return localStorage.getItem('access_token');
  }

  get isLoggedIn(): boolean {
    let authToken = localStorage.getItem('access_token');
    return authToken !== null ? true : false;
  }

  doLogout() {
    let removeToken = localStorage.removeItem('access_token');
    if (removeToken == null) {
      this.router.navigate(['/', 'auth'])
    }
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
      console.log('client error')
      msg = error.error.message;
    } else {
      // server-side error
      console.log('server error', error.error)
      msg = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(() => new Error(msg));
  }
}
