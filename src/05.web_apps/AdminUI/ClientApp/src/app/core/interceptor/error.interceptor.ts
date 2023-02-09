import { AuthService } from '@services/seguridad/auth.service';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { SpinnerService } from '@app/services/spinner.service';
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private authenticationService: AuthService,
    private toast: ToastrService,
    private readonly spinnerSvc: SpinnerService,
    private router: Router
    ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    //this.spinnerSvc.show();
    return next.handle(request).pipe(
      catchError(error=>this.errorHandler(error)),
      finalize(()=>this.spinnerSvc.hide())

      )

        // if (err.status === 401 || err.status===0) {
        //   this.authenticationService.logout();
        //   location.reload();
        // }

        // const error = err.error.message || err.statusText;
        // return throwError(error);
   // );

  }

  errorHandler(error: HttpErrorResponse):Observable<never>{
    if(error instanceof HttpErrorResponse){
      const errorMsg = error.message || error.statusText;
      if(error.status ===0){
      }
      if (error.status === 401 || error.status==0) {
       // this.router.navigateByUrl('auth');
        this.toast.error(errorMsg)
      }
    }
    return throwError(error)
  }

}
