import { Observable, throwError, of } from 'rxjs';
import { catchError, finalize, switchMap } from 'rxjs/operators';

export function fetchLimitUtil<T>(fn: (...args: any[]) => Observable<T>): (...args: any[]) => Observable<T> {
  let executing = false;

  return (...args: any[]): Observable<T> => {

    try {
    if (executing) {
      console.warn("Otra solicitud ya está en ejecución. Espera a que se complete.");
      return throwError(() => new Error("Solicitud en curso"));
    }

    executing = true;
    console.log("Estado de executing antes de la llamada:", executing);

    return fn(...args).pipe(
      switchMap(result => {
        console.log("Resultado exitoso:", result);
        return of(result); // Emitir el resultado si todo está bien
      }),
      catchError(error => {
        console.error('Error al ejecutar la función:', error);
        return throwError(() => error); // Asegúrate de propagar el error
      }),
      finalize(() => {
        executing = false; // Esto se ejecutará sin importar si hubo error o no
        console.log("Estado de executing después de la llamada:", executing);
      })
    );
    } catch (error) {
      // Si ocurre un error fuera del flujo observable, también resetear `executing`
      executing = false;
      return throwError(() => new Error("Error inesperado: " + error));
    }
  };
}


