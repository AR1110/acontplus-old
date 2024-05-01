import { Injectable } from '@angular/core';
import {
  HttpResponse,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { hideLoader, showLoader } from '@core/utils/loader';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
  private requests: HttpRequest<any>[] = [];

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    this.requests.push(req);

    console.log("No of requests--->" + this.requests.length);

    if (this.requests.length === 1) {
      showLoader();
    }

    return next.handle(req).pipe(
      finalize(() => {
        this.removeRequest(req);
      })
    );
  }

  private removeRequest(req: HttpRequest<any>): void {
    const i = this.requests.indexOf(req);
    if (i >= 0) {
      this.requests.splice(i, 1);
    }

    if (this.requests.length === 0) {
      hideLoader();
    }
  }
}
