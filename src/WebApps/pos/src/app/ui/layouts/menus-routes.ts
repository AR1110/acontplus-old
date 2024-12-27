

type MenusRoute = {
  path: string;
  title: string;
  icon?: string;
  children?: any[];
};

export const menusRoutes: MenusRoute[] = [
  {
    path: 'dashboard',
    title: 'Dashboard',
    icon: 'home',

  },
  {
    path: 'pos',
    title: 'POS',
    icon: 'shopping_cart',

  },
  {
    path: 'order',
    title: 'Ordenes',
    icon: 'list_alt',
  },
  {
    path: 'customer',
    title: 'Clientes',
    icon: 'people',
  },

];
