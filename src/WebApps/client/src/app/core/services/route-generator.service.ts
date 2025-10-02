import { MenuConfig, MenuItemList } from '../../layouts/main-layout/menu.types';
import { MenuUtils } from '@core/utils/menu.utils';
import { Route } from '@angular/router';

export class RouteGeneratorService {
  /**
   * Converts menu item to Angular route
   */
  static itemToRoute(item: MenuItemList): Route {
    const route: Route = {
      path: item.route,
      data: {
        ...item.data,
        menuItem: item, // Store original menu item for reference
      },
    };

    // Determine route type based on configuration
    const routeType = this.determineRouteType(item);

    switch (routeType) {
      case 'lazy':
        this.configureLazyRoute(route, item);
        break;
      case 'container':
        this.configureContainerRoute(route, item);
        break;
      case 'direct':
      default:
        this.configureDirectRoute(route, item);
        break;
    }

    // Add common route properties
    this.addCommonRouteProperties(route, item);

    return route;
  }

  /**
   * Determines the type of route based on item configuration
   */
  private static determineRouteType(item: MenuItemList): 'direct' | 'lazy' | 'container' {
    if (item.routeType) {
      return item.routeType;
    }

    if (item.loadChildren) {
      return 'lazy';
    }

    if (item.subItems && item.subItems.length > 0) {
      return item.hasRootComponent || item.rootComponent ? 'container' : 'direct';
    }

    return 'direct';
  }

  /**
   * Configures a direct route (component-based)
   */
  private static configureDirectRoute(route: Route, item: MenuItemList): void {
    if (item.component) {
      route.component = item.component;
    }

    // Handle redirects
    if (item.redirectTo) {
      route.redirectTo = item.redirectTo;
      if (item.routeMatch) {
        route.pathMatch = item.routeMatch;
      }
    }

    // Handle direct children (without container component)
    if (
      item.subItems &&
      item.subItems.length > 0 &&
      !item.hasRootComponent &&
      !item.rootComponent
    ) {
      route.children = item.subItems.map((subItem) => this.itemToRoute(subItem));
    }
  }

  /**
   * Configures a lazy-loaded route
   */
  private static configureLazyRoute(route: Route, item: MenuItemList): void {
    if (item.loadChildren) {
      route.loadChildren = item.loadChildren;
    }
  }

  /**
   * Configures a container route (with root component for children)
   */
  private static configureContainerRoute(route: Route, item: MenuItemList): void {
    // Set the container component
    if (item.rootComponent) {
      route.component = item.rootComponent;
    } else if (item.component) {
      route.component = item.component;
    }

    // Add children routes
    if (item.subItems && item.subItems.length > 0) {
      route.children = [
        ...item.subItems.map((subItem) => this.itemToRoute(subItem)),
        // Add empty path redirect if needed
        {
          path: '',
          redirectTo: item.subItems[0]?.route || '',
          pathMatch: 'full',
        },
      ];
    }
  }

  /**
   * Adds common properties to all route types
   */
  private static addCommonRouteProperties(route: Route, item: MenuItemList): void {
    // Add guards
    if (item.guards?.canActivate || item.canActivate) {
      route.canActivate = item.guards?.canActivate || item.canActivate;
    }

    if (item.guards?.canDeactivate) {
      route.canDeactivate = item.guards.canDeactivate;
    }

    // Add resolvers
    if (item.resolve) {
      route.resolve = item.resolve;
    }
  }

  /**
   * Generates routes from menu configuration
   */
  static generateRoutes(config: MenuConfig): Route[] {
    // Validate configuration
    const errors = MenuUtils.validateMenuConfig(config);
    if (errors.length > 0) {
      console.error('Menu configuration errors:', errors);
      throw new Error(`Invalid menu configuration: ${errors.join(', ')}`);
    }

    // Sort items
    const sortedItems = MenuUtils.sortMenuItems(config.items);

    // Generate routes
    const routes: Route[] = [];

    if (config.rootComponent) {
      // If there's a root component, wrap all routes as children
      routes.push({
        path: '',
        component: config.rootComponent,
        data: config.baseData,
        children: [
          ...sortedItems.map((item) => this.itemToRoute(item)),
          // Add default redirect if specified
          ...(config.defaultRoute
            ? [
                {
                  path: '',
                  redirectTo: config.defaultRoute,
                  pathMatch: 'full' as const,
                },
              ]
            : []),
        ],
      });
    } else {
      // Direct routes without wrapper component
      routes.push(...sortedItems.map((item) => this.itemToRoute(item)));

      // Add default redirect if specified
      if (config.defaultRoute) {
        routes.push({
          path: '',
          redirectTo: config.defaultRoute,
          pathMatch: 'full',
        });
      }
    }

    return routes;
  }

  /**
   * Generates lazy loading routes for feature modules
   */
  static generateLazyRoutes(items: MenuItemList[]): Route[] {
    return items.map((item) => ({
      path: item.route,
      loadChildren: item.loadChildren!,
      data: item.data,
    }));
  }
}
