import {MenuConfig, MenuItemData, MenuItemList} from "src/app/layouts/main-layout/menu.types";

export class MenuUtils {
  /**
   * Validates a menu item structure
   */
  static validateMenuItem(item: MenuItemList, path = ''): string[] {
    const errors: string[] = [];
    const currentPath = path ? `${path}.${item.route}` : item.route;

    // Basic validations
    if (!item.route && !item.redirectTo) {
      errors.push(`${currentPath}: Menu item must have either 'route' or 'redirectTo'`);
    }

    if (item.component && item.loadChildren) {
      errors.push(`${currentPath}: Cannot have both 'component' and 'loadChildren'`);
    }

    if (item.subItems && item.subItems.length > 0) {
      if (item.component) {
        console.warn(`${currentPath}: Component defined with subItems. Component will be ignored.`);
      }

      // Validate sub-items recursively
      item.subItems.forEach(subItem => {
        errors.push(...this.validateMenuItem(subItem, currentPath));
      });
    }

    return errors;
  }

  /**
   * Validates the entire menu configuration
   */
  static validateMenuConfig(config: MenuConfig): string[] {
    const errors: string[] = [];
    const routes = new Set<string>();

    config.items.forEach(item => {
      // Check for duplicate routes
      if (routes.has(item.route)) {
        errors.push(`Duplicate route found: ${item.route}`);
      }
      routes.add(item.route);

      // Validate individual items
      errors.push(...this.validateMenuItem(item));
    });

    return errors;
  }

  /**
   * Sorts menu items by order property
   */
  static sortMenuItems(items: MenuItemList[]): MenuItemList[] {
    return items
      .filter(item => !item.hidden)
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .map(item => ({
        ...item,
        subItems: item.subItems ? this.sortMenuItems(item.subItems) : undefined
      }));
  }

  /**
   * Flattens menu structure to get all routes
   */
  static flattenMenuItems(items: MenuItemList[]): MenuItemList[] {
    const flattened: MenuItemList[] = [];

    items.forEach(item => {
      flattened.push(item);
      if (item.subItems) {
        flattened.push(...this.flattenMenuItems(item.subItems));
      }
    });

    return flattened;
  }

  /**
   * Finds a menu item by route
   */
  static findMenuItem(items: MenuItemList[], route: string): MenuItemList | null {
    for (const item of items) {
      if (item.route === route) {
        return item;
      }
      if (item.subItems) {
        const found = this.findMenuItem(item.subItems, route);
        if (found) return found;
      }
    }
    return null;
  }

  /**
   * Gets breadcrumb trail for a route
   */
  static getBreadcrumbTrail(items: MenuItemList[], targetRoute: string): MenuItemData[] {
    const trail: MenuItemData[] = [];

    const findTrail = (menuItems: MenuItemList[], path: MenuItemData[] = []): boolean => {
      for (const item of menuItems) {
        const currentPath = [...path];
        if (item.data) {
          currentPath.push(item.data);
        }

        if (item.route === targetRoute) {
          trail.push(...currentPath);
          return true;
        }

        if (item.subItems && findTrail(item.subItems, currentPath)) {
          return true;
        }
      }
      return false;
    };

    findTrail(items);
    return trail;
  }
}
