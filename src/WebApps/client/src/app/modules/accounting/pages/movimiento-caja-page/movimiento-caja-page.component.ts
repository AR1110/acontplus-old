import { Component } from '@angular/core';
import { AccountingModule } from '@modules/accounting/accounting.module';
import { AppModule } from 'src/app/app.module';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { EgresoIngresoCajaComponent } from './egreso-ingreso-caja/egreso-ingreso-caja.component';
import { AnticipoComponent } from './anticipo/anticipo.component';

@Component({
  selector: 'app-movimiento-caja-page',
  standalone: true,
  imports: [
    AppModule, 
    AccountingModule, 
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
