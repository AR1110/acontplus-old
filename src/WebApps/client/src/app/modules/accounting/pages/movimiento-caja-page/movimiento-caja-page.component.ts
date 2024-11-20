import { Component } from '@angular/core';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { EgresoIngresoCajaComponent } from './egreso-ingreso-caja/egreso-ingreso-caja.component';
import { AnticipoComponent } from './anticipo/anticipo.component';
import {BreadcrumbComponent} from "@core/components/breadcrumb/breadcrumb.component";

@Component({
    selector: 'app-movimiento-caja-page',
    imports: [
        BreadcrumbComponent,
        NgbNavModule,
        EgresoIngresoCajaComponent,
        AnticipoComponent
    ],
    templateUrl: './movimiento-caja-page.component.html',
    styleUrl: './movimiento-caja-page.component.scss'
})
export class MovimientoCajaPageComponent {
  active = 1;
}
