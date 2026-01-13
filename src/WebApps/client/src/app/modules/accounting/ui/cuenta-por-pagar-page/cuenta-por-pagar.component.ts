import { Component } from '@angular/core';
import { DynamicCard } from '@acontplus/ng-components';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { CuentaPorPagarListaComponent } from '@accounting/ui/cuenta-por-pagar-page/components/cuenta-por-pagar-lista/cuenta-por-pagar-lista.component';

@Component({
  selector: 'app-cuenta-por-pagar-page-page',
  imports: [DynamicCard, BreadcrumbComponent, CuentaPorPagarListaComponent],
  templateUrl: './cuenta-por-pagar.component.html',
  styles: ``,
})
export class CuentaPorPagarComponent {}
