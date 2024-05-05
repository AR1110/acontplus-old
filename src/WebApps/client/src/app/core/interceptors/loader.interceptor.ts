import { HttpContext, HttpContextToken, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { hideLoader, showLoader } from '@core/utils/loader';
import { finalize } from 'rxjs/operators';

const isLoader = new HttpContextToken<boolean>(() => true);
export function getNoLoader() {
  return new HttpContext().set(isLoader, false);
}

export const loaderInterceptor: HttpInterceptorFn = (req, next) => {
  let requests: HttpRequest<any>[] = [];

  if (!req.context.get(isLoader)){
    return next(req);
  }

  // console.log('is loader', req.context.get(isLoader))

  requests.push(req);

  // console.log("No of requests--->" + requests.length);

  if (requests.length === 1) {
    showLoader();
  }

  return next(req).pipe(
    finalize(() => {
      removeRequest(req);
    })
  );

  function removeRequest(req: HttpRequest<any>): void {
    const i = requests.indexOf(req);
    if (i >= 0) {
      requests.splice(i, 1);
    }

    if (requests.length === 0) {
      hideLoader();
    }
  }
}
