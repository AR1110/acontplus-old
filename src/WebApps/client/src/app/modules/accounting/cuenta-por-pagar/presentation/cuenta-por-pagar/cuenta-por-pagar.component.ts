import { Component } from '@angular/core';
import { DynamicCard } from '@acontplus/ng-components';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { CuentaPorPagarListaComponent } from '@accounting/cuenta-por-pagar/presentation/components/cuenta-por-pagar-lista/cuenta-por-pagar-lista.component';

@Component({
  selector: 'app-cuenta-por-pagar-page',
  imports: [DynamicCard, BreadcrumbComponent, CuentaPorPagarListaComponent],
  templateUrl: './cuenta-por-pagar.component.html',
  styles: ``,
})
export class CuentaPorPagarComponent {}
