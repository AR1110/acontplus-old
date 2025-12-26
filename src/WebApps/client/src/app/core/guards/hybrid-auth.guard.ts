import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenUseCase } from '@modules/auth/domain/use-cases/token.use-case';
import { environment } from 'src/environments/environment';

/**
 * Guard híbrido para manejar autenticación durante la migración
 * Soporta:
 * - Rutas legacy con autenticación por query params (Razor Pages)
 * - Rutas modernas con autenticación por token JWT
 */
export const hybridAuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const tokenUseCase = inject(TokenUseCase);


  // Verificar si viene de una ruta legacy (con token en query params)
  const queryParams = route.queryParams;
  const hasLegacyAuth = !!(queryParams['token'] && queryParams['route']);

  // Si viene con autenticación legacy, permitir el acceso
  // El componente App.ts se encargará de procesar los parámetros
  if (hasLegacyAuth) {
    return true;
  }
  console.log('no legacy auth');

  // Para rutas legacy (/legacy/...), el token ya fue procesado por app.ts
  // Solo verificar que exista un token válido
  if (state.url.startsWith('/legacy/')) {
    const hasToken = !!localStorage.getItem(environment.tokenKey);
    if (hasToken) {
      return true; // Permitir acceso, app.ts ya validó la auth
    }
  }

  // Para rutas modernas, verificar el token JWT
  const isTokenValid = !tokenUseCase.isTokenExpired();

  if (!isTokenValid) {
    // Guardar la URL de destino para redirigir después del login
    const returnUrl = state.url;
    void router.navigate(['/auth/login'], {
      queryParams: { returnUrl },
    });
    return false;
  }

  return true;
};
