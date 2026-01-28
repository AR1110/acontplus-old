import { Injectable } from '@angular/core';
import { GlobalRoutes } from '@core/constants/global-routes';

/**
 * Servicio para gestionar la migración progresiva de rutas legacy a Angular moderno
 */
@Injectable({
  providedIn: 'root',
})
export class RouteMigrationService {
  /**
   * Rutas que ya han sido migradas completamente a Angular
   * Estas rutas usarán el guard moderno y no aceptarán autenticación legacy
   */
  private modernRoutes = new Set<string>([
    // Ejemplo: Descomentar cuando estas rutas estén completamente migradas
    // GlobalRoutes.Articulo,
    // GlobalRoutes.Cliente,
    // GlobalRoutes.Factura,
  ]);

  /**
   * Rutas que están en proceso de migración (híbridas)
   * Aceptan tanto autenticación legacy como moderna
   */
  private hybridRoutes = new Set<string>([
    // Por defecto, todas las rutas son híbridas durante la migración
  ]);

  /**
   * Verifica si una ruta ha sido completamente migrada a Angular moderno
   */
  isModernRoute(route: string): boolean {
    return this.modernRoutes.has(route);
  }

  /**
   * Verifica si una ruta está en modo híbrido (acepta legacy y moderno)
   */
  isHybridRoute(route: string): boolean {
    // Si no está en modern routes, se considera híbrida por defecto
    return !this.isModernRoute(route);
  }

  /**
   * Marca una ruta como completamente migrada
   * Útil para ir habilitando rutas progresivamente
   */
  markAsModern(route: string): void {
    this.modernRoutes.add(route);
    this.hybridRoutes.delete(route);
  }

  /**
   * Obtiene todas las rutas de GlobalRoutes como array
   */
  getAllGlobalRoutes(): string[] {
    return Object.values(GlobalRoutes);
  }

  /**
   * Verifica si una ruta legacy debe redirigir a una ruta Angular moderna
   */
  getLegacyToModernMapping(legacyRoute: string): string | null {
    // Mapeo de rutas legacy a rutas Angular modernas
    const mappings: Record<string, string> = {
      // Ejemplos de mapeo:
      // 'old/sale-page': 'sales/invoice-page',
      // 'old/customer-page': 'customer/company-page-customer',
    };

    return mappings[legacyRoute] ?? null;
  }
}
