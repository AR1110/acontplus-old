import { Observable, of, throwError } from 'rxjs';
import { catchError, finalize, switchMap } from 'rxjs/operators';

export function fetchLimitUtil<T>(fn: (...args: any[]) => Observable<T>): (...args: any[]) => Observable<T> {
  let executing = false;

  return (...args: any[]): Observable<T> => {
    if (executing) {
      console.warn("Otra solicitud ya está en ejecución. Espera a que se complete.");
      return throwError(() => new Error("Solicitud en curso")); // Mensaje de error claro
    }

    executing = true;

    return fn(...args).pipe(
      switchMap(result => {
        return of(result); // Emitir el resultado si todo está bien
      }),
      catchError(error => {
        console.error('Error al ejecutar la función:', error);
        return throwError(() => error); // Emitir el error
      }),
      finalize(() => {
        executing = false; // Restablecer el estado después de la ejecución
      })
    );
  };
}
