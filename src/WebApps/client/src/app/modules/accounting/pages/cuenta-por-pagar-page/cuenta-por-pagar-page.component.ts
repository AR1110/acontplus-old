import { Component, inject, model, signal } from '@angular/core';
import { MatCard, MatCardContent } from '@angular/material/card';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { BreadcrumbComponent } from '@core/components/breadcrumb/breadcrumb.component';
import { GroupedEstab, GroupedEstabPuntoEmision } from '@core/models/estab.model';
import { ToasterService } from '@core/services/toaster.service';
import { formatDateToString } from '@core/utils/date.util';
import { getValidId } from '@core/utils/utils';
import { CuentaPorPagarListaComponent } from '@modules/accounting/components/cuenta-por-pagar/cuenta-por-pagar-lista/cuenta-por-pagar-lista.component';
import { CuentaPorPagarService } from '@modules/accounting/services/cuenta-por-pagar.service';
import { ColumnDefinition } from '@shared/models/mat-table-models/column-definition.model';
import { MatPagination } from '@shared/models/pagination.model';
import { finalize, switchMap, throwError } from 'rxjs';

@Component({
  selector: 'app-cuenta-por-pagar-page',
  standalone: true,
  imports: [
    MatCard,
    MatCardContent,
    BreadcrumbComponent,
    CuentaPorPagarListaComponent
  ],
  templateUrl: './cuenta-por-pagar-page.component.html',
  styles: ``
})
export class CuentaPorPagarPageComponent {


}
