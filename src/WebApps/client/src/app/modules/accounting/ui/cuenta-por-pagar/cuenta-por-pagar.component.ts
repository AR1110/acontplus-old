import { Component } from '@angular/core';
import { MatCard, MatCardContent } from '@angular/material/card';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { CuentaPorPagarListaComponent } from '@accounting/ui/cuenta-por-pagar/components/cuenta-por-pagar-lista/cuenta-por-pagar-lista.component';


@Component({
    selector: 'app-cuenta-por-pagar-page',
    imports: [
        MatCard,
        MatCardContent,
        BreadcrumbComponent,
        CuentaPorPagarListaComponent
    ],
    templateUrl: './cuenta-por-pagar.component.html',
    styles: ``
})
export class CuentaPorPagarComponent {


}
