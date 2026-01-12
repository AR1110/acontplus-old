import { ChangeDetectionStrategy, Component } from '@angular/core';
import { EgresoIngresoCaja } from '@accounting/movimiento-caja/presentation/egreso-ingreso-caja/egreso-ingreso-caja';
import { AnticipoComponent } from '@accounting/movimiento-caja/presentation/anticipo/anticipo.component';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { MatTabsModule } from '@angular/material/tabs';
import { DynamicCard } from '@acontplus/ng-components';

@Component({
  selector: 'app-movimiento-caja-page-page',
  imports: [
    MatTabsModule,
    BreadcrumbComponent,
    EgresoIngresoCaja,
    AnticipoComponent,
    DynamicCard,
  ],
  templateUrl: './movimiento-caja-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovimientoCajaPage {}
