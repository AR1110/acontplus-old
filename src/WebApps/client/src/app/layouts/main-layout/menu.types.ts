import { Type } from '@angular/core';
import { Route } from '@angular/router';

export interface MenuItemData {
  breadcrumb?: string;
  title?: string;
  description?: string;
  permissions?: string[];
  metadata?: Record<string, any>;
}

export interface MenuItemList {
  id?: string;
  icon?: string;
  label?: string;
  route: string;
  subItems?: MenuItemList[];
  component?: Type<unknown>;
  data?: MenuItemData;
  loadChildren?: () => Promise<Route[]>;
  redirectTo?: string;
  routeMatch?: 'full' | 'prefix';
  canActivate?: any[];
  resolve?: Record<string, any>;
  hidden?: boolean;
  disabled?: boolean;
  order?: number;
  guards?: {
    canActivate?: any[];
    canLoad?: any[];
    canDeactivate?: any[];
  };
  // Nuevas propiedades para mayor flexibilidad
  hasRootComponent?: boolean; // Si true, crea un componente contenedor para sub-rutas
  rootComponent?: Type<unknown>; // Componente específico para este nivel
  routeType?: 'direct' | 'lazy' | 'container'; // Tipo de ruta
}

export interface MenuConfig {
  items: MenuItemList[];
  defaultRoute?: string;
  rootComponent?: Type<unknown>;
  baseData?: MenuItemData;
}
