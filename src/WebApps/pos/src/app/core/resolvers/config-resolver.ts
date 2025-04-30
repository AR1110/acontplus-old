import { inject } from "@angular/core";
import { ResolveFn, Router } from "@angular/router";
import { TokenUseCase } from "@domain/use-cases/token.use-case";
import { GetEstabsConfigUseCase } from "@domain/use-cases/config/get-estabs-config.use-case";
import { catchError, map, of } from "rxjs";
import { LayoutStore } from "@ui/store/layout.store";

export const configDataResolver: ResolveFn<any> = (route, state) => {
  const _tokenUseCase = inject(TokenUseCase);
  const $layoutStore = inject(LayoutStore);
  const router = inject(Router);
  const $getEstabsUseCase = inject(GetEstabsConfigUseCase);
  const dataEstab = _tokenUseCase.getDataEstab();

  return $getEstabsUseCase.execute().pipe(
    map(response => {
      const groupedEstab = response.estabs.find(e => e.idEstablecimiento === dataEstab.idEstablecimiento);

      if (groupedEstab) {
        $layoutStore.setData(groupedEstab, response.estabs);
        return response;
      } else {
        throw new Error('No se pudo recuperar el establecimiento');
      }
    }),
    catchError(error => {
      router.navigateByUrl('auth').then()
      return of(null);
    })
  );
};
