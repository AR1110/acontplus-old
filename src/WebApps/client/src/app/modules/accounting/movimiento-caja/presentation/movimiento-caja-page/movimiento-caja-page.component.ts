import { ChangeDetectionStrategy, Component } from '@angular/core';
import { EgresoIngresoCajaComponent } from '@accounting/movimiento-caja/presentation/egreso-ingreso-caja/egreso-ingreso-caja.component';
import { AnticipoComponent } from '@accounting/movimiento-caja/presentation/anticipo/anticipo.component';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDynamicCardComponent } from '@shared/components/mat-dynamic-card/mat-dynamic-card.component';

@Component({
  selector: 'app-movimiento-caja-page',
  imports: [
    MatTabsModule,
    BreadcrumbComponent,
    EgresoIngresoCajaComponent,
    AnticipoComponent,
    MatDynamicCardComponent,
  ],
  templateUrl: './movimiento-caja-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovimientoCajaPageComponent {}
