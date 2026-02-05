import { Route } from '@angular/router';

export const routes: Route[] = [
  {
    path: 'products',
    title: 'Items',
    loadComponent: () => import('@restaurant/ui/items/items').then((m) => m.Items),
    data: {
      breadcrumb: 'Productos',
    },
    // resolve: {
    //   configData: restaurantConfigDataResolver,
    // },
  },
  {
    path: '',
    loadComponent: () =>
      import('./ui/restaurant-home.component').then((m) => m.RestaurantHomeComponent),
    data: { breadcrumb: 'Restaurante' },
  },

  {
    path: 'item-report',
    title: 'Reporte Items',
    loadComponent: () =>
      import('@restaurant/ui/reports/item-report/item-report.component').then(
        (m) => m.ItemReportComponent,
      ),
    data: {
      breadcrumb: 'Reporte Item-Ingrediente',
    },
  },
  {
    path: 'infrastructure',
    title: 'Restaurant Infrastructure',
    loadComponent: () =>
      import('@restaurant/ui/infrastructure-page/infrastructure-page').then(
        (m) => m.InfrastructurePage,
      ),
    data: {
      breadcrumb: 'Configuración del Restaurante',
    },
  },
  {
    path: 'meal-schedule-setting',
    title: 'Configuración de Horarios TPV',
    loadComponent: () =>
      import(
        '@restaurant/ui/meal-schedule-setting/meal-schedule-setting-list/meal-schedule-setting-list'
      ).then((m) => m.MealScheduleSettingList),
    data: {
      breadcrumb: 'Configuración de Horarios TPV',
    },
  },
  {
    path: 'meal-consumption-list',
    title: 'Consumo de Comidas',
    loadComponent: () =>
      import('@restaurant/ui/meal-consumption/meal-consumption-list/meal-consumption-list').then(
        (m) => m.MealConsumptionList,
      ),
    data: {
      breadcrumb: 'Consumo de Comidas',
    },
  },
  {
    path: 'promotions',
    loadComponent: () => import('@restaurant/ui/promotions/promotions').then((m) => m.Promotions),
    data: { breadcrumb: 'Promociones' },
  },
];
