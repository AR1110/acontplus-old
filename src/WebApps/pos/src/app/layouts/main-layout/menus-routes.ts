

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
    icon: 'cogs',

  },
  {
    path: 'pos',
    title: 'POS',
    icon: 'lock',

  },
  {
    path: 'order',
    title: 'Ordenes',
    icon: 'money-check-dollar',
  },
  {
    path: 'customer',
    title: 'Clientes',
    icon: 'money-check-dollar',
  },

];
