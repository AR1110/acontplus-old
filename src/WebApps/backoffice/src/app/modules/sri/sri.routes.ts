import { Route } from '@angular/router';
import { TarifaImpuestoPageComponent } from '@modules/sri/pages/tarifa-impuesto-page/tarifa-impuesto-page.component';
import { CodigoRetencionPageComponent } from '@modules/sri/pages/codigo-retencion-page/codigo-retencion-page.component';
import { PorcentajeRetIvaPageComponent } from '@modules/sri/pages/porcentaje-ret-iva-page/porcentaje-ret-iva-page.component';
import { ActividadEconomicaPageComponent } from '@modules/sri/pages/actividad-economica-page/actividad-economica-page.component';

export const routes: Route[] = [
  {
    path: 'tarifa-impuesto',
    component: TarifaImpuestoPageComponent,
    data: {
      breadcrumb: 'Tarifa Impuesto',
    },
  },
  {
    path: 'codigo-retencion',
    component: CodigoRetencionPageComponent,
    data: {
      breadcrumb: 'Código Retención',
    },
  },
  {
    path: 'porcentaje-ret-iva',
    component: PorcentajeRetIvaPageComponent,
    data: {
      breadcrumb: 'Porcentaje Retención Iva',
    },
  },
  {
    path: 'actividad-economica',
    component: ActividadEconomicaPageComponent,
    data: {
      breadcrumb: 'Actividad Económica',
    },
  },
];
