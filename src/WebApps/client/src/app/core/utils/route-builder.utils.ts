import {MenuItemList} from "../../layouts/main-layout/menu.types";

export class RouteBuilderUtils {
  /**
   * Construye la ruta completa para navegación basada en la configuración
   */
  static buildNavigationRoute(item: MenuItemList, parentPath = ''): string {
    const currentPath = parentPath ? `${parentPath}/${item.route}` : item.route;

    // Si es ruta raíz sin parent
    if (!parentPath) {
      return item.route;
    }

    return currentPath;
  }

  /**
   * Determina si un item es navegable (puede ser clickeado para navegar)
   */
  static isNavigableItem(item: MenuItemList): boolean {
    // Si tiene component o loadChildren, es navegable
    if (item.component || item.loadChildren) {
      return true;
    }

    // Si tiene redirectTo, es navegable
    if (item.redirectTo) {
      return true;
    }

    // Si no tiene subitems, asumimos que es navegable
    if (!item.subItems || item.subItems.length === 0) {
      return true;
    }

    // Si tiene container type, también es navegable
    // if (item.routeType === 'container' || item.hasRootComponent || item.rootComponent) {
    //   return true;
    // }

    return false;
  }

  /**
   * Construye el routerLink apropiado para el template
   */
  static buildRouterLink(item: MenuItemList, parentRoute?: string): string | string[] {
    if (item.redirectTo) {
      return item.redirectTo;
    }

    // Para items de primer nivel
    if (!parentRoute) {
      return `/${item.route}`;
    }

    // Para subitems
    return `/${parentRoute}/${item.route}`;
  }

  /**
   * Obtiene la ruta completa desde la raíz
   */
  static getFullRoute(item: MenuItemList, menuItems: MenuItemList[]): string {
    const pathParts: string[] = [];

    // Buscar el parent de este item
    const parent = this.findParentItem(item, menuItems);

    if (parent) {
      // Si el parent es container type, incluir su ruta
      if (parent.routeType === 'container' || parent.hasRootComponent || parent.rootComponent) {
        pathParts.push(parent.route);
      }
    }

    pathParts.push(item.route);

    return '/' + pathParts.join('/');
  }

  /**
   * Encuentra el item padre de un subitem
   */
  static findParentItem(targetItem: MenuItemList, menuItems: MenuItemList[]): MenuItemList | null {
    for (const item of menuItems) {
      if (item.subItems) {
        for (const subItem of item.subItems) {
          if (subItem === targetItem || subItem.id === targetItem.id) {
            return item;
          }
          // Búsqueda recursiva para subitems anidados
          const found = this.findParentItem(targetItem, item.subItems);
          if (found) return item;
        }
      }
    }
    return null;
  }
}
